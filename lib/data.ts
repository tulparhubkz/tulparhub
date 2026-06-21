import type { Brand, City, EquipmentType, Model, Part, RentalUnit, System } from '@/types'

export const equipmentTypes: EquipmentType[] = [
  { id: 'tractor',   ru: 'Седельные тягачи',    en: 'Semi-trucks',    count: 20279 },
  { id: 'dump',      ru: 'Самосвалы',           en: 'Dump trucks',    count: 20279 },
  { id: 'flatbed',   ru: 'Бортовые / шасси',    en: 'Flatbed trucks', count: 20279 },
  { id: 'trailer',   ru: 'Прицепы и п/прицепы', en: 'Trailers',       count: 20279 },
  { id: 'delivery',  ru: 'Развозные',           en: 'Delivery vans',  count: 20279 },
  { id: 'special',   ru: 'Спецтехника',         en: 'Special trucks', count: 20279 },
]

// Brand and model data is derived from real `fits` values in Supabase DB (June 2026).
// `dbName` = exact prefix used in fits strings (e.g. "Mercedes Actros").
// Only models that actually appear in DB fits are listed.
export const brands: Brand[] = [
  { id: 'volvo',   name: 'Volvo',         dbName: 'Volvo',   country: 'SE', models: 5,  parts: 3180 },
  { id: 'mercedes',name: 'Mercedes-Benz', dbName: 'Mercedes',country: 'DE', models: 4,  parts: 1603 },
  { id: 'daf',     name: 'DAF',           dbName: 'DAF',     country: 'NL', models: 2,  parts: 1214 },
  { id: 'scania',  name: 'Scania',        dbName: 'Scania',  country: 'SE', models: 0,  parts: 990  },
  { id: 'renault', name: 'Renault',       dbName: 'Renault', country: 'FR', models: 0,  parts: 982  },
  { id: 'man',     name: 'MAN',           dbName: 'MAN',     country: 'DE', models: 3,  parts: 538  },
  { id: 'iveco',   name: 'Iveco',         dbName: 'Iveco',   country: 'IT', models: 0,  parts: 424  },
  { id: 'kamaz',   name: 'КАМАЗ',         dbName: 'KAMAZ',   country: 'RU', models: 5,  parts: 99   },
  { id: 'shacman', name: 'Shacman',       dbName: 'SHACMAN', country: 'CN', models: 0,  parts: 42   },
  { id: 'maz',     name: 'МАЗ',           dbName: 'MAZ',     country: 'BY', models: 0,  parts: 13   },
  { id: 'howo',    name: 'HOWO',          dbName: 'HOWO',    country: 'CN', models: 0,  parts: 11   },
]

