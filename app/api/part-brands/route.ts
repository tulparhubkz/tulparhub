import { NextResponse } from 'next/server'
import { partBrandCounts } from '@/lib/services/parts'

// DB-backed: never prerender at build (no DB available then) + counts change on import.
export const dynamic = 'force-dynamic'

export async function GET() {
  const brands = await partBrandCounts()
  return NextResponse.json({ brands })
}
