'use client'
import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Ico } from '@/components/ui/Ico'
import { systems, brands, models } from '@/lib/data'
import { fmtKZT } from '@/lib/utils'
import { useCart } from '@/store/cart'
import { useWishlist } from '@/store/wishlist'

// Client-side image URL cache to avoid repeated API calls
const imgCache = new Map<string, string | null>()

function usePartImage(oem: string, name: string) {
  const key = oem || name
  const [url, setUrl] = useState<string | null>(imgCache.has(key) ? imgCache.get(key)! : null)

  useEffect(() => {
    if (imgCache.has(key)) {
      setUrl(imgCache.get(key) ?? null)
      return
    }
    const params = new URLSearchParams()
    if (oem) params.set('oem', oem)
    if (name) params.set('name', name)
    fetch(`/api/part-image?${params}`)
      .then(r => r.json())
      .then(d => {
        imgCache.set(key, d.url ?? null)
        setUrl(d.url ?? null)
      })
      .catch(() => {
        imgCache.set(key, null)
      })
  }, [key, oem, name])

  return url
}

function PartCard({ part, b2b }: { part: any; b2b: boolean }) {
  const router = useRouter()
  const { items, addItem } = useCart()
  const toggle = useWishlist(s => s.toggle)
  const inWish = useWishlist(s => s.items.some(i => i.id === part.id))
  const inCart = items.some((i) => i.id === part.id)
  const price = b2b ? (part.price_b2b || part.price) : part.price
  const stockMap: Record<string, number> = part.stock ?? {}
  const totalQty = Object.values(stockMap).reduce((a: number, b: number) => a + b, 0)
  const isOEM = (part.type || '').toUpperCase() === 'OEM'
  const imgUrl = usePartImage(part.oem ?? '', part.name ?? '')

  return (
    <div className="card" onClick={() => router.push(`/catalog/${part.id}`)} style={{ cursor: 'pointer' }}>
      <div className="card-img">
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={part.name}
            fill
            sizes="(max-width: 600px) 100vw, 25vw"
            style={{ objectFit: 'contain', padding: '8px' }}
            unoptimized
          />
        ) : (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, var(--surf-2) 0%, #e8edf5 100%)',
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="1.2">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
        )}
        <span className="brandchip" style={{ fontFamily: 'var(--font-jetbrains), monospace' }}>{part.brand}</span>
        <button className="fav" onClick={(e) => { e.stopPropagation(); toggle({ ...part, stock: stockMap }) }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill={inWish ? '#e53e3e' : 'none'} stroke={inWish ? '#e53e3e' : 'currentColor'} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
      </div>
      <div className="card-body">
        <div className="card-badges">
          <span className={`badge ${isOEM ? 'oem' : 'analog'}`}>{isOEM ? 'OEM' : 'Аналог'}</span>
          {totalQty > 0
            ? <span className="badge stock">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                В наличии
              </span>
            : <span className="badge" style={{ background: 'var(--surf-2)', color: 'var(--ink-3)' }}>Под заказ</span>
          }
        </div>
        <div className="card-art">{part.oem}</div>
        <div className="card-name">{part.name}</div>
        <div className="card-brand">{part.brand}</div>
        <div className="card-foot">
          <div className="card-price">
            <span className="now">{fmtKZT(price)}</span>
            <span className="unit">с НДС · за шт</span>
          </div>
          <button
            className="buy"
            onClick={(e) => {
              e.stopPropagation()
              addItem({ ...part, stock: stockMap }, 1)
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            {inCart ? 'В корзине' : 'В корзину'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CatalogInner() {
  const params      = useSearchParams()
  const systemParam = params.get('system') ?? ''
  const brandParam  = params.get('brand') ?? ''
  const modelParam  = params.get('model') ?? ''
  const vinParam    = params.get('vin') ?? ''
  const qParam      = params.get('q') ?? ''

  const [parts, setParts]     = useState<any[]>([])
  const [total, setTotal]     = useState(0)
  const [page, setPage]       = useState(1)
  const [loading, setLoading] = useState(true)
  const [sort, setSort]       = useState('popular')
  const [b2b, setB2b]         = useState(false)
  const [filters, setFilters] = useState({
    oemOnly: false, inStock: false, priceMax: 1000000,
    system: systemParam, q: qParam,
  })

  useEffect(() => {
    setFilters(f => ({ ...f, q: qParam, system: systemParam }))
    setPage(1)
  }, [qParam, systemParam])

  const brandObj = brands.find((b) => b.id === brandParam)
  const modelObj = (models[brandParam] ?? []).find((m) => m.id === modelParam)

  const title = modelObj
    ? `Запчасти на ${brandObj?.name} ${modelObj.name}`
    : vinParam && !filters.q ? `Запчасти по VIN: ${vinParam.toUpperCase()}`
    : filters.q ? `Поиск: ${filters.q}`
    : filters.system ? `${systems.find((s) => s.id === filters.system)?.ru} — все запчасти`
    : 'Каталог запчастей'

  const fetchParts = useCallback(async () => {
    setLoading(true)
    try {
      const sp = new URLSearchParams()
      if (filters.system)  sp.set('system', filters.system)
      if (filters.q)       sp.set('q', filters.q)
      if (vinParam && !filters.q) sp.set('vin', vinParam)
      if (filters.oemOnly) sp.set('oemOnly', '1')
      if (filters.inStock) sp.set('inStock', '1')
      if (brandParam)      sp.set('brand', brandParam)
      sp.set('priceMax', String(filters.priceMax))
      sp.set('sort', sort)
      sp.set('page', String(page))

      const res  = await fetch(`/api/parts?${sp}`)
      const data = await res.json()
      const items = (data.items || []).map((p: any) => ({
        ...p,
        stock: p.part_stock
          ? Object.fromEntries(p.part_stock.map((s: any) => [s.city, s.qty]))
          : {},
      }))
      setParts(items)
      setTotal(data.total || 0)
    } finally {
      setLoading(false)
    }
  }, [filters, sort, page, brandParam])

  useEffect(() => { fetchParts() }, [fetchParts])

  const totalPages = Math.ceil(total / 24)

  // Price segments for filter display
  const segments = [
    { id: 'premium', label: 'Премиум', tag: 'A' },
    { id: 'mid',     label: 'Средний', tag: 'B' },
    { id: 'budget',  label: 'Бюджет',  tag: null },
  ]

  return (
    <main className="plp">
      <div className="container">
        {/* Breadcrumbs */}
        <div className="crumbs">
          <Link href="/">Главная</Link> / <Link href="/catalog">Каталог</Link>
          {filters.q && <> / {filters.q}</>}
          {filters.system && <> / {systems.find(s => s.id === filters.system)?.ru}</>}
        </div>

        <header className="plp-head">
          <div>
            <h1>{title}</h1>
            <p className="plp-meta">
              Найдено <b>{total.toLocaleString('ru-RU')}</b> позиций
              {' · '}<Link href="/podbor">Сменить технику</Link>
            </p>
          </div>
          <div className="cart-mode-switch">
            <button className={!b2b ? 'on' : ''} onClick={() => setB2b(false)}>Физ. лицо</button>
            <button className={b2b ? 'on' : ''} onClick={() => setB2b(true)}>Юр. лицо</button>
          </div>
        </header>

        <div className="plp-layout">
          {/* Filters */}
          <aside className="plp-filters">

            <div className="filt-block">
              <h4>Поиск по бренду</h4>
              <div style={{ position: 'relative' }}>
                <Ico name="search" size={14} />
                <input
                  type="text"
                  placeholder="MANN, Bosch..."
                  style={{ width: '100%', padding: '8px 10px 8px 28px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 13, boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div className="filt-block">
              <h4>Тип</h4>
              <label className="filt-row">
                <input type="checkbox" checked={filters.oemOnly} onChange={(e) => { setFilters(f => ({ ...f, oemOnly: e.target.checked })); setPage(1) }} />
                <span>Только OEM (оригинал)</span>
              </label>
              <label className="filt-row">
                <input type="checkbox" checked={filters.inStock} onChange={(e) => { setFilters(f => ({ ...f, inStock: e.target.checked })); setPage(1) }} />
                <span>В наличии</span>
              </label>
              <label className="filt-row">
                <input type="checkbox" />
                <span>Под заказ</span>
              </label>
            </div>

            <div className="filt-block">
              <h4>Сегмент</h4>
              {segments.map((s) => (
                <label key={s.id} className="filt-row">
                  <input type="checkbox" />
                  <span>{s.label} {s.tag && <b style={{ background: 'var(--accent)', color: '#fff', fontSize: 10, padding: '1px 5px', borderRadius: 3, marginLeft: 4 }}>{s.tag}</b>}</span>
                </label>
              ))}
            </div>

            <div className="filt-block">
              <h4>Система</h4>
              {systems.slice(0, 10).map((s) => (
                <label key={s.id} className="filt-row">
                  <input
                    type="checkbox"
                    checked={filters.system === s.id}
                    onChange={(e) => { setFilters(f => ({ ...f, system: e.target.checked ? s.id : '' })); setPage(1) }}
                  />
                  <span>{s.ru}</span>
                  <span className="filt-count">{s.count}</span>
                </label>
              ))}
            </div>

            <div className="filt-block">
              <h4>Цена, ₸</h4>
              <input
                type="range" min="0" max="1000000" step="10000"
                value={filters.priceMax}
                onChange={(e) => setFilters(f => ({ ...f, priceMax: +e.target.value }))}
                onMouseUp={() => setPage(1)}
              />
              <div className="filt-price-row">
                <span>0 ₸</span>
                <b>до {filters.priceMax.toLocaleString('ru-RU')} ₸</b>
              </div>
            </div>

            {(filters.system || filters.oemOnly || filters.inStock) && (
              <div className="filt-block">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>
                    Выбрано: {[filters.system, filters.oemOnly, filters.inStock].filter(Boolean).length} фильтра
                  </span>
                  <button className="filt-clear" onClick={() => { setFilters(f => ({ ...f, system: '', oemOnly: false, inStock: false })); setPage(1) }}>
                    Сбросить
                  </button>
                </div>
              </div>
            )}
          </aside>

          {/* Results */}
          <div className="plp-results">
            <div className="plp-bar">
              <div className="plp-bar-left">
                <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>
                  {loading ? 'Загрузка...' : `${total.toLocaleString('ru-RU')} товаров`}
                </span>
              </div>
              <div className="plp-bar-right">
                <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1) }}>
                  <option value="popular">Сначала популярные</option>
                  <option value="price-asc">Цена ↑</option>
                  <option value="price-desc">Цена ↓</option>
                  <option value="stock">Сначала в наличии</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--ink-3)' }}>Загрузка...</div>
            ) : parts.length === 0 ? (
              <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--ink-3)' }}>
                <p>Товары не найдены.</p>
                <button className="filt-clear" onClick={() => setFilters(f => ({ ...f, system: '', oemOnly: false, inStock: false, q: '' }))}>
                  Сбросить фильтры
                </button>
              </div>
            ) : (
              <div className="plp-grid2">
                {parts.map((p) => <PartCard key={p.id} part={p} b2b={b2b} />)}
              </div>
            )}

            {totalPages > 1 && (
              <div className="plp-pager">
                {Array.from({ length: Math.min(totalPages, 4) }, (_, i) => i + 1).map((p) => (
                  <button key={p} className={page === p ? 'on' : ''} onClick={() => setPage(p)}>{p}</button>
                ))}
                {totalPages > 4 && <><button>…</button><button onClick={() => setPage(totalPages)}>{totalPages}</button></>}
                {page < totalPages && (
                  <button className="pager-next" onClick={() => setPage(p => p + 1)}>
                    Дальше <Ico name="chevron" size={14} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