// Only models confirmed to exist in DB fits. Brands not listed here go straight to catalog.
export const models: Record<string, Model[]> = {
  volvo: [
    { id: 'fh',   brand_id: 'volvo', name: 'FH',   years: '2012–2024', cls: 'Тягач 4×2 / 6×4',     fits: 'Volvo FH'   },
    { id: 'fh12', brand_id: 'volvo', name: 'FH12', years: '2002–2012', cls: 'Тягач (поколение II)', fits: 'Volvo FH12' },
    { id: 'fh13', brand_id: 'volvo', name: 'FH13', years: '2008–2020', cls: 'Тягач Euro 5/6',       fits: 'Volvo FH13' },
    { id: 'fl',   brand_id: 'volvo', name: 'FL',   years: '2006–2024', cls: 'Развозной городской',  fits: 'Volvo FL'   },
    { id: 'fm',   brand_id: 'volvo', name: 'FM',   years: '2010–2024', cls: 'Бортовой / шасси',     fits: 'Volvo FM'   },
  ],
  mercedes: [
    { id: 'actros',   brand_id: 'mercedes', name: 'Actros',   years: '1996–2024', cls: 'Тягач / бортовой',     fits: 'Mercedes Actros'   },
    { id: 'atego',    brand_id: 'mercedes', name: 'Atego',    years: '1998–2024', cls: 'Среднетоннажный',      fits: 'Mercedes Atego'    },
    { id: 'axor',     brand_id: 'mercedes', name: 'Axor',     years: '2001–2013', cls: 'Тягач (снят с пр-ва)', fits: 'Mercedes Axor'     },
    { id: 'sprinter', brand_id: 'mercedes', name: 'Sprinter', years: '1995–2024', cls: 'Малотоннажный фургон', fits: 'Mercedes Sprinter' },
  ],
  daf: [
    { id: 'xf105', brand_id: 'daf', name: 'XF105', years: '2006–2012', cls: 'Тягач Euro 5', fits: 'DAF XF105' },
    { id: 'xf95',  brand_id: 'daf', name: 'XF95',  years: '2002–2006', cls: 'Тягач Euro 3', fits: 'DAF XF95'  },
  ],
  man: [
    { id: 'tgx', brand_id: 'man', name: 'TGX', years: '2007–2024', cls: 'Тягач дальнобойный',    fits: 'MAN TGX' },
    { id: 'tgs', brand_id: 'man', name: 'TGS', years: '2007–2024', cls: 'Строительный / бортовой',fits: 'MAN TGS' },
    { id: 'tga', brand_id: 'man', name: 'TGA', years: '2000–2007', cls: 'Тягач (предыдущее пок.)', fits: 'MAN TGA' },
  ],
  kamaz: [
    { id: '6520',  brand_id: 'kamaz', name: '6520',  years: '2007–2024', cls: 'Самосвал 20т 6×4', fits: 'KAMAZ 6520'  },
    { id: '65115', brand_id: 'kamaz', name: '65115', years: '2006–2024', cls: 'Самосвал 15т 6×4', fits: 'KAMAZ 65115' },
    { id: '5490',  brand_id: 'kamaz', name: '5490',  years: '2014–2024', cls: 'Тягач Neo 4×2',    fits: 'KAMAZ 5490'  },
    { id: '5460',  brand_id: 'kamaz', name: '5460',  years: '2006–2020', cls: 'Тягач 4×2',        fits: 'KAMAZ 5460'  },
    { id: '53215', brand_id: 'kamaz', name: '53215', years: '2004–2024', cls: 'Бортовой 6×4',     fits: 'KAMAZ 53215' },
  ],
}

export const systems: System[] = [
  { id: 'engine',       ru: 'Двигатель',          icon: 'engine',       count: 3480 },
  { id: 'suspension',   ru: 'Ходовая и подвеска', icon: 'suspension',   count: 2326 },
  { id: 'electrical',   ru: 'Электрика',          icon: 'electrical',   count: 1665 },
  { id: 'transmission', ru: 'Трансмиссия',        icon: 'transmission', count: 1298 },
  { id: 'cabin',        ru: 'Кабина и кузов',     icon: 'cabin',        count: 1076 },
  { id: 'brakes',       ru: 'Тормозная система',  icon: 'brakes',       count: 988  },
  { id: 'filters',      ru: 'Фильтры',            icon: 'filters',      count: 751  },
  { id: 'steering',     ru: 'Рулевое управление', icon: 'steering',     count: 474  },
  { id: 'axle',         ru: 'Мосты и полуоси',    icon: 'axle',         count: 451  },
  { id: 'fuel',         ru: 'Топливная система',  icon: 'fuel',         count: 183  },
  { id: 'cooling',      ru: 'Система охлаждения', icon: 'cooling',      count: 128  },
  { id: 'pneumatics',   ru: 'Пневматика',         icon: 'pneumatics',   count: 88   },
]

export const subAssemblies: Record<string, string[]> = {
  engine: ['Турбокомпрессор', 'Форсунки', 'Комплект прокладок', 'Масляный насос', 'Гильзы цилиндров', 'Поршневые кольца', 'Водяной насос', 'Ремни и натяжители'],
}

