import {
  and,
  or,
  eq,
  gt,
  lte,
  ilike,
  inArray,
  arrayContains,
  arrayOverlaps,
  exists,
  asc,
  desc,
  sql,
  type SQL,
} from 'drizzle-orm'
import { db } from '@/lib/db'
import { parts, partStock } from '@/lib/db/schema'
import { brands as brandCfg, models as modelCfg } from '@/lib/data'
import { imagesByPart } from '@/lib/services/partImages'
import { fallbackImage } from '@/lib/partImage'

const PAGE_SIZE = 24

// Map a Drizzle part row (+ its stock) to the JSON shape the storefront expects
// (snake_case price_b2b, nested part_stock — same contract the old Supabase
// queries produced, so the frontend keeps working unchanged).
export interface PartStockEntry {
  city: string
  qty: number
}

/** Card thumbnail, product-page main image, zoom. See lib/services/partImages.ts. */
export interface PartImageEntry {
  url200: string
  url800: string
  url1600: string
}

export interface PartDTO {
  id: string
  oem: string | null
  name: string
  brand: string | null
  type: string
  category: string | null
  fits: string[]
  price: number
  price_b2b: number | null // wholesale — null unless the viewer is b2b/admin (#49)
  price_usd: number | null
  vat: number
  eta: string | null
  img: string | null
  specs: Record<string, string>
  cross: string[]
  rating: number | null
  reviews: number
  part_stock: PartStockEntry[]
  images: PartImageEntry[] // empty only when the part has no photo and classifies to nothing
}

/** Options threaded from the API routes; `b2b` = viewer may see wholesale prices. */
export interface PartViewOpts {
  b2b?: boolean
}

type PartRow = typeof parts.$inferSelect

// Vendor photos when we have them; otherwise one stand-in, repeated across the
// sizes because the stand-in sources publish a single resolution.
function toImages(p: PartRow, images: PartImageEntry[]): PartImageEntry[] {
  if (images.length > 0) return images
  const url = fallbackImage(p.oem, p.name)
  return url ? [{ url200: url, url800: url, url1600: url }] : []
}

// Exported for unit tests — pure row→DTO mapping.
export function toDTO(
  p: PartRow,
  stock: PartStockEntry[],
  opts: PartViewOpts = {},
  images: PartImageEntry[] = [],
): PartDTO {
  return {
    id: p.id,
    oem: p.oem,
    name: p.name,
    brand: p.brand,
    type: p.type,
    category: p.category,
    fits: p.fits ?? [],
    price: p.price,
    price_b2b: opts.b2b ? p.priceB2b : null,
    price_usd: p.priceUsd,
    vat: p.vat,
    eta: p.eta,
    img: p.img,
    specs: p.specs ?? {},
    cross: p.cross ?? [],
    rating: p.rating,
    reviews: p.reviews,
    part_stock: stock.map((s) => ({ city: s.city, qty: s.qty })),
    images: toImages(p, images),
  }
}

async function stockByPart(ids: string[]) {
  if (ids.length === 0) return new Map<string, { city: string; qty: number }[]>()
  const rows = await db
    .select({ partId: partStock.partId, city: partStock.city, qty: partStock.qty })
    .from(partStock)
    .where(inArray(partStock.partId, ids))
  const map = new Map<string, { city: string; qty: number }[]>()
  for (const r of rows) {
    const arr = map.get(r.partId) ?? []
    arr.push({ city: r.city, qty: r.qty })
    map.set(r.partId, arr)
  }
  return map
}

// Article numbers are typed every which way — "91-00254", "91 00254", "9100254".
// Compare both sides with everything but letters/digits stripped, against OEM,
// the vendor SKU and cross numbers. 20k rows scan fine without an index; the
// scale-up path is a generated normalized column + pg_trgm.
function articleCond(q: string): SQL | undefined {
  const norm = q.toUpperCase().replace(/[^A-ZА-ЯЁ0-9]/g, '')
  if (norm.length < 3) return undefined // too short — would over-match
  const like = `%${norm}%`
  return or(
    sql`regexp_replace(upper(coalesce(${parts.oem}, '')), '[^A-ZА-ЯЁ0-9]', '', 'g') like ${like}`,
    sql`regexp_replace(upper(${parts.vendorSku}), '[^A-ZА-ЯЁ0-9]', '', 'g') like ${like}`,
    sql`exists (select 1 from unnest(coalesce(${parts.cross}, '{}')) as cn where regexp_replace(upper(cn), '[^A-ZА-ЯЁ0-9]', '', 'g') like ${like})`,
  )
}

export interface PartFilters {
  system?: string
  brand?: string // truck brand id
  model?: string // truck model id
  partBrand?: string // parts manufacturer
  q?: string
  oemOnly?: boolean
  inStock?: boolean
  priceMax?: number
  sort?: string
  page?: number
  ids?: string[] // exact-id lookup (cart price refresh); capped at MAX_IDS
}

const MAX_IDS = 100 // matches the order line-item cap

