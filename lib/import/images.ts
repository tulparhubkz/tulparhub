/**
 * Parse a row of the vendor's image export (data/price_images.csv).
 *
 * Layout: 9 fixed columns, then up to 8 image slots of 8 columns each —
 * a file name followed by one URL per size (50, 100, 200, 400, 800, 1600, 3200).
 * Every size shares the same asset id and differs only in the path segment, so
 * we keep the three the storefront renders and drop the rest.
 */

/** Image slots the CSV provides. */
export const MAX_IMAGES = 8

/** Index of `img1_fileName`; each later slot sits STRIDE columns further right. */
const FIRST_IMAGE = 9
const STRIDE = 8

/** Offsets from a slot's file-name column to the sizes we keep. */
const URL_200 = 3
const URL_800 = 5
const URL_1600 = 6

export interface PartImageRef {
  fileName: string
  url200: string
  url800: string
  url1600: string
}

export interface ImageRow {
  article: string
  brand: string | null
  images: PartImageRef[]
}

/** Returns null for rows we cannot use: no article to join on, or no images. */
export function parseImageRow(line: string): ImageRow | null {
  const cols = line.split('\t')

  const article = cols[0]?.trim()
  if (!article || article === 'Артикул') return null

  const images: PartImageRef[] = []
  for (let slot = 0; slot < MAX_IMAGES; slot++) {
    const at = FIRST_IMAGE + slot * STRIDE
    const fileName = cols[at]?.trim()
    if (!fileName) continue

    const url200 = cols[at + URL_200]?.trim()
    const url800 = cols[at + URL_800]?.trim()
    const url1600 = cols[at + URL_1600]?.trim()
    if (!url200 || !url800 || !url1600) continue

    images.push({ fileName, url200, url800, url1600 })
  }
  if (images.length === 0) return null

  return { article, brand: cols[2]?.trim() || null, images }
}
