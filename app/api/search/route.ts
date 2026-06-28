import { NextRequest, NextResponse } from 'next/server'
import { searchPartsLite } from '@/lib/services/parts'
import { systems, brands } from '@/lib/data'
import { decodeVin, isValidVin } from '@/lib/vinDecoder'

export async function GET(req: NextRequest) {
  let q = (req.nextUrl.searchParams.get('q') ?? '').trim()
  if (q.length < 2) return NextResponse.json({ parts: [], systems: [], brands: [] })

  if (isValidVin(q)) {
    const decoded = decodeVin(q)
    if (decoded) q = decoded.searchQuery
  }
  const lower = q.toLowerCase()

  const parts = await searchPartsLite(q, 8)

  const systemResults = systems
    .filter((s) => s.ru.toLowerCase().includes(lower))
    .slice(0, 3)
    .map(({ id, ru }) => ({ id, label: ru, href: `/catalog?system=${id}` }))

  const brandResults = brands
    .filter((b) => b.name.toLowerCase().includes(lower))
    .slice(0, 3)
    .map(({ id, name }) => ({ id, label: name, href: `/catalog?brand=${id}` }))

  return NextResponse.json({ parts, systems: systemResults, brands: brandResults })
}
