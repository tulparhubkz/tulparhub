/**
 * Fetches individual product images for each part by OEM number via DuckDuckGo.
 * Run locally (DDG is blocked on Vercel).
 * Results saved to lib/oemImageMap.json
 *
 * Usage: node scripts/fetch-oem-images.mjs [limit]
 */
import { writeFileSync, readFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, '../lib/oemImageMap.json')
const SUPABASE_URL = 'https://ffbnagekrmwomkilyvtf.supabase.co'
const SUPABASE_KEY = 'sb_publishable_NQGEuXH4cxayIcc9gZ8Rug_mYF1T5Dv'
const LIMIT = parseInt(process.argv[2] || '500')
const BLACKLIST = ['unsplash','shutterstock','getty','istockphoto','freepik','pexels','alamy','dreamstime','pixabay']
const PREFER = ['truckdrive','autodoc','exist','emex','stpulscen','zapmaster','perevozka24','vikingparts','truckcatalog']

// Load existing cache to skip already-fetched OEMs
const existing = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : {}
console.log(`Loaded ${Object.keys(existing).length} cached entries`)

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function getVQD(query) {
  const res = await fetch(
    `https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`,
    { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', 'Accept-Language': 'ru-RU,ru;q=0.9' }, signal: AbortSignal.timeout(6000) }
  )
  const html = await res.text()
  return html.match(/vqd=['"]?([\d-]+)['"]?/)?.[1] ?? null
}

async function searchImages(query) {
  try {
    const vqd = await getVQD(query)
    if (!vqd) return null
    await sleep(200)
    const res = await fetch(
      `https://duckduckgo.com/i.js?q=${encodeURIComponent(query)}&vqd=${vqd}&f=,,,,,&p=1&o=json`,
      { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', 'Referer': 'https://duckduckgo.com/', 'Accept': 'application/json' }, signal: AbortSignal.timeout(6000) }
    )
    const data = await res.json()
    const results = (data?.results ?? []).filter(r => !BLACKLIST.some(b => r.image.toLowerCase().includes(b)))
    if (!results.length) return null
    // Sort: prefer known parts sites
    results.sort((a, b) => {
      const aP = PREFER.some(p => (a.image + a.url).toLowerCase().includes(p)) ? -1 : 0
      const bP = PREFER.some(p => (b.image + b.url).toLowerCase().includes(p)) ? -1 : 0
      return aP - bP
    })
    return results[0]?.image ?? null
  } catch { return null }
}

// Fetch all parts from Supabase
async function fetchParts() {
  const parts = []
  let page = 0
  const pageSize = 1000
  while (parts.length < LIMIT) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/parts?select=oem,name,brand&limit=${pageSize}&offset=${page * pageSize}`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    )
    const batch = await res.json()
    if (!batch.length) break
    parts.push(...batch)
    page++
    if (batch.length < pageSize) break
  }
  return parts.slice(0, LIMIT)
}

console.log(`\nFetching up to ${LIMIT} parts from Supabase...`)
const parts = await fetchParts()
console.log(`Got ${parts.length} parts\n`)

const result = { ...existing }
let found = 0, skipped = 0, failed = 0
const startTime = Date.now()

for (let i = 0; i < parts.length; i++) {
  const { oem, name, brand } = parts[i]
  if (!oem) continue

  // Skip if already cached
  if (result[oem]) { skipped++; continue }

  const query = `"${oem}" запчасть фото`
  process.stdout.write(`[${i+1}/${parts.length}] ${oem} — ${name.slice(0,40)}: `)

  const url = await searchImages(query)
  if (url) {
    result[oem] = url
    found++
    console.log(`✓ ${url.slice(0, 60)}...`)
  } else {
    // Fallback: search by name + brand
    const url2 = await searchImages(`${name} ${brand} запчасть фото`)
    if (url2) {
      result[oem] = url2
      found++
      console.log(`✓ (fallback) ${url2.slice(0, 55)}...`)
    } else {
      failed++
      console.log('✗ not found')
    }
  }

  // Save every 20 parts
  if ((i + 1) % 20 === 0) {
    writeFileSync(OUT, JSON.stringify(result, null, 2))
    const elapsed = Math.round((Date.now() - startTime) / 1000)
    const rate = ((i + 1 - skipped) / elapsed).toFixed(1)
    console.log(`\n  Saved. ${found} found, ${failed} failed, ${skipped} skipped. ${rate} req/s\n`)
  }

  // Rate limiting — 1 req per ~1.2s
  await sleep(1200)
}

writeFileSync(OUT, JSON.stringify(result, null, 2))
console.log(`\n✅ Done! ${found} images found, ${failed} failed, ${skipped} already cached`)
console.log(`Total in map: ${Object.keys(result).length}`)
console.log(`Saved to ${OUT}`)
