/**
 * Seed Supabase with mock data from lib/data.ts
 * Usage: npm run seed
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!url || !key) {
  console.error('ERROR: Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const db = createClient(url, key, { auth: { persistSession: false } })

async function upsert(table: string, rows: unknown[], conflict = 'id') {
  const { error } = await db.from(table).upsert(rows as any[], { onConflict: conflict })
  if (error) console.error(`  ✗ ${table}:`, error.message)
  else console.log(`  ✓ ${table} — ${(rows as any[]).length} rows`)
}

async function main() {
  const { cities, equipmentTypes, brands, models, systems, parts, rental } =
    await import('../lib/data.js')

  console.log('\n🌱 Seeding TulparHub...\n')

  await upsert('cities', cities)
  await upsert('equipment_types', equipmentTypes)
  await upsert('brands', brands.map(({ id, name, country }: any) => ({ id, name, country })))

  const modelRows = Object.entries(models as Record<string, any[]>).flatMap(([brandId, ms]) =>
    ms.map((m) => ({ ...m, brand_id: brandId }))
  )
  const { error: mErr } = await db.from('models').upsert(modelRows, { onConflict: 'brand_id,id' })
  if (mErr) console.error('  ✗ models:', mErr.message)
  else console.log(`  ✓ models — ${modelRows.length} rows`)

  await upsert('systems', systems.map(({ id, ru, icon }: any) => ({ id, ru, icon })))

  await upsert('parts', parts.map(({ stock: _s, cross, ...rest }: any) => ({
    ...rest,
    cross,
  })))

  const stockRows = parts.flatMap((p: any) =>
    Object.entries(p.stock as Record<string, number>).map(([city, qty]) => ({
      part_id: p.id, city, qty,
    }))
  )
  const { error: sErr } = await db.from('part_stock').upsert(stockRows, { onConflict: 'part_id,city' })
  if (sErr) console.error('  ✗ part_stock:', sErr.message)
  else console.log(`  ✓ part_stock — ${stockRows.length} rows`)

  await upsert('rental_units', rental.map(({ rates, ...r }: any) => ({
    ...r,
    rate_shift: rates.shift,
    rate_day:   rates.day,
    rate_week:  rates.week,
    rate_month: rates.month,
  })))

  console.log('\n✅ Done.\n')
}

main().catch((e) => { console.error(e); process.exit(1) })
