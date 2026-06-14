import { NextRequest, NextResponse } from 'next/server'
import { createAnonClient } from '@/lib/supabase-server'
import { rental as mockRental } from '@/lib/data'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  const db = createAnonClient()

  if (db) {
    try {
      const { data, error } = await db.from('rental_units').select('*').eq('id', id).single()
      if (error) throw error
      return NextResponse.json(data)
    } catch {}
  }

  const unit = mockRental.find((r) => r.id === id)
  if (!unit) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(unit)
}
