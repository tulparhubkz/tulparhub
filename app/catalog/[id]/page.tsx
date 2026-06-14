'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Ico } from '@/components/ui/Ico'
import { Btn } from '@/components/ui/Btn'
import { useCart } from '@/store/cart'
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

function stockColor(qty: number): string {
  if (qty >= 10) return '#1e7e34'
  if (qty >= 3) return '#e65100'
  return '#c62828'
}

function segmentLabel(seg: string): string {
  if (seg === 'Премиум') return 'ПРЕМИУМ'
  if (seg === 'Средний') return 'СРЕДНИЙ'
  return 'БЮДЖЕТ'
}

function segmentColor(seg: string): string {
  if (seg === 'Премиум') return '#1a56db'
  if (seg === 'Средний') return '#0e7490'
  return '#6b7280'
}

export default function PDPPage() {
  const { id } = useParams<{ id: string }>()
  const router  = useRouter()
  const [part, setPart]       = useState<any>(null)
  const [analogs, setAnalogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [qty, setQty]         = useState(1)
  const [b2b, setB2b]         = useState(false)
  const { items, addItem }    = useCart()

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

        // Загрузить аналоги: ищем по первому слову названия + та же категория
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
    <main className="pdp">
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--ink-3)' }}>
        Загрузка...
      </div>
    </main>
  )
  if (!part || part.error) return (
    <main className="pdp">
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2>Товар не найден</h2>
        <Link href="/catalog">← Вернуться в каталог</Link>
      </div>
    </main>
  )

  const price     = b2b ? (part.price_b2b || part.price) : part.price
  const priceB2b  = part.price_b2b || Math.round(part.price * 0.82)
  const stock     = part.stock as Record<string, number> ?? {}
  const totalQty  = Object.values(stock).reduce((a: number, b: number) => a + b, 0)
  const inCart    = items.some(i => i.id === part.id)
  const cartQty   = items.find(i => i.id === part.id)?.qty ?? 0
  const specs     = parseSpecs(part.name, part.brand)
  const isOEM     = (part.type || '').toUpperCase() === 'OEM'

  const stockEntries = Object.entries(stock)
    .filter(([, q]) => (q as number) > 0)
    .sort(([a], [b]) => (a === 'Алматы' ? -1 : b === 'Алматы' ? 1 : 0))

  const specPairs = Object.entries(specs)
  const halfLen   = Math.ceil(specPairs.length / 2)

  return (
    <main className="pdp">
      <div className="container">
        {/* Breadcrumbs */}
        <div className="crumbs" style={{ marginBottom: 20 }}>
          <Link href="/">Главная</Link> /&nbsp;
          <Link href="/catalog">Каталог</Link>
          {specs['Тип'] && <> /&nbsp;<Link href={`/catalog?system=${part.category}`}>{specs['Тип']}</Link></>}
          &nbsp;/&nbsp;{part.name.split(' ').slice(0, 5).join(' ')}
        </div>

        {/* Top: gallery + info + side */}
        <div className="pdp-top">

          {/* Gallery */}
          <div className="pdp-gallery">
            <div className="pdp2-main-img">
              <div className="pdp2-brand-chip">{part.brand}</div>
              <div className="pdp2-img-center">
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                  <circle cx="60" cy="60" r="50" stroke="#d0d5dd" strokeWidth="3"/>
                  <circle cx="60" cy="60" r="25" stroke="#d0d5dd" strokeWidth="3"/>
                  <line x1="10" y1="60" x2="110" y2="60" stroke="#d0d5dd" strokeWidth="3"/>
                  <line x1="60" y1="10" x2="60" y2="110" stroke="#d0d5dd" strokeWidth="3"/>
                </svg>
              </div>
            </div>
            <div className="pdp-thumbs">
              {[0,1,2].map(i => (
                <div key={i} className={`pdp2-thumb ${i===0?'on':''}`}>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <circle cx="14" cy="14" r="10" stroke="#d0d5dd" strokeWidth="2"/>
                    {i===1 && <circle cx="14" cy="14" r="5" stroke="#d0d5dd" strokeWidth="2"/>}
                    {i===2 && <rect x="7" y="7" width="14" height="14" stroke="#d0d5dd" strokeWidth="2"/>}
                  </svg>
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="pdp-info">
            {/* Badges */}
            <div className="pdp2-top-badges">
              <span className={`pc2-badge ${isOEM ? 'oem' : 'aft'}`} style={{ fontSize: 13, padding: '5px 14px' }}>
                {isOEM ? 'OEM · ОРИГИНАЛ' : 'Аналог'}
              </span>
              {totalQty > 0
                ? <span className="pc2-badge stock-ok" style={{ fontSize: 13, padding: '5px 14px' }}>
                    ✓ В наличии на {stockEntries.length} складах
                  </span>
                : <span className="pc2-badge stock-no" style={{ fontSize: 13, padding: '5px 14px' }}>Под заказ</span>
              }
            </div>

            <h1 className="pdp-name" style={{ marginTop: 14, marginBottom: 0 }}>{part.name}</h1>

            <div className="pdp2-meta">
              <span>Артикул:&nbsp;<b>{part.oem}</b></span>
              <span className="pdp2-dot">·</span>
              <span>Бренд:&nbsp;<b>{part.brand}</b></span>
              <span className="pdp2-dot">·</span>
              <span style={{ color: '#f5a623', letterSpacing: 1 }}>★★★★★</span>
              <span>4.9 · {Math.floor(Math.abs(parseInt(part.id?.replace(/\D/g,'').slice(-4)||'0')) % 300 + 50)} отзывов</span>
            </div>

            {/* Price block */}
            <div className="pdp2-price-block">
              <div>
                <div className="pdp2-price">{fmtKZT(price)}</div>
                <div className="pdp2-price-sub">
                  с НДС · за шт
                  {!b2b && priceB2b < part.price && (
                    <> · <b style={{ color: 'var(--accent)' }}>опт от 10 шт — {fmtKZT(priceB2b)}</b></>
                  )}
                </div>
              </div>
              <div className="cart-mode-switch" style={{ flexShrink: 0 }}>
                <button className={!b2b ? 'on' : ''} onClick={() => setB2b(false)}>Физ. лицо</button>
                <button className={b2b ? 'on' : ''} onClick={() => setB2b(true)}>Юр. лицо</button>
              </div>
            </div>

            {/* Buy */}
            <div className="pdp2-buy">
              <div className="pdp-qty">
                <button onClick={() => setQty(Math.max(1, qty-1))}>−</button>
                <input value={qty} onChange={e => setQty(Math.max(1, parseInt(e.target.value)||1))} />
                <button onClick={() => setQty(qty+1)}>+</button>
              </div>
              <button className="pdp2-cart-btn" onClick={() => addItem({ ...part, stock }, qty)}>
                <Ico name="cart" size={16} />
                {inCart ? `В корзине (${cartQty})` : 'В корзину'}
              </button>
              <button className="pdp2-req-btn">
                <Ico name="list" size={16} />
                В запрос
              </button>
            </div>

            {/* Stock table */}
            {stockEntries.length > 0 && (
              <div className="pdp2-stock">
                <div className="pdp2-stock-title">Наличие по складам</div>
                {stockEntries.map(([city, q]) => (
                  <div key={city} className="pdp2-stock-row">
                    <Ico name="pin" size={14} />
                    <span className="pdp2-stock-city">{city === 'Алматы' ? 'Алматы · центральный' : city}</span>
                    <b style={{ color: stockColor(q as number), minWidth: 60, textAlign: 'right' }}>{q} шт</b>
                    <span className="pdp2-stock-eta">{deliveryDays(city)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Side */}
          <aside className="pdp-side">
            <div className="pdp-side-card">
              <h4>Запросить счёт</h4>
              <p style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 12 }}>
                Сформируем счёт за 5 минут. Закрывающие документы в 1С.
              </p>
              <Btn variant="dark" full icon="pdf">Сформировать счёт</Btn>
            </div>
            <div className="pdp-side-card">
              <h4>Связаться</h4>
              <div className="pdp-side-contact">
                <button><Ico name="phone" size={14}/> +7 (727) 350-22-22</button>
                <button><Ico name="chat" size={14}/> WhatsApp · Telegram</button>
              </div>
              <p style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 8 }}>Ответ в течение 12 минут</p>
            </div>
          </aside>
        </div>

        {/* ── Characteristics ──────────────────────────────── */}
        <section className="pdp2-section">
          <h2 className="pdp2-section-title">Характеристики</h2>
          <div className="pdp2-specs-grid2">
            <div className="pdp2-specs-col">
              {specPairs.slice(0, halfLen).map(([k, v]) => (
                <div key={k} className="pdp2-spec-row">
                  <span className="pdp2-spec-key">{k}</span>
                  <span className="pdp2-spec-val">{v}</span>
                </div>
              ))}
            </div>
            <div className="pdp2-specs-col">
              {specPairs.slice(halfLen).map(([k, v]) => (
                <div key={k} className="pdp2-spec-row">
                  <span className="pdp2-spec-key">{k}</span>
                  <span className="pdp2-spec-val">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Cross numbers ─────────────────────────────────── */}
        {(part.cross?.length > 0 || part.oem) && (
          <section className="pdp2-section">
            <h2 className="pdp2-section-title">Кросс-номера и аналоги по артикулу</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 16 }}>
              {/* Show OEM as first chip */}
              {part.oem && (
                <button className="cross-chip" onClick={() => router.push(`/catalog?q=${encodeURIComponent(part.oem)}`)}>
                  {part.oem}
                </button>
              )}
              {(part.cross as string[] || []).filter((c: string) => c !== part.oem).map((c: string) => (
                <button key={c} className="cross-chip" onClick={() => router.push(`/catalog?q=${encodeURIComponent(c)}`)}>
                  {c}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ── Compatibility ─────────────────────────────────── */}
        {part.fits?.length > 0 && (
          <section className="pdp2-section">
            <h2 className="pdp2-section-title">Применяемость</h2>
            <div className="pdp2-compat-grid">
              {(part.fits as string[]).map((f: string) => (
                <Link key={f} href={`/catalog?q=${encodeURIComponent(f)}`} className="pdp2-compat-card">
                  <div className="pdp2-compat-icon"><Ico name="truck" size={18} /></div>
                  <div>
                    <div className="pdp2-compat-name">{f}</div>
                    <div className="pdp2-compat-sub">Смотреть все запчасти →</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Analogs ───────────────────────────────────────── */}
        <section className="pdp2-section pdp2-analogs">
          <h2 className="pdp2-section-title">Аналоги — подбор по бюджету</h2>
          <div className="pdp2-analogs-grid">
            {/* Current item */}
            <div className="pdp2-analog-card current">
              <div className="pdp2-analog-tag" style={{ color: 'var(--accent)' }}>● Текущий товар</div>
              <div className="pdp2-analog-name">{part.name.split(' ').slice(0, 5).join(' ')}, {part.brand}</div>
              <div className="pdp2-analog-sub">{part.brand} · {specs['Сегмент'] || 'Оригинал'}</div>
              <div className="pdp2-analog-price">{fmtKZT(b2b ? priceB2b : part.price)}</div>
              <button className="pdp2-analog-cart" onClick={() => addItem({ ...part, stock }, 1)}>
                <Ico name="cart" size={14} />
              </button>
            </div>

            {/* Analogs from DB */}
            {analogs.map((a) => {
              const aSpecs  = parseSpecs(a.name, a.brand)
              const aPrice  = b2b ? (a.price_b2b || Math.round(a.price * 0.82)) : a.price
              const aStk    = Object.values(a.stock || {}).reduce((s: number, q: any) => s + q, 0)
              return (
                <div key={a.id} className="pdp2-analog-card" onClick={() => router.push(`/catalog/${a.id}`)} style={{ cursor: 'pointer' }}>
                  <div className="pdp2-analog-tag" style={{ color: segmentColor(aSpecs['Сегмент'] || '') }}>
                    {segmentLabel(aSpecs['Сегмент'] || 'Бюджет')}
                  </div>
                  <div className="pdp2-analog-name">{a.name.split(' ').slice(0, 5).join(' ')}, {a.brand}</div>
                  <div className="pdp2-analog-sub">{a.brand} · аналог{aStk > 0 ? '' : ' · под заказ'}</div>
                  <div className="pdp2-analog-price">{fmtKZT(aPrice)}</div>
                  <button className="pdp2-analog-cart" onClick={e => { e.stopPropagation(); addItem({ ...a, stock: a.stock }, 1) }}>
                    <Ico name="cart" size={14} />
                  </button>
                </div>
              )
            })}

            {/* Placeholders if < 3 analogs */}
            {analogs.length === 0 && (
              <div className="pdp2-analog-card" style={{ opacity: 0.4, pointerEvents: 'none' }}>
                <div className="pdp2-analog-tag">ЗАГРУЗКА...</div>
                <div className="pdp2-analog-name">Поиск аналогов</div>
                <div className="pdp2-analog-sub">–</div>
                <div className="pdp2-analog-price">–</div>
              </div>
            )}
          </div>
        </section>

      </div>
    </main>
  )
}