export const parts: Part[] = [
  {
    id: 'p-740-1118', oem: '740.1118010-02', name: 'Турбокомпрессор ТКР-7Н1',
    brand: 'БЗА', type: 'OEM', category: 'engine',
    fits: ['KAMAZ 6520', 'KAMAZ 65115', 'KAMAZ 43118'],
    price: 285000, priceUSD: 590, vat: 12,
    stock: { 'Алматы': 4, 'Астана': 2, 'Ташкент': 0, 'Москва': 12 },
    eta: 'В наличии · Алматы', img: 'turbo',
    specs: { 'Производительность': '0,42 кг/с', 'Степень сжатия': '2,4', 'Макс. частота': '95 000 об/мин', 'Тип подшипника': 'Скольжения', 'Масса': '11,2 кг' },
    cross: ['740.30-1118010', '740.11-1118010', 'TKR-7N1'],
    rating: 4.8, reviews: 42,
  },
  {
    id: 'p-mann-w962', oem: 'W 962', name: 'Фильтр масляный',
    brand: 'MANN-FILTER', type: 'Aftermarket', category: 'filter',
    fits: ['KAMAZ 6520', 'KAMAZ 65115', 'MAZ 6430', 'Shacman F3000'],
    price: 4200, priceUSD: 9, vat: 12,
    stock: { 'Алматы': 124, 'Астана': 58, 'Ташкент': 31, 'Москва': 200 },
    eta: 'В наличии · все склады', img: 'filter',
    specs: { 'Высота': '142 мм', 'Внешний Ø': '93 мм', 'Резьба': '3/4-16 UNF', 'Производитель': 'MANN-FILTER (Германия)' },
    cross: ['LF3349', '7421561278', 'WK 950/19'],
    rating: 4.9, reviews: 318,
  },
  {
    id: 'p-bosch-0445120', oem: '0 445 120 153', name: 'Форсунка топливная Common Rail',
    brand: 'Bosch', type: 'OEM', category: 'fuel',
    fits: ['KAMAZ 6520 (Cummins ISL)', 'KAMAZ 65115', 'CAT 320'],
    price: 78500, priceUSD: 165, vat: 12,
    stock: { 'Алматы': 6, 'Астана': 3, 'Ташкент': 1, 'Москва': 24 },
    eta: 'В наличии · Алматы', img: 'injector',
    specs: { 'Давление впрыска': '1800 бар', 'Тип распылителя': 'DLLA 152 P 1832', 'Электромагнитный клапан': 'Bosch' },
    cross: ['0445120152', '5263262', '4940640'],
    rating: 4.7, reviews: 91,
  },
  {
    id: 'p-clutch-182', oem: '182.1601090', name: 'Корзина сцепления Ø430',
    brand: 'КАМАЗ', type: 'OEM', category: 'trans',
    fits: ['KAMAZ 6520', 'KAMAZ 65115', 'KAMAZ 5490'],
    price: 64200, priceUSD: 135, vat: 12,
    stock: { 'Алматы': 2, 'Астана': 0, 'Ташкент': 0, 'Москва': 8 },
    eta: 'Под заказ · 3–5 дней', img: 'clutch',
    specs: { 'Диаметр': '430 мм', 'Число шлицов': '10', 'Масса': '38 кг' },
    cross: ['182.1601090-10'],
    rating: 4.6, reviews: 23,
  },
  {
    id: 'p-pump-740', oem: '740.1307010', name: 'Насос водяной (помпа)',
    brand: 'ТЯЖМАШ', type: 'Aftermarket', category: 'cool',
    fits: ['KAMAZ 6520', 'KAMAZ 65115'],
    price: 18900, priceUSD: 40, vat: 12,
    stock: { 'Алматы': 14, 'Астана': 9, 'Ташкент': 4, 'Москва': 30 },
    eta: 'В наличии · Алматы', img: 'pump',
    specs: { 'Производительность': '320 л/мин', 'Масса': '6,4 кг' },
    cross: ['740.1307010-04'],
    rating: 4.4, reviews: 67,
  },
  {
    id: 'p-brake-100', oem: '100.3501090', name: 'Тормозная камера тип 30',
    brand: 'WABCO', type: 'OEM', category: 'brakes',
    fits: ['KAMAZ 6520', 'MAZ 6430', 'Shacman F3000'],
    price: 12400, priceUSD: 26, vat: 12,
    stock: { 'Алматы': 28, 'Астана': 12, 'Ташкент': 6, 'Москва': 40 },
    eta: 'В наличии · все склады', img: 'brake',
    specs: { 'Тип': '30/30', 'Ход штока': '64 мм' },
    cross: ['9253011000'],
    rating: 4.7, reviews: 154,
  },
  {
    id: 'p-belt-740', oem: '740.1308020', name: 'Ремень ручейковый 8PK 1395',
    brand: 'Gates', type: 'Aftermarket', category: 'engine',
    fits: ['KAMAZ 6520', 'KAMAZ 65115', 'KAMAZ 43118'],
    price: 5800, priceUSD: 12, vat: 12,
    stock: { 'Алматы': 52, 'Астана': 24, 'Ташкент': 11, 'Москва': 90 },
    eta: 'В наличии · все склады', img: 'belt',
    specs: { 'Длина': '1395 мм', 'Ширина': '28,6 мм', 'Число ручьёв': '8' },
    cross: ['8PK1395', '740.1308020-10'],
    rating: 4.8, reviews: 88,
  },
  {
    id: 'p-shock-65115', oem: '65115-2905006', name: 'Амортизатор передней подвески',
    brand: 'ТЯЖМАШ', type: 'OEM', category: 'chassis',
    fits: ['KAMAZ 65115', 'KAMAZ 43118'],
    price: 9600, priceUSD: 20, vat: 12,
    stock: { 'Алматы': 18, 'Астана': 4, 'Ташкент': 0, 'Москва': 22 },
    eta: 'В наличии · Алматы', img: 'shock',
    specs: { 'Ход': '230 мм', 'Длина сж.': '420 мм', 'Длина раст.': '650 мм' },
    cross: ['65115-2905006-30'],
    rating: 4.5, reviews: 41,
  },
]

