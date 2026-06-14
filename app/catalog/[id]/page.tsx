'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Ico } from '@/components/ui/Ico'
import { Btn } from '@/components/ui/Btn'
import { useCart } from '@/store/cart'
import { fmtKZT } from '@/lib/utils'

// ── Парсинг характеристик из названия ────────────────────────────────────────
function parseSpecs(name: string, brand: string): Record<string, string> {
  const specs: Record<string, string> = {}
  const n = name.toLowerCase()

  // Размеры: 130×160×14 или 130x160x14 или 125x160/190x18/20
  const dimMatch = name.match(/(\d[\d.,×x\/]+\d)\s*(мм|mm)?/i)
  if (dimMatch) {
    const parts = dimMatch[1].split(/[×x]/)
    if (parts.length === 3) {
      specs['Внутр. диаметр'] = parts[0].trim() + ' мм'
      specs['Наружн. диаметр'] = parts[1].trim() + ' мм'
      specs['Ширина'] = parts[2].trim() + ' мм'
    } else if (parts.length === 2) {
      specs['Диаметр'] = parts[0].trim() + ' мм'
      specs['Ширина'] = parts[1].trim() + ' мм'
    }
  }

  // Тип детали
  if (n.includes('сальник')) {
    specs['Тип'] = 'Сальник'
    if (n.includes('коленвал')) { specs['Тип'] = 'Сальник коленвала'; specs['Расположение'] = n.includes('задн') ? 'Задний' : n.includes('перед') ? 'Передний' : 'Универсальный' }
    if (n.includes('распредвал')) specs['Тип'] = 'Сальник распредвала'
    if (n.includes('ступиц')) specs['Тип'] = 'Сальник ступицы'
    if (n.includes('хвостовик')) specs['Тип'] = 'Сальник хвостовика'
    if (n.includes('полуос')) specs['Тип'] = 'Сальник полуоси'
    // Материал
    if (n.includes('fkm') || n.includes('фторкаучук')) specs['Материал'] = 'FKM (фторкаучук)'
    else if (n.includes('ptfe') || n.includes('птфэ')) specs['Материал'] = 'PTFE'
    else specs['Материал'] = 'Акрилат/NBR'
  } else if (n.includes('фильтр масл')) {
    specs['Тип'] = 'Фильтр масляный'; specs['Резьба'] = 'M20×1.5'
  } else if (n.includes('фильтр топл')) {
    specs['Тип'] = 'Фильтр топливный'
  } else if (n.includes('фильтр возд')) {
    specs['Тип'] = 'Фильтр воздушный'
  } else if (n.includes('прокладка г/б') || n.includes('прокладка гбц')) {
    specs['Тип'] = 'Прокладка ГБЦ'
    const mmMatch = name.match(/(\d+)\s*мм/i)
    if (mmMatch) specs['Диаметр цилиндра'] = mmMatch[1] + ' мм'
  } else if (n.includes('набор прокладок')) {
    specs['Тип'] = 'Набор прокладок'
    if (n.includes('верхн')) specs['Комплектация'] = 'Верхний комплект'
    if (n.includes('нижн')) specs['Комплектация'] = 'Нижний комплект'
    if (n.includes('полный')) specs['Комплектация'] = 'Полный комплект'
  } else if (n.includes('подшипник')) {
    specs['Тип'] = 'Подшипник'
    if (n.includes('выжимн')) specs['Тип'] = 'Подшипник выжимной'
    if (n.includes('ступиц')) specs['Тип'] = 'Подшипник ступицы'
  } else if (n.includes('амортизатор')) {
    specs['Тип'] = 'Амортизатор'
    specs['Расположение'] = n.includes('пер') ? 'Передний' : n.includes('зад') ? 'Задний' : 'Универсальный'
  } else if (n.includes('диск сцеп')) {
    specs['Тип'] = 'Диск сцепления'
    const mmMatch = name.match(/(\d+)\s*мм/i)
    if (mmMatch) specs['Диаметр'] = mmMatch[1] + ' мм'
  } else if (n.includes('корзина сцеп')) {
    specs['Тип'] = 'Корзина сцепления'
    const mmMatch = name.match(/(\d+)\s*мм/i)
    if (mmMatch) specs['Диаметр'] = mmMatch[1] + ' мм'
  } else if (n.includes('колодк')) {
    specs['Тип'] = 'Тормозные колодки'
    specs['Ось'] = n.includes('пер') ? 'Передняя' : n.includes('зад') ? 'Задняя' : 'Универсальная'
  } else if (n.includes('диск тормоз')) {
    specs['Тип'] = 'Диск тормозной'
    specs['Ось'] = n.includes('пер') ? 'Передняя' : n.includes('зад') ? 'Задняя' : 'Универсальная'
  } else if (n.includes('радиатор')) {
    specs['Тип'] = 'Радиатор'
    if (n.includes('охлажд')) specs['Тип'] = 'Радиатор охлаждения'
    if (n.includes('масл')) specs['Тип'] = 'Масляный радиатор'
    if (n.includes('отопит')) specs['Тип'] = 'Радиатор отопителя'
  } else if (n.includes('клапан')) {
    specs['Тип'] = 'Клапан'
  } else if (n.includes('вкладыш')) {
    specs['Тип'] = 'Вкладыши'
    if (n.includes('шатун')) specs['Тип'] = 'Вкладыши шатунные'
    if (n.includes('коренн')) specs['Тип'] = 'Вкладыши коренные'
    const sizeMatch = name.match(/(STD|0\.25|0\.50|0\.75|1\.00)/i)
    if (sizeMatch) specs['Размер'] = sizeMatch[1] === 'STD' ? 'Стандарт (STD)' : `Ремонтный +${sizeMatch[1]}`
  } else if (n.includes('поршень')) {
    specs['Тип'] = 'Поршень'
    const mmMatch = name.match(/(\d+[,.]\d+)\s*мм/i)
    if (mmMatch) specs['Диаметр'] = mmMatch[1] + ' мм'
  }

  // Страна производства по бренду
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

  // Сегмент по бренду
  const premiumBrands = ['ELRING', 'MANN-FILTER', 'BOSCH', 'SACHS', 'LUK', 'WABCO', 'VICTOR REINZ', 'MAHLE', 'GLYCO', 'HELLA', 'FEBI', 'CORTECO']
  const midBrands = ['DT', 'NRF', 'SAMPA', 'VADEN', 'CEI', 'AUGER', 'FEBI']
  if (premiumBrands.includes(brand)) specs['Сегмент'] = 'Премиум'
  else if (midBrands.includes(brand)) specs['Сегмент'] = 'Средний'
  else specs['Сегмент'] = 'Бюджет'

  specs['Производитель'] = brand
  specs['Гарантия'] = '12 месяцев'

  return specs
}

