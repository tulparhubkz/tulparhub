/**
 * Import the vendor's product-image export into Postgres.
 *
 *   yarn import-images                              # uses IMAGES_CSV_PATH + VENDOR_ID from .env
 *   IMAGES_CSV_PATH=./foo.csv yarn import-images
 *
 * The images themselves stay on the vendor's CDN — the table only holds URLs —
 * so this never needs to run on the app server. Point DATABASE_URL at the
 * production database and run it from anywhere:
 *
 *   DATABASE_URL='postgres://…neon.tech/…' yarn import-images
 *
 * A run replaces the vendor's images. Re-running is idempotent. Each run is
 * recorded in sync_runs and shows up in /admin/sync.
 */
import 'dotenv/config'
import { importPartImages } from '../lib/services/partImages'

const CSV_PATH = process.env.IMAGES_CSV_PATH ?? './data/price_images.csv'
const VENDOR_ID = process.env.VENDOR_ID ?? 'main'

async function main() {
  console.log(`\n🖼  Importing ${CSV_PATH} → vendor "${VENDOR_ID}"\n`)

  const t0 = Date.now()
  const r = await importPartImages({ csvPath: CSV_PATH, vendorId: VENDOR_ID })

  console.log(`  parsed  ${r.rowsRead} rows (${r.rowsWithImages} with images)`)
  console.log(`  matched ${r.partsMatched} parts`)
  console.log(`  ✓ images: ${r.imagesInserted}`)
  if (r.unmatchedRows > 0) {
    console.warn(`\n⚠ ${r.unmatchedRows} image rows matched no part (article+brand not in the price feed)`)
  }
  console.log(`\n✅ Import complete in ${((Date.now() - t0) / 1000).toFixed(1)}s.\n`)
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
