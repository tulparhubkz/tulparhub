'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/store/cart'
import { useWishlist } from '@/store/wishlist'
import { fmtKZT } from '@/lib/utils'

function parseSpecs(name: string, brand: string): Record<string, string> {
  const specs: Record<string, string> = {}
  const n = name.toLowerCase()

  const dimMatch = name.match(/(\d[\d.,]+)[×x](\d[\d.,]+)(?:[×x](\d[\d.,]+))?/)
  if (dimMatch) {
    if (dimMatch[3]) {
      specs['Внутр. диаметр'] = dimMatch[1] + ' мм'
      specs['Наружн. диаметр'] = dimMatch[2] + ' мм'
      specs['Ширина'] = dimMatch[3] + ' мм'
    } else {
      specs['Диаметр'] = dimMatch[1] + ' мм'
      specs['Ширина'] = dimMatch[2] + ' мм'
    }
  }

  if (n.includes('сальник')) {
    specs['Тип'] = 'Сальник коленвала'
    if (n.includes('распредвал')) specs['Тип'] = 'Сальник распредвала'
    if (n.includes('ступиц')) specs['Тип'] = 'Сальник ступицы'
    if (n.includes('хвостовик')) specs['Тип'] = 'Сальник хвостовика'
    if (n.includes('полуос')) specs['Тип'] = 'Сальник полуоси'
    specs['Расположение'] = n.includes('задн') ? 'Задний' : n.includes('перед') ? 'Передний' : 'Универсальный'
    specs['Материал'] = n.includes('fkm') || n.includes('фторкаучук') ? 'FKM (фторкаучук)' : n.includes('ptfe') ? 'PTFE' : 'Акрилат/NBR'
  } else if (n.includes('фильтр масл')) {
    specs['Тип'] = 'Фильтр масляный'; specs['Резьба'] = 'M20×1.5'
  } else if (n.includes('фильтр топл')) {
    specs['Тип'] = 'Фильтр топливный'
  } else if (n.includes('фильтр возд')) {
    specs['Тип'] = 'Фильтр воздушный'
  } else if (n.includes('прокладка г/б') || n.includes('прокладка гбц')) {
    specs['Тип'] = 'Прокладка ГБЦ'
  } else if (n.includes('набор прокладок')) {
    specs['Тип'] = 'Набор прокладок'
    specs['Комплектация'] = n.includes('верхн') ? 'Верхний' : n.includes('нижн') ? 'Нижний' : 'Полный'
  } else if (n.includes('подшипник')) {
    specs['Тип'] = n.includes('выжимн') ? 'Подшипник выжимной' : n.includes('ступиц') ? 'Подшипник ступицы' : 'Подшипник'
  } else if (n.includes('амортизатор')) {
    specs['Тип'] = 'Амортизатор'
    specs['Расположение'] = n.includes('пер') ? 'Передний' : n.includes('зад') ? 'Задний' : 'Универсальный'
  } else if (n.includes('диск сцеп')) {
    specs['Тип'] = 'Диск сцепления'
  } else if (n.includes('корзина сцеп')) {
    specs['Тип'] = 'Корзина сцепления'
  } else if (n.includes('колодк')) {
    specs['Тип'] = 'Тормозные колодки'
    specs['Ось'] = n.includes('пер') ? 'Передняя' : n.includes('зад') ? 'Задняя' : 'Универсальная'
  } else if (n.includes('диск тормоз')) {
    specs['Тип'] = 'Диск тормозной'
  } else if (n.includes('радиатор')) {
    specs['Тип'] = n.includes('масл') ? 'Масляный радиатор' : n.includes('отопит') ? 'Радиатор отопителя' : 'Радиатор охлаждения'
  } else if (n.includes('вкладыш')) {
    specs['Тип'] = n.includes('шатун') ? 'Вкладыши шатунные' : n.includes('коренн') ? 'Вкладыши коренные' : 'Вкладыши'
    const sz = name.match(/(STD|0\.25|0\.50|0\.75|1\.00)/i)
    if (sz) specs['Размер'] = sz[1] === 'STD' ? 'Стандарт (STD)' : `Ремонтный +${sz[1]}`
  } else if (n.includes('поршень')) {
    specs['Тип'] = 'Поршень'
  }

  const countryMap: Record<string, string> = {
    'ELRING': 'Германия', 'MANN-FILTER': 'Германия', 'BOSCH': 'Германия',
    'FEBI': 'Германия', 'SACHS': 'Германия', 'LUK': 'Германия',
    'WABCO': 'Бельгия', 'VICTOR REINZ': 'Германия', 'CORTECO': 'Германия',
    'GLYCO': 'Германия', 'MAHLE': 'Германия', 'KOLBENSCHMIDT': 'Германия',
    'DT': 'Германия', 'HELLA': 'Германия', 'NRF': 'Нидерланды',
    'SAMPA': 'Турция', 'VADEN': 'Турция', 'CEI': 'Италия',
    'SORL': 'Китай', 'SMARTTECH': 'Турция',
  }
  if (countryMap[brand]) specs['Страна'] = countryMap[brand]

  const premiumBrands = ['ELRING','MANN-FILTER','BOSCH','SACHS','LUK','WABCO','VICTOR REINZ','MAHLE','GLYCO','HELLA','FEBI','CORTECO']
  const midBrands = ['DT','NRF','SAMPA','VADEN','CEI','AUGER']
  specs['Сегмент'] = premiumBrands.includes(brand) ? 'Премиум' : midBrands.includes(brand) ? 'Средний' : 'Бюджет'
  specs['Производитель'] = brand
  specs['Гарантия'] = '12 месяцев'
  return specs
}

