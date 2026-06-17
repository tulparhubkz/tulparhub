import { NextResponse } from 'next/server'
import { decodeVin, isValidVin } from '@/lib/vinDecoder'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const vin = searchParams.get('vin') ?? ''

  if (!isValidVin(vin)) {
    return NextResponse.json({ error: 'Неверный формат VIN' }, { status: 400 })
  }

  // 1. Try our local decoder (WMI_MAP + wmiDatabase)
  const result = decodeVin(vin)
  if (result) return NextResponse.json(result)

  // 2. Fallback: NHTSA vPIC API (free, no key required)
  try {
    const nhtsaUrl = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${encodeURIComponent(vin)}?format=json`
    const res = await fetch(nhtsaUrl, { next: { revalidate: 86400 } })
    if (res.ok) {
      const data = await res.json()
      const r = data?.Results?.[0]
      if (r && r.Make && r.Make !== 'null' && r.Make !== '') {
        const brand = r.Make
        const model = r.Model && r.Model !== 'null' ? r.Model : ''
        const year  = r.ModelYear && r.ModelYear !== '0' ? Number(r.ModelYear) : undefined
        const searchQuery = model ? `${brand} ${model}` : brand
        return NextResponse.json({
          brand,
          model,
          searchQuery,
          year,
          country: r.PlantCountry || '',
          source: 'nhtsa',
          raw: { wmi: vin.slice(0, 3), vds: vin.slice(3, 9), vis: vin.slice(9) },
        })
      }
    }
  } catch {
    // NHTSA unavailable — return 404
  }

  return NextResponse.json({ error: 'Производитель не определён' }, { status: 404 })
}
