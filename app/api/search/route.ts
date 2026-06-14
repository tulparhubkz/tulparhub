import { NextRequest, NextResponse } from 'next/server'
import { createAnonClient } from '@/lib/supabase-server'
import { parts as mockParts, systems, brands } from '@/lib/data'

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get('q') ?? '').trim()
  if (q.length < 2) return NextResponse.json({ parts: [], systems: [], brands: [] })

  const lower = q.toLowerCase()
  const db = createAnonClient()

  let partResults: Array<{ id: string; name: string; oem: string; price: number }> = []

  if (db) {
    try {
      const { data } = await db
        .from('parts')
        .select('id, name, oem, price')
        .or(`name.ilike.%${q}%,oem.ilike.%${q}%`)
        .limit(6)
      partResults = data ?? []
    } catch {}
  }

  if (!partResults.length) {
    partResults = mockParts
      .filter((p) => p.name.toLowerCase().includes(lower) || p.oem.toLowerCase().includes(lower))
      .slice(0, 6)
      .map(({ id, name, oem, price }) => ({ id, name, oem, price }))
  }

  const systemResults = systems
    .filter((s) => s.ru.toLowerCase().includes(lower))
    .slice(0, 3)
    .map(({ id, ru }) => ({ id, label: ru, href: `/catalog?system=${id}` }))

  const brandResults = brands
    .filter((b) => b.name.toLowerCase().includes(lower))
    .slice(0, 3)
    .map(({ id, name }) => ({ id, label: name, href: `/catalog?brand=${id}` }))

  return NextResponse.json({ parts: partResults, systems: systemResults, brands: brandResults })
}
