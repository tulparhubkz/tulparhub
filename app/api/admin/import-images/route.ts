import { NextResponse } from 'next/server'
import { getAdmin } from '@/lib/admin'
import { importPartImages } from '@/lib/services/partImages'

export const dynamic = 'force-dynamic'
export const maxDuration = 300 // ~58k rows over 50k catalog parts

export async function POST() {
  const admin = await getAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const result = await importPartImages({
      csvPath: process.env.IMAGES_CSV_PATH ?? './data/price_images.csv',
      vendorId: process.env.VENDOR_ID ?? 'main',
    })
    return NextResponse.json({ ok: true, ...result })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
