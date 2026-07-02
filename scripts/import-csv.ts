/**
 * Import the vendor price/stock CSV (the current source of truth) into Postgres.
 *
 *   yarn import-csv                 # uses CSV_PATH + VENDOR_ID from .env
 *   CSV_PATH=./foo.csv yarn import-csv
 *
 * Idempotent: parts are keyed on (vendor_id, vendor_sku) with a deterministic id,
 * so re-running updates prices/stock instead of creating duplicates. Parts that
 * disappear from the file are marked inactive. Each run is recorded in sync_runs.
 */
import 'dotenv/config'
import * as fs from 'fs'
import * as readline from 'readline'
import { eq, sql } from 'drizzle-orm'
import { db } from '../lib/db'
import { vendors, systems, parts, partStock, syncRuns } from '../lib/db/schema'

const CSV_PATH = process.env.CSV_PATH ?? './example_database.csv'
const VENDOR_ID = process.env.VENDOR_ID ?? 'main'
const USD_RATE = Number(process.env.USD_RATE ?? 470)
const BATCH = 500

// ── Column indices in the tab-separated export ───────────────────────────────
const COL = {
  name: 0,
  code: 1, // внутренний код → vendor_sku
  article: 2, // OEM артикул
  brand: 3,
  priceB2b: 24, // ЦЕНАОптовая KZT
  priceRetail: 25, // ЦЕНАРозничная KZT
} as const

// Physical-warehouse stock columns (transit / Europe / markdowns excluded).
const STOCK_COLS: Record<string, number[]> = {
  'Алматы': [8, 9, 10], // Витрина + Алматы 2 + Алматы 1
  'Астана': [11],
  'Уральск': [12],
  'Бишкек': [13],
  'Павлодар': [15],
  'Шымкент': [18],
}

// ── Categories by keyword in the part name ───────────────────────────────────
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

const KAMAZ_MODELS = ['5490', '65115', '6520', '5460', '4308', '43118', '65116', '53215', '54115', '45143']
const OTHER_BRANDS: Array<{ name: string; aliases: string[] }> = [
  { name: 'Volvo FH12', aliases: ['volvo fh12', 'fh12'] },
  { name: 'Volvo FH13', aliases: ['volvo fh13', 'fh13'] },
  { name: 'Volvo FH', aliases: ['volvo fh', 'volvo fh/fm'] },
  { name: 'Volvo FM', aliases: ['volvo fm'] },
  { name: 'Volvo FL', aliases: ['volvo fl'] },
  { name: 'MAN TGX', aliases: ['man tgx'] },
  { name: 'MAN TGA', aliases: ['man tga', 'man tg-a'] },
  { name: 'MAN TGS', aliases: ['man tgs'] },
  { name: 'Mercedes Actros', aliases: ['actros'] },
  { name: 'Mercedes Axor', aliases: ['axor'] },
  { name: 'Mercedes Atego', aliases: ['atego'] },
  { name: 'Mercedes Sprinter', aliases: ['sprinter'] },
  { name: 'Scania', aliases: ['scania'] },
  { name: 'DAF XF95', aliases: ['daf xf95'] },
  { name: 'DAF XF105', aliases: ['daf xf105', 'daf xf'] },
  { name: 'DAF XF106', aliases: ['daf xf106', 'xf 106'] },
  { name: 'Renault', aliases: ['renault', 'rvi'] },
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
  for (const m of KAMAZ_MODELS) if (low.includes(m)) fits.push(`KAMAZ ${m}`)
  if ((low.includes('камаз') || low.includes('kamaz')) && fits.length === 0) {
    fits.push('KAMAZ 6520', 'KAMAZ 65115', 'KAMAZ 5490')
  }
  for (const b of OTHER_BRANDS) if (b.aliases.some((a) => low.includes(a))) fits.push(b.name)
  return [...new Set(fits)]
}

function num(v: string | undefined): number {
  return Math.floor(parseFloat((v ?? '').replace(',', '.')) || 0)
}

type PartRow = typeof parts.$inferInsert
type StockRow = typeof partStock.$inferInsert

async function upsertParts(rows: PartRow[]) {
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH)
    await db
      .insert(parts)
      .values(batch)
      .onConflictDoUpdate({
        target: parts.id,
        set: {
          name: sql`excluded.name`,
          oem: sql`excluded.oem`,
          brand: sql`excluded.brand`,
          type: sql`excluded.type`,
          category: sql`excluded.category`,
          fits: sql`excluded.fits`,
          price: sql`excluded.price`,
          priceB2b: sql`excluded.price_b2b`,
          priceUsd: sql`excluded.price_usd`,
          vat: sql`excluded.vat`,
          eta: sql`excluded.eta`,
          img: sql`excluded.img`,
          specs: sql`excluded.specs`,
          cross: sql`excluded.cross`,
          active: sql`true`,
          updatedAt: sql`now()`,
        },
      })
  }
}