export const rental: RentalUnit[] = [
  {
    id: 'r-pc200', name: 'Экскаватор гусеничный PC200', brand: 'Komatsu', year: 2021, type: 'excavator', img: 'excavator',
    specs: { 'Масса': '20,5 т', 'Объём ковша': '1,0 м³', 'Глубина': '6,6 м', 'Мощность': '110 кВт' },
    rates: { shift: 75000, day: 95000, week: 580000, month: 1800000 },
    city: 'Алматы', operator: true, delivery: 'В черте города — бесплатно', available: 'Сегодня', condition: 'Отличное', hours: 4820,
  },
  {
    id: 'r-cat320', name: 'Экскаватор CAT 320', brand: 'CAT', year: 2022, type: 'excavator', img: 'excavator',
    specs: { 'Масса': '20,2 т', 'Объём ковша': '1,19 м³', 'Глубина': '6,7 м', 'Мощность': '121 кВт' },
    rates: { shift: 85000, day: 110000, week: 660000, month: 2100000 },
    city: 'Алматы', operator: true, delivery: 'В черте города — бесплатно', available: 'с 27 мая', condition: 'Отличное', hours: 2140,
  },
  {
    id: 'r-sdlg956', name: 'Фронтальный погрузчик SDLG L956', brand: 'SDLG', year: 2020, type: 'loader', img: 'loader',
    specs: { 'Грузоподъёмность': '5 т', 'Объём ковша': '3,0 м³', 'Мощность': '162 кВт' },
    rates: { shift: 55000, day: 70000, week: 420000, month: 1350000 },
    city: 'Астана', operator: false, delivery: 'Тралом — расчёт по запросу', available: 'Сегодня', condition: 'Хорошее', hours: 6800,
  },
  {
    id: 'r-shacman', name: 'Самосвал Shacman F3000 8×4', brand: 'Shacman', year: 2022, type: 'dump', img: 'dump',
    specs: { 'Грузоподъёмность': '30 т', 'Объём кузова': '20 м³', 'Мощность': '280 кВт' },
    rates: { shift: 48000, day: 62000, week: 380000, month: 1200000 },
    city: 'Алматы', operator: true, delivery: 'Под объект — бесплатно по городу', available: 'Сегодня', condition: 'Отличное', hours: 1980,
  },
  {
    id: 'r-crane25', name: 'Автокран 25 т (КС-55713)', brand: 'Галичанин', year: 2019, type: 'crane', img: 'crane',
    specs: { 'Грузоподъёмность': '25 т', 'Вылет стрелы': '21,7 м', 'Высота подъёма': '21 м' },
    rates: { shift: 95000, day: 125000, week: 750000, month: 2400000 },
    city: 'Алматы', operator: true, delivery: 'По адресу — бесплатно', available: 'с 28 мая', condition: 'Хорошее', hours: 9200,
  },
  {
    id: 'r-roller', name: 'Каток дорожный 12 т', brand: 'XCMG', year: 2021, type: 'roller', img: 'roller',
    specs: { 'Масса': '12 т', 'Ширина вальца': '2,13 м', 'Мощность': '92 кВт' },
    rates: { shift: 38000, day: 50000, week: 300000, month: 950000 },
    city: 'Алматы', operator: true, delivery: 'Трал — 35 000 ₸ по городу', available: 'Сегодня', condition: 'Отличное', hours: 3140,
  },
]

