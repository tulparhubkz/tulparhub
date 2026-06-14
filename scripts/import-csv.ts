/**
 * Import price list CSV into Supabase
 * Usage: npm run import-csv
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as readline from 'readline'
import * as dotenv from 'dotenv'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

const CSV_PATH = path.resolve('/Users/ulzanbaglanova/Downloads/price (30).csv')

// ── Категории по ключевым словам в названии ──────────────────────────────────
const CATEGORIES: Array<{ id: string; ru: string; keywords: string[] }> = [
  { id: 'other', ru: 'Прочее', keywords: [] },
  { id: 'engine',      ru: 'Двигатель',         keywords: ['двигател', 'поршень', 'кольца', 'гильза', 'вкладыш', 'коленвал', 'распредвал', 'клапан', 'турбин', 'насос масл', 'масляный насос', 'прокладка г/б', 'набор прокладок', 'сальник', 'патрубок', 'радиатор охл', 'радиатор системы охл', 'помпа', 'термостат', 'вентилятор'] },
  { id: 'filters',     ru: 'Фильтры',            keywords: ['фильтр масл', 'фильтр топл', 'фильтр возд', 'фильтр влаг', 'фильтр салон', 'фильтр гидр', 'фильтр коробк'] },
  { id: 'transmission',ru: 'Трансмиссия',        keywords: ['сцеплен', 'диск сцеп', 'корзина сцеп', 'выжимной', 'коробк', 'кпп', 'вал карданн', 'крестовина', 'раздаточн'] },
  { id: 'brakes',      ru: 'Тормозная система',  keywords: ['тормоз', 'колодк', 'диск тормоз', 'барабан', 'суппорт', 'цилиндр тормоз', 'энергоаккумул', 'тормозн'] },
  { id: 'suspension',  ru: 'Подвеска',           keywords: ['амортизатор', 'рессор', 'подушк', 'стабилизатор', 'рычаг подв', 'шаровая', 'стойка', 'пружин', 'опора стойк'] },
  { id: 'steering',    ru: 'Рулевое управление', keywords: ['рулев', 'гидроусилит', 'гур', 'тяга рул', 'наконечник рул', 'насос гидро'] },
  { id: 'electrical',  ru: 'Электрика',          keywords: ['генератор', 'стартер', 'фара', 'лампа', 'фонарь', 'реле', 'предохранит', 'аккумул', 'датчик', 'выключатель', 'катушка', 'форсунк'] },
  { id: 'cooling',     ru: 'Система охлаждения', keywords: ['радиатор отопит', 'радиатор масл', 'кран отопит', 'антифриз', 'охладит'] },
  { id: 'fuel',        ru: 'Топливная система',  keywords: ['топлив', 'форсунк', 'распылит', 'насос топл', 'тнвд', 'инжектор', 'бак топл'] },
  { id: 'axle',        ru: 'Мосты и трансмиссия',keywords: ['мост', 'полуось', 'дифференц', 'подшипник ступиц', 'ступиц', 'шрус', 'редуктор'] },
  { id: 'cabin',       ru: 'Кабина и кузов',     keywords: ['кабин', 'стекл', 'зеркал', 'дверь', 'брызговик', 'бампер', 'спойлер', 'крыло'] },
  { id: 'pneumatics',  ru: 'Пневматика',         keywords: ['клапан', 'пневм', 'ресивер', 'компрессор воздуш', 'осушитель', 'ускорит', 'растормаж', 'кран тормозн', 'кран главн'] },
]

// ── Модели КАМАЗ с псевдонимами ───────────────────────────────────────────────
const KAMAZ_MODELS: Array<{ id: string; aliases: string[] }> = [
  { id: '5490',  aliases: ['5490', '5490s2', '5490-s2'] },
  { id: '65115', aliases: ['65115', '651150'] },
  { id: '6520',  aliases: ['6520', '65201', '65202'] },
  { id: '5460',  aliases: ['5460', '54601'] },
  { id: '4308',  aliases: ['4308', '43085', '43086'] },
  { id: '43118', aliases: ['43118'] },
  { id: '65116', aliases: ['65116'] },
  { id: '53215', aliases: ['53215', '5320'] },
  { id: '54115', aliases: ['54115'] },
  { id: '45143', aliases: ['45143', '4514'] },
]

// ── Другие марки грузовиков ───────────────────────────────────────────────────
const OTHER_BRANDS: Array<{ name: string; aliases: string[] }> = [
  { name: 'Volvo FH12', aliases: ['volvo fh12', 'fh12'] },
  { name: 'Volvo FH13', aliases: ['volvo fh13', 'fh13'] },
  { name: 'Volvo FH', aliases: ['volvo fh', 'volvo fh/fm'] },
  { name: 'Volvo FM', aliases: ['volvo fm', 'fm'] },
  { name: 'Volvo FL', aliases: ['volvo fl'] },
  { name: 'MAN TGX', aliases: ['man tgx'] },
  { name: 'MAN TGA', aliases: ['man tga', 'man tg-a'] },
  { name: 'MAN TGS', aliases: ['man tgs'] },
  { name: 'Mercedes Actros', aliases: ['actros', 'mb actros', 'mercedes actros'] },
  { name: 'Mercedes Axor', aliases: ['axor', 'mb axor'] },
  { name: 'Mercedes Atego', aliases: ['atego', 'mb atego'] },
  { name: 'Mercedes Sprinter', aliases: ['sprinter', 'mb sprinter'] },
  { name: 'Scania', aliases: ['scania'] },
  { name: 'DAF XF95', aliases: ['daf xf95'] },
  { name: 'DAF XF105', aliases: ['daf xf105', 'daf xf'] },
  { name: 'Renault', aliases: ['renault', 'rvi', 'ренo'] },
  { name: 'Iveco', aliases: ['iveco'] },
  { name: 'MAZ', aliases: ['маз ', 'maz '] },
  { name: 'SHACMAN', aliases: ['shacman', 'шакман'] },
  { name: 'HOWO', aliases: ['howo', 'хово'] },
]

function detectCategory(name: string): string {
  const low = name.toLowerCase()
  for (const cat of CATEGORIES) {
    if (cat.keywords.some((k) => low.includes(k))) return cat.id
  }
  return 'other'
}

function detectFits(name: string): string[] {
  const low = name.toLowerCase()
  const fits: string[] = []

  // KAMAZ models
  for (const m of KAMAZ_MODELS) {
    if (m.aliases.some((a) => low.includes(a))) {
      fits.push(`KAMAZ ${m.id}`)
    }
  }
  // Generic KAMAZ mention → add common models
  if ((low.includes('камаз') || low.includes('kamaz')) && fits.length === 0) {
    fits.push('KAMAZ 6520', 'KAMAZ 65115', 'KAMAZ 5490')
  }

  // Other brands
  for (const b of OTHER_BRANDS) {
    if (b.aliases.some((a) => low.includes(a))) {
      fits.push(b.name)
    }
  }

  return [...new Set(fits)]
}

function parseStock(cols: string[]): Record<string, number> {
  // cols indexes (0-based from split): 7=Шымкент Транзит, 8=Алматы Витрина,
  // 9=Алматы 2, 10=Алматы 1, 11=Астана, 12=Уральск, 13=Бишкек склад,
  // 15=Павлодар, 18=Шымкент
  const n = (i: number) => Math.floor(parseFloat(cols[i] || '0') || 0)
  return {
    'Алматы':   n(8) + n(9) + n(10),
    'Астана':   n(11),
    'Шымкент':  n(7) + n(18),
    'Бишкек':   n(13),
    'Павлодар': n(15),
    'Уральск':  n(12),
  }
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9а-яёА-ЯЁ]+/gi, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
}

async function main() {
  console.log('\n📦 Импорт прайс-листа в Supabase...\n')

  // Ensure categories exist
  const catRows = CATEGORIES.map((c) => ({ id: c.id, ru: c.ru, icon: c.id, count: 0 }))
  const { error: catErr } = await db.from('systems').upsert(catRows, { onConflict: 'id' })
  if (catErr) console.error('systems:', catErr.message)
  else console.log(`✓ Категории (${catRows.length}) обновлены`)

  const rl = readline.createInterface({
    input: fs.createReadStream(CSV_PATH, { encoding: 'utf8' }),
    crlfDelay: Infinity,
  })

  const parts: any[] = []
  const stocks: any[] = []
  let lineNum = 0

  for await (const line of rl) {
    lineNum++
    if (lineNum === 1) continue // header

    const cols = line.split('\t')
    const name      = cols[0]?.trim()
    const code      = cols[1]?.trim()   // внутренний код
    const article   = cols[2]?.trim()   // OEM артикул
    const brand     = cols[3]?.trim()
    const priceB2B  = parseFloat(cols[24] || '0') || 0  // Оптовая KZT
    const priceRetail = parseFloat(cols[25] || '0') || 0 // Розничная KZT

    if (!name || !article || priceRetail <= 0) continue

    const id       = `p-${lineNum}`
    const category = detectCategory(name)
    const fits     = detectFits(name)
    const stock    = parseStock(cols)
    const totalStock = Object.values(stock).reduce((a, b) => a + b, 0)

    parts.push({
      id,
      oem:        article,
      name,
      brand,
      type:       'OEM',
      category,
      fits,
      price:      priceRetail,
      price_b2b:  priceB2B,
      price_usd:  Math.round(priceRetail / 450),
      vat:        12,
      eta:        totalStock > 0 ? 'В наличии' : 'Под заказ 3–5 дней',
      img:        category,
      specs:      { Артикул: article, Бренд: brand, Код: code },
      cross:      [article, code].filter(Boolean),
      rating:     4.5,
      reviews:    0,
    })

    Object.entries(stock).forEach(([city, qty]) => {
      if (qty >= 0) stocks.push({ part_id: id, city, qty })
    })
  }

  console.log(`\nПрочитано ${parts.length} товаров с ценами\n`)

  // Insert in batches of 500
  const BATCH = 500
  let inserted = 0

  for (let i = 0; i < parts.length; i += BATCH) {
    const batch = parts.slice(i, i + BATCH)
    const { error } = await db.from('parts').upsert(batch, { onConflict: 'id' })
    if (error) {
      console.error(`  ✗ batch ${i}:`, error.message, error.details, error.hint)
      if (i === 0) { console.log('Пример записи:', JSON.stringify(batch[0], null, 2)); break }
    } else {
      inserted += batch.length
      process.stdout.write(`\r  ✓ Товары: ${inserted}/${parts.length}`)
    }
  }

  console.log(`\n\n  Загружено товаров: ${inserted}`)

  // Insert stock
  let stockInserted = 0
  for (let i = 0; i < stocks.length; i += BATCH) {
    const batch = stocks.slice(i, i + BATCH)
    const { error } = await db.from('part_stock').upsert(batch, { onConflict: 'part_id,city' })
    if (!error) stockInserted += batch.length
    process.stdout.write(`\r  ✓ Остатки: ${stockInserted}/${stocks.length}`)
  }

  console.log(`\n  Загружено остатков: ${stockInserted}`)
  console.log('\n✅ Готово!\n')
}

main().catch((e) => { console.error(e); process.exit(1) })
