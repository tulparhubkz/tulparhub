import { NextResponse } from 'next/server'
import { catalogFacetCounts } from '@/lib/services/parts'

// Hits the DB, so keep it out of the build-time prerender (no DB in CI) — same as
// /api/part-brands. Edge caching below still keeps it cheap at runtime.
export const dynamic = 'force-dynamic'

// Real per-category / per-brand part counts for storefront filters and tiles.
// Cached briefly at the edge — inventory changes slowly and these are just labels.
export async function GET() {
  const counts = await catalogFacetCounts()
  return NextResponse.json(counts, {
    headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=600' },
  })
}