export async function listParts(f: PartFilters, opts: PartViewOpts = {}) {
  const page = Math.max(1, f.page ?? 1)
  const ids = f.ids?.slice(0, MAX_IDS)
  const conds: SQL[] = [eq(parts.active, true)]

  if (ids?.length) conds.push(inArray(parts.id, ids))

  if (f.priceMax != null) conds.push(lte(parts.price, f.priceMax))
  if (f.system) conds.push(eq(parts.category, f.system))
  if (f.oemOnly) conds.push(eq(parts.type, 'OEM'))
  if (f.partBrand) conds.push(ilike(parts.brand, `%${f.partBrand}%`))

  // Truck brand/model → match against the fits[] array.
  if (f.brand) {
    const b = brandCfg.find((x) => x.id === f.brand)
    const dbName = b?.dbName ?? f.brand
    if (f.model) {
      const m = (modelCfg[f.brand] ?? []).find((x) => x.id === f.model)
      conds.push(arrayContains(parts.fits, [m?.fits ?? `${dbName} ${f.model}`]))
    } else {
      const brandModels = modelCfg[f.brand] ?? []
      if (brandModels.length > 0) {
        conds.push(arrayOverlaps(parts.fits, brandModels.map((m) => m.fits)))
      } else {
        conds.push(arrayContains(parts.fits, [dbName]))
      }
    }
  }

  if (f.q) {
    const clean = f.q.trim()
    const words = clean.split(/\s+/).filter(Boolean)
    const nameCond =
      words.length > 1
        ? and(...words.map((w) => ilike(parts.name, `%${w}%`)))!
        : ilike(parts.name, `%${clean}%`)
    conds.push(or(nameCond, ilike(parts.oem, `%${clean}%`), articleCond(clean))!)
  }

  if (f.inStock) {
    conds.push(
      exists(
        db
          .select({ one: sql`1` })
          .from(partStock)
          .where(and(eq(partStock.partId, parts.id), gt(partStock.qty, 0))),
      ),
    )
  }

  const where = and(...conds)

  const orderBy =
    f.sort === 'price-asc' ? asc(parts.price) : f.sort === 'price-desc' ? desc(parts.price) : asc(parts.id)

  const [{ total }] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(parts)
    .where(where)

  // Exact-id lookups return every requested row on one page.
  const limit = ids?.length ? ids.length : PAGE_SIZE
  const rows = await db
    .select()
    .from(parts)
    .where(where)
    .orderBy(orderBy)
    .limit(limit)
    .offset(ids?.length ? 0 : (page - 1) * PAGE_SIZE)

  const ids_ = rows.map((r) => r.id)
  // Cards only ever render the thumbnail — don't drag the whole gallery over.
  const [stock, images] = await Promise.all([stockByPart(ids_), imagesByPart(ids_, { primaryOnly: true })])
  const items = rows.map((r) => toDTO(r, stock.get(r.id) ?? [], opts, images.get(r.id) ?? []))

  return { items, total, page, limit: PAGE_SIZE }
}

export async function getPart(id: string, opts: PartViewOpts = {}) {
  const [row] = await db.select().from(parts).where(eq(parts.id, id)).limit(1)
  if (!row) return null
  const [stock, images] = await Promise.all([stockByPart([id]), imagesByPart([id])])
  return toDTO(row, stock.get(id) ?? [], opts, images.get(id) ?? [])
}

// Lightweight typeahead used by the search box. Carries the card-sized
// thumbnail only — the dropdown never shows anything bigger.
export async function searchPartsLite(q: string, limit = 8) {
  const rows = await db
    .select({ id: parts.id, name: parts.name, oem: parts.oem, price: parts.price })
    .from(parts)
    .where(
      and(
        eq(parts.active, true),
        gt(parts.price, 0),
        or(ilike(parts.name, `%${q}%`), ilike(parts.oem, `%${q}%`), arrayContains(parts.cross, [q]), articleCond(q)),
      ),
    )
    .limit(limit)

  const images = await imagesByPart(rows.map((r) => r.id), { primaryOnly: true })
  return rows.map((r) => ({
    ...r,
    img: images.get(r.id)?.[0]?.url200 ?? fallbackImage(r.oem, r.name),
  }))
}

// Real per-category and per-brand part counts for storefront filters and tiles.
// Replaces the static snapshot numbers in lib/data.ts so the catalog sidebar,
// homepage tiles, and podbor wizard reflect actual inventory instead of fictional
// totals that promised thousands of parts where only dozens exist.
export interface FacetCounts {
  categories: Record<string, number> // system id → active part count
  brands: Record<string, number> // truck brand id → active part count
}

export async function catalogFacetCounts(): Promise<FacetCounts> {
  const catRows = await db
    .select({ category: parts.category, count: sql<number>`count(*)::int` })
    .from(parts)
    .where(eq(parts.active, true))
    .groupBy(parts.category)

  const categories: Record<string, number> = {}
  for (const r of catRows) if (r.category) categories[r.category] = r.count

  // Brand counts mirror the match used by listParts(): a part belongs to a brand
  // when its fits[] overlaps the brand's configured model fits, or — for brands
  // with no configured models — carries an exact `dbName` fits entry.
  const activeRows = await db.select({ fits: parts.fits }).from(parts).where(eq(parts.active, true))

  const brands: Record<string, number> = {}
  for (const b of brandCfg) {
    const modelFits = (modelCfg[b.id] ?? []).map((m) => m.fits)
    const dbName = b.dbName ?? b.id
    brands[b.id] = activeRows.filter((r) => {
      const fits = r.fits ?? []
      return modelFits.length ? fits.some((f) => modelFits.includes(f)) : fits.includes(dbName)
    }).length
  }

  return { categories, brands }
}

// Aggregate part counts per manufacturer brand.
export async function partBrandCounts() {
  const rows = await db
    .select({ name: parts.brand, count: sql<number>`count(*)::int` })
    .from(parts)
    .where(and(eq(parts.active, true), sql`${parts.brand} is not null and ${parts.brand} <> ''`))
    .groupBy(parts.brand)
    .orderBy(desc(sql`count(*)`))
  return rows.map((r) => ({ name: r.name ?? '', count: r.count }))
}
