import { NextRequest, NextResponse } from 'next/server'
import { createAnonClient } from '@/lib/supabase-server'
import { parts as mockParts, brands, models } from '@/lib/data'
import { decodeVin, isValidVin } from '@/lib/vinDecoder'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const system   = searchParams.get('system') ?? ''
  const brand    = searchParams.get('brand') ?? ''
  const model    = searchParams.get('model') ?? ''
  const vinParam = searchParams.get('vin') ?? ''
  let q = searchParams.get('q') ?? ''
  // auto-detect VIN in q (17-char alphanumeric) or explicit vin param
  const vinCandidate = vinParam || (isValidVin(q) ? q : '')
  if (vinCandidate) {
    const decoded = decodeVin(vinCandidate)
    if (decoded) q = decoded.searchQuery
  }
  const partBrand = searchParams.get('partBrand') ?? ''   // parts manufacturer (MANN, Bosch…)
  const oemOnly  = searchParams.get('oemOnly') === '1'
  const inStock  = searchParams.get('inStock') === '1'
  const priceMax = Number(searchParams.get('priceMax') ?? 999_999_999)
  const sort     = searchParams.get('sort') ?? 'popular'
  const page     = Math.max(1, Number(searchParams.get('page') ?? 1))
  const limit    = 24

  const db = createAnonClient()

  if (db) {
    try {
      let query = db
        .from('parts')
        .select('id,oem,name,brand,type,category,fits,price,price_b2b,vat,eta,img,specs,cross,rating,reviews,part_stock(city,qty)', { count: 'exact' })
        .lte('price', priceMax)

      if (system)  query = query.eq('category', system)

      // brand/model params refer to the TRUCK brand — filter via fits[] array
      if (brand) {
        const brandObj = brands.find(b => b.id === brand)
        const dbName = brandObj?.dbName ?? brand
        if (model) {
          const modelObj = (models[brand] ?? []).find(m => m.id === model)
          const fitsStr = modelObj?.fits ?? `${dbName} ${model}`
          query = query.contains('fits', [fitsStr])
        } else {
          const brandModels = models[brand] ?? []
          if (brandModels.length > 0) {
            // use overlaps: parts that fit ANY known model of this brand
            query = query.overlaps('fits', brandModels.map(m => m.fits))
          } else {
            // brand-only fits (Scania, Renault, Iveco, etc.) — exact string match
            query = query.contains('fits', [dbName])
          }
        }
      }
      if (partBrand) query = query.ilike('brand', `%${partBrand}%`)
      if (oemOnly) query = query.eq('type', 'OEM')
      if (q) {
        const clean = q.trim()
        const words = clean.split(/\s+/).filter(Boolean)
        const oemClause = `oem.ilike.%${clean}%`
        if (words.length > 1) {
          // Multi-word: ALL words must appear in name, OR full string in oem
          const andName = words.map(w => `name.ilike.%${w}%`).join(',')
          query = query.or(`and(${andName}),${oemClause}`)
        } else {
          query = query.or(`name.ilike.%${clean}%,${oemClause}`)
        }
      }

      if (sort === 'price-asc')  query = query.order('price', { ascending: true })
      else if (sort === 'price-desc') query = query.order('price', { ascending: false })
      else query = query.order('id')

      query = query.range((page - 1) * limit, page * limit - 1)

      const { data, count, error } = await query
      if (error) throw error

      let items = data ?? []
      if (inStock) items = items.filter((p: any) => (p.part_stock ?? []).some((s: any) => s.qty > 0))

      return NextResponse.json({ items, total: count ?? 0, page, limit })
    } catch {
      // fall through to mock
    }
  }

  // Mock fallback
  let items: typeof mockParts = [...mockParts]
  if (system)  items = items.filter((p) => p.category === system)
  if (brand)   items = items.filter((p) => p.brand.toLowerCase().includes(brand.toLowerCase()))
  if (q)       items = items.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()) || p.oem.toLowerCase().includes(q.toLowerCase()))
  if (oemOnly) items = items.filter((p) => p.type === 'OEM')
  if (inStock) items = items.filter((p) => Object.values(p.stock).some((n) => n > 0))
  items = items.filter((p) => p.price <= priceMax)

  if (sort === 'price-asc')  items.sort((a, b) => a.price - b.price)
  if (sort === 'price-desc') items.sort((a, b) => b.price - a.price)

  const total = items.length
  items = items.slice((page - 1) * limit, page * limit)

  return NextResponse.json({ items, total, page, limit })
}
