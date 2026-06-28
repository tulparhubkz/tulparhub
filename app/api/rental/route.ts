import { NextRequest, NextResponse } from 'next/server'
import { rental } from '@/lib/data'

// Rental units — demo data for now (no real rental inventory feed yet).
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const type = sp.get('type') ?? 'all'
  const operator = sp.get('operator') ?? 'any'
  const city = sp.get('city') ?? ''
  const page = Math.max(1, Number(sp.get('page') ?? 1))
  const limit = 12

  let items = [...rental]
  if (type !== 'all') items = items.filter((r) => r.type === type)
  if (operator === 'yes') items = items.filter((r) => r.operator)
  if (operator === 'no') items = items.filter((r) => !r.operator)
  if (city) items = items.filter((r) => r.city === city)

  const total = items.length
  items = items.slice((page - 1) * limit, page * limit)
  return NextResponse.json({ items, total, page, limit })
}
