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

const PAGE_SIZE = 24

// Map a Drizzle part row (+ its stock) to the JSON shape the storefront expects
// (snake_case price_b2b, nested part_stock — same contract the old Supabase
// queries produced, so the frontend keeps working unchanged).
type PartRow = typeof parts.$inferSelect
function toDTO(p: PartRow, stock: { city: string; qty: number }[]) {
  return {
    id: p.id,
    oem: p.oem,
    name: p.name,
    brand: p.brand,
    type: p.type,
    category: p.category,
    fits: p.fits ?? [],
    price: p.price,
    price_b2b: p.priceB2b,
    price_usd: p.priceUsd,
    vat: p.vat,
    eta: p.eta,
    img: p.img,
    specs: p.specs ?? {},
    cross: p.cross ?? [],
    rating: p.rating,
    reviews: p.reviews,
    part_stock: stock.map((s) => ({ city: s.city, qty: s.qty })),
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
}

export async function listParts(f: PartFilters) {
  const page = Math.max(1, f.page ?? 1)
  const conds: SQL[] = [eq(parts.active, true)]

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

  const rows = await db
    .select()
    .from(parts)
    .where(where)
    .orderBy(orderBy)
    .limit(PAGE_SIZE)
    .offset((page - 1) * PAGE_SIZE)

  const stock = await stockByPart(rows.map((r) => r.id))
  const items = rows.map((r) => toDTO(r, stock.get(r.id) ?? []))

  return { items, total, page, limit: PAGE_SIZE }
}

export async function getPart(id: string) {
  const [row] = await db.select().from(parts).where(eq(parts.id, id)).limit(1)
  if (!row) return null
  const stock = await stockByPart([id])
  return toDTO(row, stock.get(id) ?? [])
}

// Lightweight typeahead used by the search box.
export async function searchPartsLite(q: string, limit = 8) {
  return db
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
