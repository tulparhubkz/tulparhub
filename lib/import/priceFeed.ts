/**
 * Map the emailed XLSX price list (Прайс TM <город>.xlsx) into normalized rows.
 *
 * This feed is NOT the same shape as the tab-separated export that
 * scripts/import-csv.ts reads. It carries five columns, one warehouse, and no
 * vendor internal code:
 *
 *   Номенклатура | Остаток | Номенклатура.Бренд | Номенклатура.Артикул | Оптовая KZT
 *
 * Columns are located by header text rather than position, because the header
 * block above them (title, currency note, price date) varies between exports.
 */

/** Cities the vendor publishes a per-warehouse price list for. */
export const FEED_CITIES = ['Алматы', 'Астана', 'Уральск', 'Бишкек', 'Павлодар', 'Шымкент'] as const
export type FeedCity = (typeof FEED_CITIES)[number]

export interface PriceRow {
  name: string
  brand: string
  article: string
  qty: number
  priceB2b: number
}

export interface PriceFeed {
  city: FeedCity | null
  /** Date the vendor stamped the prices with, from "Цены указаны на …". */
  pricedOn: string | null
  rows: PriceRow[]
  /** Rows skipped as unusable, with the reason — surfaced in the run summary. */
  skipped: Array<{ row: number; reason: string }>
}

/** Header labels we need, mapped to the field they fill. */
const HEADERS: Array<{ field: keyof ColumnMap; match: (h: string) => boolean }> = [
  { field: 'brand', match: (h) => h.includes('бренд') },
  { field: 'article', match: (h) => h.includes('артикул') },
  { field: 'qty', match: (h) => h.startsWith('остаток') },
  { field: 'price', match: (h) => h.includes('оптов') },
  // Checked last: "Номенклатура.Бренд"/".Артикул" also start with "номенклатура",
  // so the bare name column must not claim them first.
  { field: 'name', match: (h) => h === 'номенклатура' || h.includes('наименование') },
]

interface ColumnMap {
  name: number
  brand: number
  article: number
  qty: number
  price: number
}

/** Locate the header row and the column index of each field we need. */
export function findColumns(grid: string[][]): { headerRow: number; cols: ColumnMap } | null {
  for (let r = 0; r < Math.min(grid.length, 50); r++) {
    const found: Partial<ColumnMap> = {}

    grid[r].forEach((cell, c) => {
      const h = cell.trim().toLowerCase()
      if (!h) return
      const hit = HEADERS.find((x) => x.match(h) && found[x.field] === undefined)
      if (hit) found[hit.field] = c
    })

    const { name, brand, article, qty, price } = found
    if (name !== undefined && brand !== undefined && article !== undefined && qty !== undefined && price !== undefined) {
      return { headerRow: r, cols: { name, brand, article, qty, price } }
    }
  }
  return null
}

/** "Цены указаны на 17.07.2026" → "2026-07-17". */
export function findPricedOn(grid: string[][]): string | null {
  for (let r = 0; r < Math.min(grid.length, 50); r++) {
    for (const cell of grid[r]) {
      const m = /(\d{2})\.(\d{2})\.(\d{4})/.exec(cell)
      if (m) return `${m[3]}-${m[2]}-${m[1]}`
    }
  }
  return null
}

/** Which warehouse the file covers, read from its name or the mail subject. */
export function detectCity(...sources: Array<string | null | undefined>): FeedCity | null {
  for (const s of sources) {
    if (!s) continue
    const found = FEED_CITIES.find((c) => s.toLowerCase().includes(c.toLowerCase()))
    if (found) return found
  }
  return null
}

/** Parse a KZT amount; the export uses plain integers but may pad with spaces. */
function num(raw: string): number {
  const cleaned = raw.replace(/[\s ]/g, '').replace(',', '.')
  const n = Number(cleaned)
  return Number.isFinite(n) ? n : NaN
}

/**
 * Turn a parsed sheet into normalized rows.
 *
 * Rows missing a brand, article or price are dropped rather than guessed at —
 * (brand, article) is the identity of a part in this feed, and a zero price
 * would silently publish a free product.
 */
export function parsePriceFeed(
  grid: string[][],
  opts: { fileName?: string; subject?: string } = {},
): PriceFeed {
  const located = findColumns(grid)
  if (!located) {
    throw new Error(
      'price feed: header row not found — expected Номенклатура / Остаток / Бренд / Артикул / Оптовая',
    )
  }

  const { headerRow, cols } = located
  const rows: PriceRow[] = []
  const skipped: PriceFeed['skipped'] = []

  for (let r = headerRow + 1; r < grid.length; r++) {
    const line = grid[r]
    if (!line || line.length === 0) continue

    const at = (c: number) => (line[c] ?? '').trim()
    const name = at(cols.name)
    const brand = at(cols.brand)
    const article = at(cols.article)
    const qtyRaw = at(cols.qty)
    const priceRaw = at(cols.price)

    // Blank spacer rows separate the header block from the data; skip silently.
    if (!name && !brand && !article && !priceRaw) continue

    if (!brand || !article) {
      skipped.push({ row: r + 1, reason: 'missing brand or article' })
      continue
    }
    const price = num(priceRaw)
    if (!Number.isFinite(price) || price <= 0) {
      skipped.push({ row: r + 1, reason: `unusable price "${priceRaw}"` })
      continue
    }
    const qty = num(qtyRaw)

    rows.push({
      name: name || `${brand} ${article}`,
      brand,
      article,
      qty: Number.isFinite(qty) && qty > 0 ? Math.floor(qty) : 0,
      priceB2b: Math.round(price),
    })
  }

  return {
    city: detectCity(opts.fileName, opts.subject),
    pricedOn: findPricedOn(grid),
    rows,
    skipped,
  }
}
