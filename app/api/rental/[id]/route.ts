import { NextRequest, NextResponse } from 'next/server'
import { rental } from '@/lib/data'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const unit = rental.find((r) => r.id === params.id)
  if (!unit) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(unit)
}
