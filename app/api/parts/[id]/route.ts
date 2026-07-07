import { NextRequest, NextResponse } from 'next/server'
import { getPart } from '@/lib/services/parts'
import { isB2bViewer } from '@/lib/admin'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const part = await getPart(params.id, { b2b: await isB2bViewer() })
  if (!part) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(part)
}
