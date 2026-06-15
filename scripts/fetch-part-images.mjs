/**
 * Run locally (not on Vercel) to populate lib/partImageMap.json
 * DDG image search works from local machine but is blocked on Vercel IPs.
 *
 * Usage: node scripts/fetch-part-images.mjs
 */

import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const BLACKLIST = ['unsplash', 'shutterstock', 'getty', 'istockphoto', 'freepik', 'pexels', 'alamy', 'dreamstime']

async function ddgImages(query, count = 5) {
  try {
    const homeRes = await fetch(
      `https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`,
      { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', 'Accept-Language': 'ru-RU,ru;q=0.9' } }
    )
    const html = await homeRes.text()
    const vqd = html.match(/vqd=['"]?([\d-]+)['"]?/)?.[1]
    if (!vqd) { console.log('  No VQD for:', query); return [] }

    await sleep(300)

    const imgRes = await fetch(
      `https://duckduckgo.com/i.js?q=${encodeURIComponent(query)}&vqd=${vqd}&f=,,,,,&p=1&o=json`,
      { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', 'Referer': 'https://duckduckgo.com/', 'Accept': 'application/json' } }
    )
    const data = await imgRes.json()
    const results = (data?.results ?? []).filter(r => !BLACKLIST.some(b => r.image.toLowerCase().includes(b)))
    return results.slice(0, count).map(r => r.image)
  } catch (e) {
    console.log('  Error:', e.message)
    return []
  }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

// Queries to run — covers all part categories and types
const QUERIES = [
  // === FILTERS ===
  { key: 'filter_oil',  q: 'масляный фильтр грузовик запчасть фото белый фон' },
  { key: 'filter_air',  q: 'воздушный фильтр грузовик запчасть фото белый фон' },
  { key: 'filter_fuel', q: 'топливный фильтр грузовик запчасть фото белый фон' },
  { key: 'filter_cabin',q: 'фильтр салона кабины грузовик запчасть фото' },
  // === ENGINE ===
  { key: 'gasket_head', q: 'прокладка головки блока цилиндров грузовик фото' },
  { key: 'gasket_set',  q: 'набор прокладок двигатель грузовик запчасть фото' },
  { key: 'seal_oil',    q: 'сальник коленвала грузовик запчасть фото' },
  { key: 'valve_stem',  q: 'маслосъемный колпачок клапан двигатель запчасть фото' },
  { key: 'piston',      q: 'поршень двигатель грузовик запчасть фото' },
  { key: 'liner',       q: 'гильза цилиндра двигатель грузовик запчасть фото' },
  { key: 'bearing_rod', q: 'вкладыш шатунный коренной двигатель запчасть фото' },
  { key: 'ring_piston', q: 'кольца поршневые грузовик запчасть фото' },
  { key: 'pump_oil',    q: 'масляный насос двигатель грузовик запчасть фото' },
  { key: 'pump_water',  q: 'водяной насос помпа грузовик запчасть фото' },
  { key: 'thermostat',  q: 'термостат двигатель грузовик запчасть фото' },
  { key: 'injector',    q: 'форсунка инжектор дизельный двигатель запчасть фото' },
  // === BRAKES ===
  { key: 'brake_pad',   q: 'тормозные колодки грузовик грузовой запчасть фото' },
  { key: 'brake_disc',  q: 'тормозной диск ротор грузовик запчасть фото' },
  { key: 'brake_drum',  q: 'тормозной барабан грузовик запчасть фото' },
  { key: 'brake_caliper',q:'тормозной суппорт грузовик запчасть фото' },
  { key: 'brake_hose',  q: 'тормозной шланг трубка грузовик запчасть фото' },
  { key: 'brake_valve', q: 'тормозной кран клапан грузовик запчасть фото' },
  // === SUSPENSION ===
  { key: 'shock_absorber',q:'амортизатор подвески грузовик запчасть фото' },
  { key: 'spring_leaf', q: 'рессора листовая грузовик запчасть фото' },
  { key: 'bearing_wheel',q:'подшипник ступицы грузовик запчасть фото' },
  { key: 'hub',         q: 'ступица колесо грузовик запчасть фото' },
  { key: 'bushing',     q: 'втулка сайлентблок рычаг грузовик запчасть фото' },
  { key: 'tie_rod',     q: 'наконечник рулевой тяги грузовик запчасть фото' },
  { key: 'ball_joint',  q: 'шаровая опора грузовик запчасть фото' },
  // === TRANSMISSION ===
  { key: 'clutch_disc', q: 'диск сцепления грузовик запчасть фото' },
  { key: 'clutch_basket',q:'корзина сцепления грузовик запчасть фото' },
  { key: 'clutch_kit',  q: 'комплект сцепления грузовик запчасть фото' },
  { key: 'gearbox_seal',q: 'сальник коробка передач грузовик запчасть фото' },
  { key: 'propshaft',   q: 'карданный вал крестовина грузовик запчасть фото' },
  // === ELECTRICAL ===
  { key: 'sensor',      q: 'датчик давления температуры грузовик запчасть фото' },
  { key: 'alternator',  q: 'генератор грузовик запчасть фото' },
  { key: 'starter',     q: 'стартер двигатель грузовик запчасть фото' },
  { key: 'relay',       q: 'реле предохранитель грузовик запчасть фото' },
  // === STEERING ===
  { key: 'steering_pump',q:'насос гидроусилитель руль грузовик запчасть фото' },
  { key: 'steering_rack',q:'рулевая рейка механизм грузовик запчасть фото' },
  // === CABIN / OTHER ===
  { key: 'wiper_blade', q: 'щетка стеклоочиститель грузовик запчасть фото' },
  { key: 'radiator',    q: 'радиатор охлаждения грузовик запчасть фото' },
  { key: 'belt',        q: 'ремень приводной грузовик запчасть фото' },
  { key: 'hose_cooling',q: 'шланг патрубок охлаждение грузовик запчасть фото' },
]

console.log(`Starting image search for ${QUERIES.length} part types...\n`)

const result = {}
let done = 0

for (const { key, q } of QUERIES) {
  process.stdout.write(`[${++done}/${QUERIES.length}] ${key}: `)
  const imgs = await ddgImages(q, 8)
  result[key] = imgs
  console.log(`${imgs.length} images found${imgs[0] ? ' → ' + imgs[0].slice(0, 60) + '...' : ''}`)
  await sleep(700) // rate limiting
}

const outPath = path.join(__dirname, '../lib/partImageMap.json')
writeFileSync(outPath, JSON.stringify(result, null, 2))
console.log(`\nSaved to ${outPath}`)
console.log(`Total keys: ${Object.keys(result).length}`)
