import { NextResponse } from 'next/server'
import { createAnonClient } from '@/lib/supabase-server'
import { cities as mockCities } from '@/lib/data'

export async function GET() {
  const db = createAnonClient()

  if (db) {
    try {
      const { data, error } = await db.from('cities').select('*')
      if (error) throw error
      return NextResponse.json(data)
    } catch {}
  }

  return NextResponse.json(mockCities)
}
