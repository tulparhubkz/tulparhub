import { NextResponse } from 'next/server'
import { cities } from '@/lib/data'

export async function GET() {
  return NextResponse.json(cities)
}
