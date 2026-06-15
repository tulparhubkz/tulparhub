import { NextResponse } from 'next/server'
import { decodeVin, isValidVin } from '@/lib/vinDecoder'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const vin = searchParams.get('vin') ?? ''

  if (!isValidVin(vin)) {
    return NextResponse.json({ error: 'Неверный формат VIN' }, { status: 400 })
  }

  const result = decodeVin(vin)
  if (!result) {
    return NextResponse.json({ error: 'Производитель не определён' }, { status: 404 })
  }

  return NextResponse.json(result)
}
