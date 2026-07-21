/**
 * Apply the emailed per-city price list to the catalogue.
 *
 * This feed is a REFRESH, not a source of truth: it carries no vendor code and
 * no retail price, so it can neither create parts nor set `parts.price`. It
 * matches existing parts on (article, brand) — the same join `part_images`
 * uses — and updates only two things, scoped to the one city the file covers:
 *
 *   • parts.price_b2b   (wholesale)
 *   • part_stock[city]  (that warehouse's quantity)
 *
 * Parts absent from the file have their stock in THIS city zeroed (sold out),
 * but are never deactivated and their other cities are untouched — which is why
 * the Almaty and Astana mails don't clobber each other.
 */
import { and, eq, inArray, notInArray, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { parts, partStock, syncRuns, vendors } from '@/lib/db/schema'
import { readSheet } from '@/lib/import/xlsx'
import { parsePriceFeed, type PriceFeed, type FeedCity } from '@/lib/import/priceFeed'

const BATCH = 500

/** Join key, identical to the image matcher's — cased/padded inconsistently. */
export function joinKey(article: string, brand: string | null): string {
  return `${article.trim().toUpperCase()}|${(brand ?? '').trim().toUpperCase()}`
}

export interface CatalogPart {
  id: string
  oem: string | null
  brand: string | null
}

export interface FeedMatch {
  /** parts.id → new wholesale price. */
  priceByPart: Map<string, number>
  /** parts.id → quantity in this city. */
  qtyByPart: Map<string, number>
  matchedRows: number
  /** Feed rows whose (article, brand) is not in the catalogue. */
  unmatched: Array<{ brand: string; article: string }>
}

/**
 * Resolve feed rows against the catalogue — pure, so it carries the test load.
 *
 * A key can map to several parts (two SKUs sharing an article); all of them get
 * the refreshed price and stock, matching how the image import fans out. When a
 * key repeats in the feed the last row wins, same as re-running the import.
 */
export function matchFeed(feed: PriceFeed, catalog: CatalogPart[]): FeedMatch {
  const partsByKey = new Map<string, string[]>()
  for (const part of catalog) {
    if (!part.oem) continue
    const key = joinKey(part.oem, part.brand)
    const arr = partsByKey.get(key)
    if (arr) arr.push(part.id)
    else partsByKey.set(key, [part.id])
  }

  const priceByPart = new Map<string, number>()
  const qtyByPart = new Map<string, number>()
  const unmatched: Array<{ brand: string; article: string }> = []
  let matchedRows = 0

  for (const row of feed.rows) {
    const ids = partsByKey.get(joinKey(row.article, row.brand))
    if (!ids) {
      unmatched.push({ brand: row.brand, article: row.article })
      continue
    }
    matchedRows++
    for (const id of ids) {
      priceByPart.set(id, row.priceB2b)
      qtyByPart.set(id, row.qty)
    }
  }

  return { priceByPart, qtyByPart, matchedRows, unmatched }
}

export interface PriceImportResult {
  city: FeedCity
  pricedOn: string | null
  rowsRead: number
  matchedRows: number
  unmatchedRows: number
  skippedRows: number
  partsMatched: number
  pricesUpdated: number
  stockUpserted: number
  stockZeroed: number
}

/**
 * Parse an emailed XLSX and write it to the DB under one sync run.
 *
 * The whole feed is parsed and matched in memory before any write, and every
 * write runs in one transaction, so a malformed file or a mid-run failure
 * leaves the catalogue as it was rather than half-updated. Failures are
 * recorded on the run so they surface in /admin/sync.
 */
export async function importPriceFeed(opts: {
  buf: Buffer
  vendorId: string
  fileName?: string
  subject?: string
}): Promise<PriceImportResult> {
  const { buf, vendorId, fileName, subject } = opts

  // Vendor must already exist — this feed refreshes an established catalogue,
  // it never bootstraps one (no retail price, no vendor code).
  const [vendor] = await db
    .select({ id: vendors.id })
    .from(vendors)
    .where(eq(vendors.id, vendorId))
    .limit(1)
  if (!vendor) {
    throw new Error(`Unknown vendor "${vendorId}" — run the price import (yarn import-csv) first`)
  }

  const [run] = await db
    .insert(syncRuns)
    .values({ vendorId, source: 'email-xlsx' })
    .returning({ id: syncRuns.id })

  try {
    const feed = parsePriceFeed(readSheet(buf), { fileName, subject })

    // Without a city we don't know which warehouse to zero — refuse rather than
    // guess and wipe the wrong city's stock.
    const city = feed.city
    if (!city) {
      throw new Error('price feed: city not detected from filename or subject — refusing to import')
    }

    const catalog = await db
      .select({ id: parts.id, oem: parts.oem, brand: parts.brand })
      .from(parts)
      .where(eq(parts.vendorId, vendorId))

    const match = matchFeed(feed, catalog)
    const matchedIds = Array.from(match.priceByPart.keys())

    let stockZeroed = 0
    await db.transaction(async (tx) => {
      // 1. Refresh wholesale price for every matched part.
      const priceRows = Array.from(match.priceByPart.entries())
      for (let i = 0; i < priceRows.length; i += BATCH) {
        const chunk = priceRows.slice(i, i + BATCH)
        // Cast both columns: with every value a bound parameter, Postgres can
        // otherwise fail to infer the VALUES column types.
        const values = sql.join(
          chunk.map(([id, price]) => sql`(${id}::text, ${price}::int)`),
          sql`, `,
        )
        await tx.execute(sql`
          UPDATE ${parts} AS p
          SET price_b2b = v.price, updated_at = now()
          FROM (VALUES ${values}) AS v(id, price)
          WHERE p.id = v.id
        `)
      }

      // 2. Upsert this city's stock for every matched part.
      const stockRows = Array.from(match.qtyByPart.entries()).map(([partId, qty]) => ({
        partId,
        city,
        qty,
      }))
      for (let i = 0; i < stockRows.length; i += BATCH) {
        await tx
          .insert(partStock)
          .values(stockRows.slice(i, i + BATCH))
          .onConflictDoUpdate({
            target: [partStock.partId, partStock.city],
            set: { qty: sql`excluded.qty`, updatedAt: sql`now()` },
          })
      }

      // 3. Zero this city's stock for parts that dropped out of the feed. Scoped
      //    to the vendor and this city; matched parts are excluded so their fresh
      //    quantities survive.
      const vendorParts = tx
        .select({ id: parts.id })
        .from(parts)
        .where(eq(parts.vendorId, vendorId))
      const soldOut = await tx
        .update(partStock)
        .set({ qty: 0, updatedAt: sql`now()` })
        .where(
          and(
            eq(partStock.city, city),
            sql`${partStock.qty} <> 0`,
            inArray(partStock.partId, vendorParts),
            matchedIds.length > 0 ? notInArray(partStock.partId, matchedIds) : undefined,
          ),
        )
        .returning({ partId: partStock.partId })
      stockZeroed = soldOut.length
    })

    const result: PriceImportResult = {
      city,
      pricedOn: feed.pricedOn,
      rowsRead: feed.rows.length,
      matchedRows: match.matchedRows,
      unmatchedRows: match.unmatched.length,
      skippedRows: feed.skipped.length,
      partsMatched: match.priceByPart.size,
      pricesUpdated: match.priceByPart.size,
      stockUpserted: match.qtyByPart.size,
      stockZeroed,
    }

    await db
      .update(syncRuns)
      .set({
        finishedAt: new Date(),
        status: 'success',
        rowsRead: result.rowsRead,
        partsUpserted: result.partsMatched,
        stockUpserted: result.stockUpserted + result.stockZeroed,
      })
      .where(eq(syncRuns.id, run.id))

    return result
  } catch (err) {
    await db
      .update(syncRuns)
      .set({ finishedAt: new Date(), status: 'error', error: String(err) })
      .where(eq(syncRuns.id, run.id))
    throw err
  }
}
