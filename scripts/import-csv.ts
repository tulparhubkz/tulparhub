/**
 * Import the vendor price/stock CSV (the current source of truth) into Postgres.
 *
 *   yarn import-csv                 # uses CSV_PATH + VENDOR_ID from .env
 *   CSV_PATH=./foo.csv yarn import-csv
 *
 * Idempotent: parts are keyed on (vendor_id, vendor_sku) with a deterministic id,
 * so re-running updates prices/stock instead of creating duplicates. Parts that
 * disappear from the file are marked inactive. Each run is recorded in sync_runs.
 */
import 'dotenv/config'
import * as fs from 'fs'
import * as readline from 'readline'
import { eq, sql } from 'drizzle-orm'
import { db } from '../lib/db'
import { vendors, systems, parts, partStock, syncRuns } from '../lib/db/schema'
import { COL, STOCK_COLS, CATEGORIES, detectCategory, detectFits, num } from '../lib/import/mapping'

const CSV_PATH = process.env.CSV_PATH ?? './example_database.csv'
const VENDOR_ID = process.env.VENDOR_ID ?? 'main'
const USD_RATE = Number(process.env.USD_RATE ?? 470)
const BATCH = 500

type PartRow = typeof parts.$inferInsert
type StockRow = typeof partStock.$inferInsert

async function upsertParts(rows: PartRow[]) {
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH)
    await db
      .insert(parts)
      .values(batch)
      .onConflictDoUpdate({
        target: parts.id,
        set: {
          name: sql`excluded.name`,
          oem: sql`excluded.oem`,
          brand: sql`excluded.brand`,
          type: sql`excluded.type`,
          category: sql`excluded.category`,
          fits: sql`excluded.fits`,
          price: sql`excluded.price`,
          priceB2b: sql`excluded.price_b2b`,
          priceUsd: sql`excluded.price_usd`,
          vat: sql`excluded.vat`,
          eta: sql`excluded.eta`,
          img: sql`excluded.img`,
          specs: sql`excluded.specs`,
          cross: sql`excluded.cross`,
          active: sql`true`,
          updatedAt: sql`now()`,
        },
      })
  }
}

async function upsertStock(rows: StockRow[]) {
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH)
    await db
      .insert(partStock)
      .values(batch)
      .onConflictDoUpdate({
        target: [partStock.partId, partStock.city],
        set: { qty: sql`excluded.qty`, updatedAt: sql`now()` },
      })
  }
}

async function main() {
  if (!fs.existsSync(CSV_PATH)) {
    throw new Error(`CSV not found at ${CSV_PATH} (set CSV_PATH in .env)`)
  }

  console.log(`\n📦 Importing ${CSV_PATH} → vendor "${VENDOR_ID}"\n`)

  // Ensure vendor + categories exist.
  await db.insert(vendors).values({ id: VENDOR_ID, name: VENDOR_ID }).onConflictDoNothing()
  await db
    .insert(systems)
    .values(CATEGORIES.map((c) => ({ id: c.id, ru: c.ru, icon: c.id })))
    .onConflictDoNothing()

  // Open a sync run.
  const [run] = await db
    .insert(syncRuns)
    .values({ vendorId: VENDOR_ID, source: 'csv' })
    .returning({ id: syncRuns.id })

  // Mark this vendor's parts inactive; the upsert re-activates the ones present.
  await db.update(parts).set({ active: false }).where(eq(parts.vendorId, VENDOR_ID))

  const rl = readline.createInterface({
    input: fs.createReadStream(CSV_PATH, { encoding: 'utf8' }),
    crlfDelay: Infinity,
  })

  const partRows: PartRow[] = []
  const stockRows: StockRow[] = []
  let lineNum = 0
  let read = 0

  try {
    for await (const line of rl) {
      lineNum++
      if (lineNum === 1) continue // header
      if (!line.trim()) continue

      const cols = line.split('\t')
      const name = cols[COL.name]?.trim()
      const sku = cols[COL.code]?.trim()
      const article = cols[COL.article]?.trim() || null
      const brand = cols[COL.brand]?.trim() || null
      const priceRetail = num(cols[COL.priceRetail])
      const priceB2b = num(cols[COL.priceB2b])

      // Skip unnamed / unkeyed / not-yet-priced rows (not sellable).
      if (!name || !sku || priceRetail <= 0) continue
      read++

      const id = `${VENDOR_ID}:${sku}`
      const category = detectCategory(name)
      const fits = detectFits(name)

      const stock: Record<string, number> = {}
      let total = 0
      for (const [city, idxs] of Object.entries(STOCK_COLS)) {
        const qty = idxs.reduce((sum, i) => sum + num(cols[i]), 0)
        stock[city] = qty
        total += qty
      }

      partRows.push({
        id,
        vendorId: VENDOR_ID,
        vendorSku: sku,
        oem: article,
        name,
        brand,
        type: 'OEM',
        category,
        fits,
        price: priceRetail,
        priceB2b: priceB2b || null,
        priceUsd: Math.round(priceRetail / USD_RATE),
        vat: 12,
        eta: total > 0 ? 'В наличии' : 'Под заказ 3–5 дней',
        img: category,
        specs: { Артикул: article ?? '', Бренд: brand ?? '', Код: sku },
        cross: [article, sku].filter(Boolean) as string[],
      })

      for (const [city, qty] of Object.entries(stock)) {
        stockRows.push({ partId: id, city, qty })
      }
    }

    console.log(`Parsed ${read} sellable rows. Upserting…`)
    await upsertParts(partRows)
    console.log(`  ✓ parts: ${partRows.length}`)
    await upsertStock(stockRows)
    console.log(`  ✓ stock rows: ${stockRows.length}`)

    await db
      .update(syncRuns)
      .set({
        finishedAt: new Date(),
        status: 'success',
        rowsRead: read,
        partsUpserted: partRows.length,
        stockUpserted: stockRows.length,
      })
      .where(eq(syncRuns.id, run.id))

    console.log('\n✅ Import complete.\n')
  } catch (err) {
    await db
      .update(syncRuns)
      .set({ finishedAt: new Date(), status: 'error', error: String(err) })
      .where(eq(syncRuns.id, run.id))
    throw err
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