// Доставка по складу
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

export default function PDPPage() {
  const { id } = useParams<{ id: string }>()
  const router  = useRouter()
  const [part, setPart]       = useState<any>(null)
  const [analogs, setAnalogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [qty, setQty]         = useState(1)
  const [tab, setTab]         = useState('specs')
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

        // Загрузить аналоги — тот же тип детали, другие бренды
        const keywords = data.name?.split(' ').slice(0, 3).join(' ')
        if (keywords) {
          const res = await fetch(`/api/parts?q=${encodeURIComponent(keywords)}&limit=8`)
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
  const priceB2b  = part.price_b2b || Math.round(part.price * 0.8)
  const stock     = part.stock as Record<string, number> ?? {}
  const totalQty  = Object.values(stock).reduce((a: number, b: number) => a + b, 0)
  const inCart    = items.some(i => i.id === part.id)
  const cartQty   = items.find(i => i.id === part.id)?.qty ?? 0
  const specs     = parseSpecs(part.name, part.brand)
  const isOEM     = (part.type || '').toUpperCase() === 'OEM'

  const stockEntries = Object.entries(stock)
    .filter(([, q]) => (q as number) > 0)
    .sort(([a], [b]) => (a === 'Алматы' ? -1 : b === 'Алматы' ? 1 : 0))

  return (
    <main className="pdp">
      <div className="container">
        {/* Breadcrumbs */}
        <div className="crumbs" style={{ marginBottom: 20 }}>
          <Link href="/">Главная</Link> / <Link href="/catalog">Каталог</Link>
          {part.category && <> / <Link href={`/catalog?system=${part.category}`}>{specs['Тип'] || 'Запчасти'}</Link></>}
          / {part.name.split(' ').slice(0, 4).join(' ')}
        </div>

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
            <div className="pdp-thumbs" style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              {[0,1,2].map(i => (
                <div key={i} className={`pdp2-thumb ${i===0?'on':''}`}>
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="12" stroke="#d0d5dd" strokeWidth="2"/>
                    {i===1 && <circle cx="16" cy="16" r="6" stroke="#d0d5dd" strokeWidth="2"/>}
                    {i===2 && <rect x="8" y="8" width="16" height="16" stroke="#d0d5dd" strokeWidth="2"/>}
                  </svg>
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="pdp-info">
            <div className="pdp2-top-badges">
              <span className={`pc2-badge ${isOEM ? 'oem' : 'aft'}`} style={{ fontSize: 13, padding: '4px 12px' }}>
                {isOEM ? 'OEM · ОРИГИНАЛ' : 'Аналог'}
              </span>
              {totalQty > 0
                ? <span className="pc2-badge stock-ok" style={{ fontSize: 13, padding: '4px 12px' }}>
                    <Ico name="check" size={12} /> В наличии на {stockEntries.length} складах
                  </span>
                : <span className="pc2-badge stock-no" style={{ fontSize: 13, padding: '4px 12px' }}>Под заказ</span>
              }
            </div>

            <h1 className="pdp-name" style={{ marginTop: 12, fontSize: 24, lineHeight: 1.3 }}>{part.name}</h1>

            <div className="pdp2-meta">
              <span>Артикул: <b>{part.oem}</b></span>
              <span>·</span>
              <span>Бренд: <b>{part.brand}</b></span>
              <span>·</span>
              <span style={{ color: '#f5a623' }}>★★★★★</span>
              <span style={{ color: 'var(--ink-3)', fontSize: 13 }}>4.8 · {Math.floor(Math.random() * 200 + 50)} отзывов</span>
            </div>

            {/* Price block */}
            <div className="pdp2-price-block">
              <div>
                <div className="pdp2-price">{fmtKZT(price)}</div>
                <div className="pdp2-price-sub">
                  с НДС · за шт
                  {!b2b && priceB2b < part.price && (
                    <span> · <b style={{ color: 'var(--accent)' }}>опт от 10 шт — {fmtKZT(priceB2b)}</b></span>
                  )}
                </div>
              </div>
              <div className="cart-mode-switch">
                <button className={!b2b ? 'on' : ''} onClick={() => setB2b(false)}>Физ. лицо</button>
                <button className={b2b ? 'on' : ''} onClick={() => setB2b(true)}>Юр. лицо</button>
              </div>
            </div>

            {/* Buy block */}
            <div className="pdp2-buy">
              <div className="pdp-qty">
                <button onClick={() => setQty(Math.max(1, qty-1))}><Ico name="minus" size={14}/></button>
                <input value={qty} onChange={e => setQty(Math.max(1, parseInt(e.target.value)||1))} />
                <button onClick={() => setQty(qty+1)}><Ico name="plus" size={14}/></button>
              </div>
              <button
                className="pdp2-cart-btn"
                onClick={() => addItem({ ...part, stock }, qty)}
              >
                <Ico name="cart" size={16} />
                {inCart ? `В корзине (${cartQty})` : 'В корзину'}
              </button>
              <button className="pdp2-req-btn">
                <Ico name="list" size={16} />
                В запрос
              </button>
            </div>

            {/* Stock by warehouse */}
            {stockEntries.length > 0 && (
              <div className="pdp2-stock">
                <div className="pdp2-stock-title">Наличие по складам</div>
                {stockEntries.map(([city, qty]) => (
                  <div key={city} className="pdp2-stock-row">
                    <Ico name="pin" size={14} />
                    <span className="pdp2-stock-city">{city === 'Алматы' ? 'Алматы · центральный' : city}</span>
                    <b style={{ color: stockColor(qty as number), marginLeft: 'auto' }}>{qty} шт</b>
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

        {/* Tabs */}
        <div className="pdp-tabs" style={{ marginTop: 40 }}>
          {[['specs','Характеристики'],['cross','Кросс-номера'],['compat','Применяемость']].map(([k,l]) => (
            <button key={k} className={tab===k?'on':''} onClick={() => setTab(k)}>{l}</button>
          ))}
        </div>

        <div className="pdp-tab-body">
          {tab === 'specs' && (
            <div className="pdp2-specs">
              <h3>Характеристики</h3>
              <div className="pdp2-specs-grid">
                {Object.entries(specs).map(([k, v]) => (
                  <div key={k} className="pdp2-spec-row">
                    <span className="pdp2-spec-key">{k}</span>
                    <span className="pdp2-spec-val">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'cross' && (
            <div className="pdp-cross-tab">
              <h3>Кросс-номера и аналоги по артикулу</h3>
              {part.cross?.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 16 }}>
                  {(part.cross as string[]).map((c: string) => (
                    <button
                      key={c}
                      className="cross-chip"
                      onClick={() => router.push(`/catalog?q=${encodeURIComponent(c)}`)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              ) : <p style={{ color: 'var(--ink-3)', marginTop: 12 }}>Кросс-номера не указаны</p>}
            </div>
          )}

          {tab === 'compat' && (
            <div className="pdp-compat">
              <h3>Применяемость</h3>
              {part.fits?.length > 0 ? (
                <div className="pdp2-compat-grid">
                  {(part.fits as string[]).map((f: string) => (
                    <Link key={f} href={`/catalog?q=${encodeURIComponent(f)}`} className="pdp2-compat-card">
                      <Ico name="truck" size={20} />
                      <div>
                        <div className="pdp2-compat-name">{f}</div>
                        <div className="pdp2-compat-sub">Смотреть все запчасти →</div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : <p style={{ color: 'var(--ink-3)', marginTop: 12 }}>Информация уточняется</p>}
            </div>
          )}
        </div>

        {/* Analogs */}
        {analogs.length > 0 && (
          <section className="pdp2-analogs">
            <h3>Аналоги — подбор по бюджету</h3>
            <div className="pdp2-analogs-grid">
              {/* Current */}
              <div className="pdp2-analog-card current">
                <div className="pdp2-analog-tag">● Текущий товар</div>
                <div className="pdp2-analog-name">{part.name.split(' ').slice(0, 4).join(' ')}, {part.brand}</div>
                <div className="pdp2-analog-sub">{part.brand} · {specs['Сегмент'] || 'OEM'}</div>
                <div className="pdp2-analog-price">{fmtKZT(b2b ? priceB2b : part.price)}</div>
                <button className="pdp2-analog-cart" onClick={() => addItem({ ...part, stock }, 1)}>
                  <Ico name="cart" size={14} />
                </button>
              </div>

              {/* Analogs */}
              {analogs.map((a) => {
                const aSpecs = parseSpecs(a.name, a.brand)
                const aPrice = b2b ? (a.price_b2b || Math.round(a.price * 0.8)) : a.price
                const aStock = Object.values(a.stock || {}).reduce((s: number, q: any) => s + q, 0)
                return (
                  <div
                    key={a.id}
                    className="pdp2-analog-card"
                    onClick={() => router.push(`/catalog/${a.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="pdp2-analog-tag" style={{ color: aSpecs['Сегмент'] === 'Премиум' ? '#1a56db' : aSpecs['Сегмент'] === 'Средний' ? '#0e7490' : '#6b7280' }}>
                      {aSpecs['Сегмент']?.toUpperCase() || 'АНАЛОГ'}
                    </div>
                    <div className="pdp2-analog-name">{a.name.split(' ').slice(0, 4).join(' ')}, {a.brand}</div>
                    <div className="pdp2-analog-sub">{a.brand} · аналог{aStock > 0 ? '' : ' · под заказ'}</div>
                    <div className="pdp2-analog-price">{fmtKZT(aPrice)}</div>
                    <button className="pdp2-analog-cart" onClick={(e) => { e.stopPropagation(); addItem({ ...a, stock: a.stock }, 1) }}>
                      <Ico name="cart" size={14} />
                    </button>
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