async function upsertStock(rows: StockRow[]) {
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH)
    await db
      .insert(partStock)
      .values(batch)
      .onConflictDoUpdate({
        target: [partStock.partId, partStock.city],
        set: { qty: sql`excluded.qty`, updatedAt: sql`now()` },
      })
  }
}

async function main() {
  if (!fs.existsSync(CSV_PATH)) {
    throw new Error(`CSV not found at ${CSV_PATH} (set CSV_PATH in .env)`)
  }

  console.log(`\n📦 Importing ${CSV_PATH} → vendor "${VENDOR_ID}"\n`)

  // Ensure vendor + categories exist.
  await db.insert(vendors).values({ id: VENDOR_ID, name: VENDOR_ID }).onConflictDoNothing()
  await db
    .insert(systems)
    .values(CATEGORIES.map((c) => ({ id: c.id, ru: c.ru, icon: c.id })))
    .onConflictDoNothing()

  // Open a sync run.
  const [run] = await db
    .insert(syncRuns)
    .values({ vendorId: VENDOR_ID, source: 'csv' })
    .returning({ id: syncRuns.id })

  const rl = readline.createInterface({
    input: fs.createReadStream(CSV_PATH, { encoding: 'utf8' }),
    crlfDelay: Infinity,
  })

  const partRows: PartRow[] = []
  const stockRows: StockRow[] = []
  let lineNum = 0
  let read = 0

  try {
    for await (const line of rl) {
      lineNum++
      if (lineNum === 1) continue // header
      if (!line.trim()) continue

      const cols = line.split('\t')
      const name = cols[COL.name]?.trim()
      const sku = cols[COL.code]?.trim()
      const article = cols[COL.article]?.trim() || null
      const brand = cols[COL.brand]?.trim() || null
      const priceRetail = num(cols[COL.priceRetail])
      const priceB2b = num(cols[COL.priceB2b])

      // Skip unnamed / unkeyed / not-yet-priced rows (not sellable).
      if (!name || !sku || priceRetail <= 0) continue
      read++

      const id = `${VENDOR_ID}:${sku}`
      const category = detectCategory(name)
      const fits = detectFits(name)

      const stock: Record<string, number> = {}
      let total = 0
      for (const [city, idxs] of Object.entries(STOCK_COLS)) {
        const qty = idxs.reduce((sum, i) => sum + num(cols[i]), 0)
        stock[city] = qty
        total += qty
      }

      partRows.push({
        id,
        vendorId: VENDOR_ID,
        vendorSku: sku,
        oem: article,
        name,
        brand,
        type: 'OEM',
        category,
        fits,
        price: priceRetail,
        priceB2b: priceB2b || null,
        priceUsd: Math.round(priceRetail / USD_RATE),
        vat: 12,
        eta: total > 0 ? 'В наличии' : 'Под заказ 3–5 дней',
        img: category,
        specs: { Артикул: article ?? '', Бренд: brand ?? '', Код: sku },
        cross: [article, sku].filter(Boolean) as string[],
      })

      for (const [city, qty] of Object.entries(stock)) {
        stockRows.push({ partId: id, city, qty })
      }
    }

    // Deduplicate on the conflict keys (a repeated SKU in the export would make
    // ON CONFLICT DO UPDATE hit the same row twice in one INSERT and abort).
    // Last occurrence wins, same as re-running the import.
    const uniqParts = Array.from(new Map(partRows.map((r) => [r.id, r])).values())
    const uniqStock = Array.from(new Map(stockRows.map((r) => [`${r.partId} ${r.city}`, r])).values())

    // Only now that the whole file parsed cleanly, retire this vendor's parts;
    // the upsert re-activates the ones still present. Doing this before parsing
    // meant a corrupt CSV left the entire storefront empty.
    console.log(`Parsed ${read} sellable rows (${uniqParts.length} unique). Upserting…`)
    await db.update(parts).set({ active: false }).where(eq(parts.vendorId, VENDOR_ID))
    await upsertParts(uniqParts)
    console.log(`  ✓ parts: ${uniqParts.length}`)
    await upsertStock(uniqStock)
    console.log(`  ✓ stock rows: ${uniqStock.length}`)

    await db
      .update(syncRuns)
      .set({
        finishedAt: new Date(),
        status: 'success',
        rowsRead: read,
        partsUpserted: uniqParts.length,
        stockUpserted: uniqStock.length,
      })
      .where(eq(syncRuns.id, run.id))

    console.log('\n✅ Import complete.\n')
  } catch (err) {
    await db
      .update(syncRuns)
      .set({ finishedAt: new Date(), status: 'error', error: String(err) })
      .where(eq(syncRuns.id, run.id))
    throw err
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
