import { NextResponse } from 'next/server'

// Simple in-memory cache per server instance
const cache = new Map<string, string>()

async function searchDDGImages(query: string): Promise<string | null> {
  try {
    // Step 1: get VQD token
    const homeRes = await fetch(
      `https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'ru-RU,ru;q=0.9',
        },
        signal: AbortSignal.timeout(5000),
      }
    )
    const html = await homeRes.text()
    const vqd = html.match(/vqd=['"]?([\d-]+)['"]?/)?.[1]
    if (!vqd) return null

    // Step 2: image search
    const imgRes = await fetch(
      `https://duckduckgo.com/i.js?q=${encodeURIComponent(query)}&vqd=${vqd}&f=,,,,,&p=1&o=json`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          'Referer': 'https://duckduckgo.com/',
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(5000),
      }
    )
    const data = await imgRes.json()
    const results: any[] = data?.results ?? []

    // Prefer images that look like product photos (white/plain background domains)
    const preferred = ['autodoc', 'exist', 'emex', 'truckdrive', 'parts', 'запчаст', '7141', 'truckparts']
    const sorted = results.slice(0, 20).sort((a, b) => {
      const aScore = preferred.some(p => (a.url + a.image).toLowerCase().includes(p)) ? -1 : 0
      const bScore = preferred.some(p => (b.url + b.image).toLowerCase().includes(p)) ? -1 : 0
      return aScore - bScore
    })

    // Filter out stock photo / workshop images
    const blacklist = ['unsplash', 'shutterstock', 'getty', 'istockphoto', 'freepik', 'pexels', 'alamy', 'dreamstime']
    const clean = sorted.filter(r => !blacklist.some(b => r.image.toLowerCase().includes(b)))

    return clean[0]?.image ?? sorted[0]?.image ?? null
  } catch {
    return null
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const oem = (searchParams.get('oem') ?? '').trim()
  const name = (searchParams.get('name') ?? '').trim()

  if (!oem && !name) {
    return NextResponse.json({ url: null }, { status: 400 })
  }

  const cacheKey = oem || name
  if (cache.has(cacheKey)) {
    return NextResponse.json({ url: cache.get(cacheKey) })
  }

  // Build search query: OEM number is most precise
  const query = oem
    ? `${oem} запчасть грузовик фото`
    : `${name} запчасть фото`

  const url = await searchDDGImages(query)

  if (url) {
    cache.set(cacheKey, url)
  }

  return NextResponse.json({ url: url ?? null })
}
