import { NextRequest, NextResponse } from 'next/server'
import { createAnonClient } from '@/lib/supabase-server'
import { parts as mockParts } from '@/lib/data'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  const db = createAnonClient()

  if (db) {
    try {
      const { data, error } = await db
        .from('parts')
        .select('*, part_stock(*)')
        .eq('id', id)
        .single()
      if (error) throw error
      return NextResponse.json(data)
    } catch {
      // fall through to mock
    }
  }

  const part = mockParts.find((p) => p.id === id)
  if (!part) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(part)
}
