import { NextResponse } from 'next/server'
import { listGarage, addGarage, updateGarage, removeGarage } from '@/lib/services/garage'

// GET /api/garage?user_id=xxx
export async function GET(req: Request) {
  const userId = new URL(req.url).searchParams.get('user_id')
  if (!userId) return NextResponse.json({ error: 'user_id required' }, { status: 400 })
  const data = await listGarage(userId)
  return NextResponse.json(data)
}

// POST /api/garage  { user_id, vin, name, note }
export async function POST(req: Request) {
  const { user_id, vin, name, note } = await req.json()
  if (!user_id || !vin) return NextResponse.json({ error: 'user_id and vin required' }, { status: 400 })
  const row = await addGarage({ userId: user_id, vin, name, note })
  return NextResponse.json(row, { status: 201 })
}

// PATCH /api/garage  { id, name, note }
export async function PATCH(req: Request) {
  const { id, name, note } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const row = await updateGarage({ id, name, note })
  return NextResponse.json(row)
}

// DELETE /api/garage?id=xxx
export async function DELETE(req: Request) {
  const id = new URL(req.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  await removeGarage(id)
  return NextResponse.json({ ok: true })
}
