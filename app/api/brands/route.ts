import { NextResponse } from 'next/server'
import { createAnonClient } from '@/lib/supabase-server'
import { brands as mockBrands, models as mockModels } from '@/lib/data'

export async function GET() {
  const db = createAnonClient()

  if (db) {
    try {
      const { data, error } = await db.from('brands').select('*, models(*)')
      if (error) throw error
      return NextResponse.json(data)
    } catch {}
  }

  // Attach models to each brand from mock data
  const result = mockBrands.map((b) => ({
    ...b,
    models: mockModels[b.id] ?? [],
  }))
  return NextResponse.json(result)
}
