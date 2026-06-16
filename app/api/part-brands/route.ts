import { NextResponse } from 'next/server'
import { createAnonClient } from '@/lib/supabase-server'
import { parts as mockParts } from '@/lib/data'

export async function GET() {
  const db = createAnonClient()
  const counts: Record<string, number> = {}

  if (db) {
    try {
      let from = 0
      const step = 1000
      while (true) {
        const { data, error } = await db.from('parts').select('brand').range(from, from + step - 1)
        if (error) throw error
        if (!data || data.length === 0) break
        for (const row of data) {
          const b = (row.brand || '').trim()
          if (b) counts[b] = (counts[b] ?? 0) + 1
        }
        from += step
        if (data.length < step) break
      }
    } catch {
      // fall through to mock
    }
  }

  if (Object.keys(counts).length === 0) {
    for (const p of mockParts) {
      const b = (p.brand || '').trim()
      if (b) counts[b] = (counts[b] ?? 0) + 1
    }
  }

  const result = Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)

  return NextResponse.json({ brands: result })
}
