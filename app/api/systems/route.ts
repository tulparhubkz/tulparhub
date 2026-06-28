import { NextResponse } from 'next/server'
import { systems } from '@/lib/data'

export async function GET() {
  return NextResponse.json(systems)
}
