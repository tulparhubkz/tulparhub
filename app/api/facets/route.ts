import { NextResponse } from 'next/server'
import { catalogFacetCounts } from '@/lib/services/parts'

// Real per-category / per-brand part counts for storefront filters and tiles.
// Cached briefly at the edge — inventory changes slowly and these are just labels.
export async function GET() {
  const counts = await catalogFacetCounts()
  return NextResponse.json(counts, {
    headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=600' },
  })
}
