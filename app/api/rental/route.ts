import { NextRequest, NextResponse } from 'next/server'
import { createAnonClient } from '@/lib/supabase-server'
import { rental as mockRental } from '@/lib/data'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const type     = searchParams.get('type') ?? 'all'
  const operator = searchParams.get('operator') ?? 'any'
  const city     = searchParams.get('city') ?? ''
  const page     = Math.max(1, Number(searchParams.get('page') ?? 1))
  const limit    = 12

  const db = createAnonClient()

  if (db) {
    try {
      let query = db
        .from('rental_units')
        .select('*', { count: 'exact' })

      if (type !== 'all')    query = query.eq('type', type)
      if (operator === 'yes') query = query.eq('operator', true)
      if (operator === 'no')  query = query.eq('operator', false)
      if (city)               query = query.eq('city', city)

      query = query.range((page - 1) * limit, page * limit - 1)

      const { data, count, error } = await query
      if (error) throw error
      return NextResponse.json({ items: data ?? [], total: count ?? 0, page, limit })
    } catch {
      // fall through
    }
  }

  let items = [...mockRental]
  if (type !== 'all')     items = items.filter((r) => r.type === type)
  if (operator === 'yes') items = items.filter((r) => r.operator)
  if (operator === 'no')  items = items.filter((r) => !r.operator)
  if (city)               items = items.filter((r) => r.city === city)

  const total = items.length
  items = items.slice((page - 1) * limit, page * limit)
  return NextResponse.json({ items, total, page, limit })
}