function deliveryDays(city: string): string {
  const map: Record<string, string> = {
    'Алматы': 'сегодня', 'Астана': '1–2 дня',
    'Шымкент': '2–3 дня', 'Уральск': '3–4 дня',
    'Бишкек': '2–3 дня', 'Павлодар': '2–3 дня',
  }
  return map[city] ?? '3–5 дней'
}

function tierClass(seg: string): string {
  if (seg === 'Премиум') return 'prem'
  if (seg === 'Средний') return 'mid'
  return 'budget'
}

function tierLabel(seg: string): string {
  if (seg === 'Премиум') return 'ПРЕМИУМ'
  if (seg === 'Средний') return 'СРЕДНИЙ'
  return 'БЮДЖЕТ'
}

const GlyphSvg = ({ size = 120 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" style={{ color: '#c2ccdb' }}>
    <rect x="10" y="30" width="100" height="60" rx="8" stroke="currentColor" strokeWidth="3"/>
    <path d="M10 50h100M30 30v60M90 30v60" stroke="currentColor" strokeWidth="2"/>
  </svg>
)

const CartIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
)

const BookmarkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
  </svg>
)

const HouseIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)

const TruckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
)

export default function PDPPage() {
  const { id } = useParams<{ id: string }>()
  const router  = useRouter()
  const [part, setPart]       = useState<any>(null)
  const [analogs, setAnalogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [qty, setQty]         = useState(1)
  const [b2b, setB2b]         = useState(false)
  const [activeThumb, setActiveThumb] = useState(0)
  const [imgUrl, setImgUrl]   = useState<string | null>(null)
  const { items, addItem }    = useCart()
  const { toggle: wlToggle, has: wlHas } = useWishlist()

  useEffect(() => {
    fetch(`/api/parts/${id}`)
      .then(r => r.json())
      .then(async (data) => {
        if (data.part_stock) {
          data.stock = Object.fromEntries(
            data.part_stock.map((s: any) => [s.city, s.qty])
          )
        }
        setPart(data)

        // Fetch real product image
        const imgParams = new URLSearchParams()
        if (data.oem) imgParams.set('oem', data.oem)
        else if (data.name) imgParams.set('name', data.name)
        fetch(`/api/part-image?${imgParams}`)
          .then(r => r.json())
          .then(d => { if (d.url) setImgUrl(d.url) })
          .catch(() => {})

        if (data.name && data.category) {
          const firstWord = data.name.split(' ')[0]
          const res = await fetch(`/api/parts?q=${encodeURIComponent(firstWord)}&system=${data.category}`)
          const rd  = await res.json()
          const others = (rd.items || [])
            .filter((p: any) => p.id !== id && p.brand !== data.brand)
            .map((p: any) => ({
              ...p,
              stock: p.part_stock
                ? Object.fromEntries(p.part_stock.map((s: any) => [s.city, s.qty]))
                : {},
            }))
            .slice(0, 3)
          setAnalogs(others)
        }
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="container" style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--ink-3)' }}>
      Загрузка...
    </div>
  )
  if (!part || part.error) return (
    <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
      <h2>Товар не найден</h2>
      <Link href="/catalog" style={{ color: 'var(--accent)', marginTop: 16, display: 'inline-block' }}>← Вернуться в каталог</Link>
    </div>
  )

  const price    = b2b ? (part.price_b2b || part.price) : part.price
  const priceB2b = part.price_b2b || Math.round(part.price * 0.82)
  const stock    = part.stock as Record<string, number> ?? {}
  const totalQty = Object.values(stock).reduce((a: number, b: number) => a + b, 0)
  const inCart   = items.some(i => i.id === part.id)
  const inWish   = wlHas(part.id)
  const specs    = parseSpecs(part.name, part.brand)
  const isOEM    = (part.type || '').toUpperCase() === 'OEM'

  const stockEntries = Object.entries(stock)
    .filter(([, q]) => (q as number) > 0)
    .sort(([a], [b]) => (a === 'Алматы' ? -1 : b === 'Алматы' ? 1 : 0))

  const specEntries = Object.entries(specs)
  const crossNums   = [part.oem, ...(part.cross || [])].filter(Boolean)
  const mySeg       = specs['Сегмент'] || 'Бюджет'

  return (
    <>
      <style>{`
        .pdp{display:grid;grid-template-columns:440px 1fr;gap:34px;align-items:start}
        .gallery{position:sticky;top:18px}
        .gal-main{aspect-ratio:1;background:linear-gradient(140deg,#f6f8fb,#eef2f7);border:1px solid var(--line);border-radius:var(--radius-lg);display:grid;place-items:center;position:relative}
        .gal-main .brandchip{position:absolute;top:16px;left:16px;background:#fff;border:1px solid var(--line);font-family:var(--font-jetbrains),monospace;font-size:12px;font-weight:600;color:var(--ink-2);padding:5px 11px;border-radius:7px}
        .gal-thumbs{display:flex;gap:10px;margin-top:12px}
        .gal-thumbs .th{width:74px;height:74px;border-radius:9px;background:linear-gradient(140deg,#f6f8fb,#eef2f7);border:1.5px solid var(--line);display:grid;place-items:center;cursor:pointer;color:#c2ccdb;transition:.12s}
        .gal-thumbs .th.on{border-color:var(--accent)}
        .pdp-badges{display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap}
        .badge{font-size:11px;font-weight:700;letter-spacing:.03em;padding:4px 9px;border-radius:6px;display:inline-flex;align-items:center;gap:5px;white-space:nowrap}
        .badge.oem{background:color-mix(in oklab,var(--gold) 15%,#fff);color:#8a6614}
        .badge.stock{background:var(--ok-soft);color:var(--ok)}
        .pdp-title{font-size:28px;font-weight:800;letter-spacing:-.02em;line-height:1.15}
        .pdp-sub{margin-top:12px;display:flex;align-items:center;gap:16px;flex-wrap:wrap;color:var(--ink-2);font-size:14px}
        .pdp-sub .art{font-family:var(--font-jetbrains),monospace;color:var(--ink);font-weight:600}
        .pdp-sub .dot{width:3px;height:3px;border-radius:50%;background:var(--line-2);display:inline-block}
        .stars{display:inline-flex;gap:1px;color:var(--gold);font-size:14px}
        .buybox{margin-top:24px;border:1px solid var(--line);border-radius:var(--radius-lg);background:var(--surf);overflow:hidden}
        .buybox-top{padding:22px 24px;display:flex;align-items:flex-end;justify-content:space-between;gap:20px;flex-wrap:wrap}
        .price-main{display:flex;flex-direction:column;gap:3px}
        .price-now{font-size:34px;font-weight:800;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
        .price-meta{font-size:13px;color:var(--ink-3)}
        .price-meta b{color:var(--ok);font-weight:600}
        .persontype{display:inline-flex;background:var(--surf-2);border-radius:9px;padding:3px}
        .persontype button{font-size:13px;font-weight:600;color:var(--ink-2);padding:7px 15px;border-radius:6px;background:none;border:none;cursor:pointer}
        .persontype button.on{background:var(--ink);color:#fff}
        .buybox-actions{padding:0 24px 22px;display:flex;align-items:center;gap:12px}
        .qty-ctrl{display:flex;align-items:center;border:1.5px solid var(--line-2);border-radius:9px;overflow:hidden;flex-shrink:0}
        .qty-ctrl button{width:44px;height:48px;display:grid;place-items:center;color:var(--ink-2);font-size:20px;background:none;border:none;cursor:pointer}
        .qty-ctrl button:hover{background:var(--surf-2);color:var(--ink)}
        .qty-ctrl input{width:48px;height:48px;text-align:center;border:none;outline:none;font-size:16px;font-weight:600;font-variant-numeric:tabular-nums}
        .btn-buy{flex:1;display:flex;align-items:center;justify-content:center;gap:9px;background:var(--accent);color:#fff;font-weight:600;font-size:16px;height:50px;border-radius:9px;border:none;cursor:pointer}
        .btn-buy:hover{background:var(--accent-deep)}
        .btn-ghost{display:flex;align-items:center;justify-content:center;gap:8px;border:1.5px solid var(--line-2);color:var(--ink);font-weight:600;font-size:14px;height:50px;padding:0 18px;border-radius:9px;flex-shrink:0;background:none;cursor:pointer}
        .btn-ghost:hover{border-color:var(--accent);color:var(--accent)}
        .stock-list{border-top:1px solid var(--line);padding:18px 24px;background:var(--surf-2)}
        .stock-list h4{font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--ink-3);margin-bottom:13px}
        .stock-row{display:flex;align-items:center;gap:12px;padding:7px 0;font-size:14px}
        .stock-row .wh{display:flex;align-items:center;gap:8px;flex:1;color:var(--ink)}
        .stock-row .wh svg{color:var(--ink-3)}
        .stock-row .qty-av{font-weight:600;color:var(--ok)}
        .stock-row .qty-av.low{color:var(--gold)}
        .stock-row .eta{color:var(--ink-3);font-size:13px;min-width:96px;text-align:right}
        .pdp-sections{margin-top:46px;border-top:1px solid var(--line)}
        .psec{padding:34px 0;border-bottom:1px solid var(--line)}
        .psec h2{font-size:20px;font-weight:700;letter-spacing:-.01em;margin-bottom:20px}
        .spec-grid{display:grid;grid-template-columns:1fr 1fr;gap:0 56px}
        .spec-row{display:flex;align-items:baseline;gap:10px;padding:11px 0;border-bottom:1px dashed var(--line)}
        .spec-row .k{color:var(--ink-2);font-size:14px;flex-shrink:0}
        .spec-row .lead{flex:1;border-bottom:1px dotted var(--line-2);transform:translateY(-3px)}
        .spec-row .v{font-weight:600;font-size:14px;text-align:right}
        .cross{display:flex;flex-wrap:wrap;gap:9px}
        .cross .chip{font-family:var(--font-jetbrains),monospace;font-size:13px;font-weight:500;background:var(--surf);border:1px solid var(--line-2);color:var(--ink);padding:8px 13px;border-radius:8px;cursor:pointer}
        .cross .chip:hover{border-color:var(--accent);color:var(--accent)}
        .fits{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
        .fit{display:flex;align-items:center;gap:12px;background:var(--surf);border:1px solid var(--line);border-radius:10px;padding:13px 16px}
        .fit .ic{width:38px;height:38px;border-radius:8px;background:var(--surf-2);display:grid;place-items:center;flex-shrink:0;color:var(--ink-2)}
        .fit .nm{font-weight:600;font-size:14px}
        .fit .yr{font-size:13px;color:var(--ink-3)}
        .analogs{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
        .acard{background:var(--surf);border:1px solid var(--line);border-radius:var(--radius-lg);padding:16px;display:flex;flex-direction:column;transition:.15s;text-decoration:none;color:inherit;cursor:pointer}
        .acard:hover{border-color:var(--line-2);box-shadow:var(--shadow-md);transform:translateY(-2px)}
        .acard .atier{align-self:flex-start;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.03em;padding:3px 8px;border-radius:5px;margin-bottom:12px}
        .atier.prem{background:color-mix(in oklab,var(--gold) 16%,#fff);color:#8a6614}
        .atier.mid{background:var(--accent-soft);color:var(--accent-deep)}
        .atier.budget{background:var(--surf-2);color:var(--ink-2)}
        .acard .curmark{font-size:11px;font-weight:600;color:var(--accent);margin-bottom:12px}
        .acard .aname{font-size:13.5px;font-weight:500;line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:37px;margin-bottom:4px}
        .acard .abrand{font-size:12px;color:var(--ink-2);margin-bottom:12px}
        .acard .afoot{margin-top:auto;display:flex;align-items:center;justify-content:space-between;gap:8px}
        .acard .aprice{font-size:17px;font-weight:800;font-variant-numeric:tabular-nums}
        .acard .abuy{width:38px;height:38px;border-radius:8px;background:var(--accent-soft);color:var(--accent);display:grid;place-items:center;flex-shrink:0;border:none;cursor:pointer}
        .acard .abuy:hover{background:var(--accent);color:#fff}
        .acard.current{border-color:var(--accent);box-shadow:0 0 0 1px var(--accent)}
        .crumbs{display:flex;align-items:center;gap:8px;color:var(--ink-3);font-size:13px;padding:22px 0 18px;flex-wrap:wrap}
        .crumbs a:hover{color:var(--accent)}
        .crumbs .sep{color:var(--line-2)}
      `}</style>

      <div className="container">
        {/* Breadcrumbs */}
        <div className="crumbs">
          <Link href="/">Главная</Link>
          <span className="sep">/</span>
          <Link href="/catalog">Каталог</Link>
          {specs['Тип'] && (
            <>
              <span className="sep">/</span>
              <Link href={`/catalog?system=${part.category}`}>{specs['Тип']}</Link>
            </>
          )}
          <span className="sep">/</span>
          <span style={{ color: 'var(--ink-2)' }}>{part.name.split(' ').slice(0, 5).join(' ')}</span>
        </div>

        {/* PDP grid: 440px + 1fr */}
        <div className="pdp">

          {/* ── Gallery ── */}
          <div className="gallery">
            <div className="gal-main" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surf-2)' }}>
              {imgUrl ? (
                <Image
                  src={imgUrl}
                  alt={part.name}
                  fill
                  sizes="440px"
                  style={{ objectFit: 'contain', padding: '12px' }}
                  priority
                  unoptimized
                />
              ) : (
                <GlyphSvg size={120} />
              )}
              <span className="brandchip" style={{ position: 'relative', zIndex: 1 }}>{part.brand}</span>
            </div>
            <div className="gal-thumbs">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className={`th${activeThumb === i ? ' on' : ''}`}
                  onClick={() => setActiveThumb(i)}
                  style={{ overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surf-2)' }}
                >
                  {imgUrl ? (
                    <Image
                      src={imgUrl}
                      alt={part.name}
                      fill
                      sizes="74px"
                      style={{ objectFit: 'contain', padding: '4px', opacity: i === 0 ? 1 : 0.6 }}
                      unoptimized
                    />
                  ) : <GlyphSvg size={40} />}
                </div>
              ))}
            </div>
          </div>

          {/* ── Info column ── */}
          <div className="pdp-info">
            {/* Badges */}
            <div className="pdp-badges">
              <span className={`badge ${isOEM ? 'oem' : ''}`} style={!isOEM ? { background: 'var(--surf-2)', color: 'var(--ink-2)' } : {}}>
                {isOEM ? 'OEM · ОРИГИНАЛ' : 'Аналог'}
              </span>
              {totalQty > 0 ? (
                <span className="badge stock">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  В наличии · {stockEntries.length} скл.
                </span>
              ) : (
                <span className="badge" style={{ background: 'var(--surf-2)', color: 'var(--ink-2)' }}>Под заказ</span>
              )}
            </div>

            <h1 className="pdp-title">{part.name}</h1>

            <div className="pdp-sub">
              <span className="art">{part.oem}</span>
              <span className="dot" />
              <span>{part.brand}</span>
            </div>

            {/* Buybox */}
            <div className="buybox">
              <div className="buybox-top">
                <div className="price-main">
                  <div className="price-now">{fmtKZT(price)}</div>
                  <div className="price-meta">
                    с НДС · за шт
                    {!b2b && priceB2b < part.price && (
                      <> · <b>опт от 10 шт — {fmtKZT(priceB2b)}</b></>
                    )}
                  </div>
                </div>
                <div className="persontype">
                  <button className={!b2b ? 'on' : ''} onClick={() => setB2b(false)}>Физ. лицо</button>
                  <button className={b2b ? 'on' : ''} onClick={() => setB2b(true)}>Юр. лицо</button>
                </div>
              </div>

              <div className="buybox-actions">
                <div className="qty-ctrl">
                  <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                  <input
                    type="number"
                    value={qty}
                    onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                  <button onClick={() => setQty(qty + 1)}>+</button>
                </div>
                <button className="btn-buy" onClick={() => addItem({ ...part, stock }, qty)}>
                  <CartIcon />
                  {inCart ? 'Добавить ещё' : 'В корзину'}
                </button>
                <button
                  className="btn-ghost"
                  style={inWish ? { color: '#e53e3e', borderColor: '#e53e3e' } : {}}
                  onClick={() => wlToggle({ ...part, stock })}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={inWish ? '#e53e3e' : 'none'} stroke={inWish ? '#e53e3e' : 'currentColor'} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  {inWish ? 'В избранном' : 'В избранное'}
                </button>
              </div>

              {stockEntries.length > 0 && (
                <div className="stock-list">
                  <h4>Наличие по складам</h4>
                  {stockEntries.map(([city, q]) => (
                    <div key={city} className="stock-row">
                      <span className="wh">
                        <HouseIcon />
                        {city === 'Алматы' ? 'Алматы · центральный' : city}
                      </span>
                      <span className={`qty-av${(q as number) < 10 ? ' low' : ''}`}>
                        {q} шт
                      </span>
                      <span className="eta">{deliveryDays(city)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Sections ── */}
        <div className="pdp-sections">

          {/* Характеристики */}
          <div className="psec">
            <h2>Характеристики</h2>
            <div className="spec-grid">
              {specEntries.map(([k, v]) => (
                <div key={k} className="spec-row">
                  <span className="k">{k}</span>
                  <span className="lead" />
                  <span className="v">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Кросс-номера */}
          {crossNums.length > 0 && (
            <div className="psec">
              <h2>Кросс-номера</h2>
              <div className="cross">
                {crossNums.map((c: string) => (
                  <button
                    key={c}
                    className="chip"
                    onClick={() => router.push(`/catalog?q=${encodeURIComponent(c)}`)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Применяемость */}
          {part.fits?.length > 0 && (
            <div className="psec">
              <h2>Применяемость</h2>
              <div className="fits">
                {(part.fits as string[]).map((f: string) => (
                  <Link key={f} href={`/catalog?q=${encodeURIComponent(f)}`} className="fit">
                    <div className="ic"><TruckIcon /></div>
                    <div>
                      <div className="nm">{f}</div>
                      <div className="yr" style={{ fontSize: 13, color: 'var(--ink-3)' }}>Смотреть запчасти →</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Аналоги */}
          <div className="psec">
            <h2>Аналоги</h2>
            <div className="analogs">
              {/* Current item */}
              <div className="acard current">
                <span className="curmark">● Текущий товар</span>
                <div className="aname">{part.name.split(' ').slice(0, 5).join(' ')}</div>
                <div className="abrand">{part.brand}</div>
                <div className="afoot">
                  <span className="aprice">{fmtKZT(b2b ? priceB2b : part.price)}</span>
                  <button
                    className="abuy"
                    onClick={() => addItem({ ...part, stock }, 1)}
                  >
                    <CartIcon />
                  </button>
                </div>
              </div>

              {/* Analogs from DB */}
              {analogs.map((a) => {
                const aSpecs = parseSpecs(a.name, a.brand)
                const aPrice = b2b ? (a.price_b2b || Math.round(a.price * 0.82)) : a.price
                const aSeg   = aSpecs['Сегмент'] || 'Бюджет'
                return (
                  <div
                    key={a.id}
                    className="acard"
                    onClick={() => router.push(`/catalog/${a.id}`)}
                  >
                    <span className={`atier ${tierClass(aSeg)}`}>{tierLabel(aSeg)}</span>
                    <div className="aname">{a.name.split(' ').slice(0, 5).join(' ')}</div>
                    <div className="abrand">{a.brand}</div>
                    <div className="afoot">
                      <span className="aprice">{fmtKZT(aPrice)}</span>
                      <button
                        className="abuy"
                        onClick={e => { e.stopPropagation(); addItem({ ...a, stock: a.stock }, 1) }}
                      >
                        <CartIcon />
                      </button>
                    </div>
                  </div>
                )
              })}

              {/* Placeholder if no analogs */}
              {analogs.length === 0 && (
                <div className="acard" style={{ opacity: 0.4, pointerEvents: 'none' }}>
                  <span className="atier budget">ПОИСК...</span>
                  <div className="aname">Ищем аналоги в базе</div>
                  <div className="abrand">–</div>
                  <div className="afoot">
                    <span className="aprice">–</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
