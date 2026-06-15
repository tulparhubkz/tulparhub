import { NextRequest, NextResponse } from 'next/server'
import { createAnonClient } from '@/lib/supabase-server'
import { parts as mockParts } from '@/lib/data'
import { decodeVin, isValidVin } from '@/lib/vinDecoder'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const system   = searchParams.get('system') ?? ''
  const brand    = searchParams.get('brand') ?? ''
  const model    = searchParams.get('model') ?? ''
  const vinParam = searchParams.get('vin') ?? ''
  // if vin param provided, decode to search query
  let q = searchParams.get('q') ?? ''
  if (!q && vinParam && isValidVin(vinParam)) {
    const decoded = decodeVin(vinParam)
    if (decoded) q = decoded.searchQuery
  }
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
      if (brand)   query = query.ilike('brand', `%${brand}%`)
      if (oemOnly) query = query.eq('type', 'OEM')
      if (q) {
        // search by name, oem, and fits array (cast to text for ilike)
        const words = q.trim().split(/\s+/).filter(Boolean)
        if (words.length > 1) {
          // multi-word: each word must appear somewhere in name
          for (const w of words) {
            query = query.ilike('name', `%${w}%`)
          }
        } else {
          query = query.or(`name.ilike.%${q}%,oem.ilike.%${q}%`)
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
