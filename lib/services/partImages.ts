/**
 * Import the vendor's image export (data/price_images.csv) into `part_images`.
 *
 * The export carries no vendor SKU, so images are joined onto parts by
 * (article, brand) — unique in the price feed bar a handful of rows where two
 * SKUs share an article, and those legitimately want the same photos.
 *
 * A run replaces the vendor's images wholesale. The whole file is parsed before
 * anything is deleted, so a truncated or malformed export leaves the live
 * images intact rather than emptying every product page.
 */
import * as fs from 'fs'
import * as readline from 'readline'
import { and, asc, eq, inArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import { parts, partImages, syncRuns, vendors } from '@/lib/db/schema'
import { parseImageRow, type PartImageRef } from '@/lib/import/images'
import type { NewPartImage } from '@/lib/db/schema'

const BATCH = 500

export interface ImageImportResult {
  rowsRead: number
  rowsWithImages: number
  partsMatched: number
  imagesInserted: number
  unmatchedRows: number
}

/** Join key. Cased and padded inconsistently across the two exports. */
function joinKey(article: string, brand: string | null): string {
  return `${article.toUpperCase()}|${(brand ?? '').trim().toUpperCase()}`
}

async function readCsv(csvPath: string) {
  const byKey = new Map<string, PartImageRef[]>()
  let rowsRead = 0

  const rl = readline.createInterface({
    input: fs.createReadStream(csvPath, { encoding: 'utf8' }),
    crlfDelay: Infinity,
  })

  let lineNum = 0
  for await (const line of rl) {
    lineNum++
    if (lineNum === 1) continue // header
    if (!line.trim()) continue
    rowsRead++

    const row = parseImageRow(line)
    if (!row) continue // no article, or no images (no_match / no_image)
    byKey.set(joinKey(row.article, row.brand), row.images)
  }

  return { byKey, rowsRead }
}

export async function importPartImages(opts: {
  csvPath: string
  vendorId: string
}): Promise<ImageImportResult> {
  const { csvPath, vendorId } = opts
  if (!fs.existsSync(csvPath)) {
    throw new Error(`Image CSV not found at ${csvPath} (set IMAGES_CSV_PATH)`)
  }

  // Images hang off parts, so the price feed has to land first.
  const [vendor] = await db.select({ id: vendors.id }).from(vendors).where(eq(vendors.id, vendorId)).limit(1)
  if (!vendor) {
    throw new Error(`Unknown vendor "${vendorId}" — run the price import (yarn import-csv) first`)
  }

  const [run] = await db
    .insert(syncRuns)
    .values({ vendorId, source: 'images-csv' })
    .returning({ id: syncRuns.id })

  try {
    const { byKey, rowsRead } = await readCsv(csvPath)

    const catalog = await db
      .select({ id: parts.id, oem: parts.oem, brand: parts.brand })
      .from(parts)
      .where(eq(parts.vendorId, vendorId))

    const values: NewPartImage[] = []
    const usedKeys = new Set<string>()

    for (const part of catalog) {
      if (!part.oem) continue
      const key = joinKey(part.oem, part.brand)
      const images = byKey.get(key)
      if (!images) continue

      usedKeys.add(key)
      images.forEach((img, position) => {
        values.push({ partId: part.id, position, ...img })
      })
    }

    // Swap in the new set. Scoped to this vendor so a second feed's images survive.
    const vendorPartIds = db
      .select({ id: parts.id })
      .from(parts)
      .where(eq(parts.vendorId, vendorId))

    await db.transaction(async (tx) => {
      await tx.delete(partImages).where(inArray(partImages.partId, vendorPartIds))
      for (let i = 0; i < values.length; i += BATCH) {
        await tx.insert(partImages).values(values.slice(i, i + BATCH))
      }
    })

    const result: ImageImportResult = {
      rowsRead,
      rowsWithImages: byKey.size,
      partsMatched: new Set(values.map((v) => v.partId)).size,
      imagesInserted: values.length,
      unmatchedRows: byKey.size - usedKeys.size,
    }

    await db
      .update(syncRuns)
      .set({
        finishedAt: new Date(),
        status: 'success',
        rowsRead: result.rowsRead,
        partsUpserted: result.partsMatched,
        imagesUpserted: result.imagesInserted,
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

/** The renderable sizes, in export order, keyed by part id. */
export interface PartImageUrls {
  url200: string
  url800: string
  url1600: string
}

export async function imagesByPart(ids: string[], opts: { primaryOnly?: boolean } = {}) {
  const map = new Map<string, PartImageUrls[]>()
  if (ids.length === 0) return map

  const where = opts.primaryOnly
    ? and(inArray(partImages.partId, ids), eq(partImages.position, 0))
    : inArray(partImages.partId, ids)

  const rows = await db.select().from(partImages).where(where).orderBy(asc(partImages.position))

  for (const r of rows) {
    const arr = map.get(r.partId) ?? []
    arr.push({ url200: r.url200, url800: r.url800, url1600: r.url1600 })
    map.set(r.partId, arr)
  }
  return map
}
