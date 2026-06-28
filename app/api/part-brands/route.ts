import { NextResponse } from 'next/server'
import { partBrandCounts } from '@/lib/services/parts'

export async function GET() {
  const brands = await partBrandCounts()
  return NextResponse.json({ brands })
}
