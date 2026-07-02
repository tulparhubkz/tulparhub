// Pure row-mapping logic for the vendor CSV importer (scripts/import-csv.ts).
// Kept free of DB/fs imports so it can be unit-tested in isolation.

// ── Column indices in the tab-separated export ───────────────────────────────
export const COL = {
  name: 0,
  code: 1, // внутренний код → vendor_sku
  article: 2, // OEM артикул
  brand: 3,
  priceB2b: 24, // ЦЕНАОптовая KZT
  priceRetail: 25, // ЦЕНАРозничная KZT
} as const

// Physical-warehouse stock columns (transit / Europe / markdowns excluded).
export const STOCK_COLS: Record<string, number[]> = {
  'Алматы': [8, 9, 10], // Витрина + Алматы 2 + Алматы 1
  'Астана': [11],
  'Уральск': [12],
  'Бишкек': [13],
  'Павлодар': [15],
  'Шымкент': [18],
}

// ── Categories by keyword in the part name ───────────────────────────────────
export const CATEGORIES: Array<{ id: string; ru: string; keywords: string[] }> = [
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

export const KAMAZ_MODELS = ['5490', '65115', '6520', '5460', '4308', '43118', '65116', '53215', '54115', '45143']

export const OTHER_BRANDS: Array<{ name: string; aliases: string[] }> = [
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

export function detectCategory(name: string): string {
  const low = name.toLowerCase()
  for (const cat of CATEGORIES) {
    if (cat.keywords.some((k) => low.includes(k))) return cat.id
  }
  return 'other'
}

// An alias only counts when it is not glued to the tail of another word:
// "камаз 65115" contains the substring "маз " but is not a MAZ part.
function hasAlias(low: string, alias: string): boolean {
  let idx = low.indexOf(alias)
  while (idx !== -1) {
    const prev = idx > 0 ? low[idx - 1] : ' '
    if (!/[a-zа-яё0-9]/.test(prev)) return true
    idx = low.indexOf(alias, idx + 1)
  }
  return false
}

export function detectFits(name: string): string[] {
  const low = name.toLowerCase()
  const fits: string[] = []
  for (const m of KAMAZ_MODELS) if (low.includes(m)) fits.push(`KAMAZ ${m}`)
  if ((low.includes('камаз') || low.includes('kamaz')) && fits.length === 0) {
    fits.push('KAMAZ 6520', 'KAMAZ 65115', 'KAMAZ 5490')
  }
  for (const b of OTHER_BRANDS) if (b.aliases.some((a) => hasAlias(low, a))) fits.push(b.name)
  return Array.from(new Set(fits)) // (not [...new Set] — tsconfig target predates es2015 iteration)
}

export function num(v: string | undefined): number {
  return Math.floor(parseFloat((v ?? '').replace(',', '.')) || 0)
}