export const cities: City[] = [
  { id: 'almaty',       name: 'Алматы',         country: 'KZ', currency: 'KZT', symbol: '₸' },
  { id: 'astana',       name: 'Астана',          country: 'KZ', currency: 'KZT', symbol: '₸' },
  { id: 'shymkent',     name: 'Шымкент',         country: 'KZ', currency: 'KZT', symbol: '₸' },
  { id: 'aktobe',       name: 'Актобе',          country: 'KZ', currency: 'KZT', symbol: '₸' },
  { id: 'karaganda',    name: 'Қарағанды',       country: 'KZ', currency: 'KZT', symbol: '₸' },
  { id: 'taraz',        name: 'Тараз',           country: 'KZ', currency: 'KZT', symbol: '₸' },
  { id: 'pavlodar',     name: 'Павлодар',        country: 'KZ', currency: 'KZT', symbol: '₸' },
  { id: 'ust-kamen',    name: 'Өскемен',         country: 'KZ', currency: 'KZT', symbol: '₸' },
  { id: 'semey',        name: 'Семей',           country: 'KZ', currency: 'KZT', symbol: '₸' },
  { id: 'atyrau',       name: 'Атырау',          country: 'KZ', currency: 'KZT', symbol: '₸' },
  { id: 'kostanay',     name: 'Қостанай',        country: 'KZ', currency: 'KZT', symbol: '₸' },
  { id: 'kyzylorda',    name: 'Қызылорда',       country: 'KZ', currency: 'KZT', symbol: '₸' },
  { id: 'oral',         name: 'Орал',            country: 'KZ', currency: 'KZT', symbol: '₸' },
  { id: 'petropavl',    name: 'Петропавл',       country: 'KZ', currency: 'KZT', symbol: '₸' },
  { id: 'aktau',        name: 'Ақтау',           country: 'KZ', currency: 'KZT', symbol: '₸' },
  { id: 'temirtau',     name: 'Теміртау',        country: 'KZ', currency: 'KZT', symbol: '₸' },
  { id: 'turkestan',    name: 'Түркістан',       country: 'KZ', currency: 'KZT', symbol: '₸' },
  { id: 'kokshetau',    name: 'Көкшетау',        country: 'KZ', currency: 'KZT', symbol: '₸' },
  { id: 'taldykorgan',  name: 'Талдықорған',     country: 'KZ', currency: 'KZT', symbol: '₸' },
  { id: 'ekibastuz',    name: 'Екібастұз',       country: 'KZ', currency: 'KZT', symbol: '₸' },
  { id: 'rudny',        name: 'Рудный',          country: 'KZ', currency: 'KZT', symbol: '₸' },
  { id: 'zhezkazgan',   name: 'Жезқазған',       country: 'KZ', currency: 'KZT', symbol: '₸' },
  { id: 'balkhash',     name: 'Балқаш',          country: 'KZ', currency: 'KZT', symbol: '₸' },
  { id: 'kentau',       name: 'Кентау',          country: 'KZ', currency: 'KZT', symbol: '₸' },
  { id: 'zhankent',     name: 'Жаңқент',         country: 'KZ', currency: 'KZT', symbol: '₸' },
  { id: 'saran',        name: 'Сарань',          country: 'KZ', currency: 'KZT', symbol: '₸' },
  { id: 'stepnogorsk',  name: 'Степногорск',     country: 'KZ', currency: 'KZT', symbol: '₸' },
  { id: 'shchuchinsk',  name: 'Щучинск',         country: 'KZ', currency: 'KZT', symbol: '₸' },
  { id: 'zhanaozen',    name: 'Жаңаөзен',        country: 'KZ', currency: 'KZT', symbol: '₸' },
  { id: 'baikonur',     name: 'Байқоңыр',        country: 'KZ', currency: 'KZT', symbol: '₸' },
]
