import { NextResponse } from 'next/server'
import { brands, models } from '@/lib/data'

// Truck brands + their models. Static config (no real vendor feed for this yet).
export async function GET() {
  const result = brands.map((b) => ({ ...b, models: models[b.id] ?? [] }))
  return NextResponse.json(result)
}
