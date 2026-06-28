import { NextRequest, NextResponse } from 'next/server'
import { listParts } from '@/lib/services/parts'
import { decodeVin, isValidVin } from '@/lib/vinDecoder'

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  let q = sp.get('q') ?? ''

  // Resolve a VIN (explicit ?vin= or a 17-char value in q) into a search query.
  const vinCandidate = sp.get('vin') || (isValidVin(q) ? q : '')
  if (vinCandidate) {
    const decoded = decodeVin(vinCandidate)
    if (decoded) q = decoded.searchQuery
  }

  const result = await listParts({
    q: q || undefined,
    system: sp.get('system') || undefined,
    brand: sp.get('brand') || undefined,
    model: sp.get('model') || undefined,
    partBrand: sp.get('partBrand') || undefined,
    oemOnly: sp.get('oemOnly') === '1',
    inStock: sp.get('inStock') === '1',
    priceMax: sp.get('priceMax') ? Number(sp.get('priceMax')) : undefined,
    sort: sp.get('sort') ?? 'popular',
    page: Math.max(1, Number(sp.get('page') ?? 1)),
  })

  return NextResponse.json(result)
}
