'use client'
import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Ico } from '@/components/ui/Ico'
import { Chip } from '@/components/ui/Badge'
import { Crumbs } from '@/components/ui/Crumbs'
import { systems, brands, models } from '@/lib/data'
import { fmtKZT } from '@/lib/utils'
import type { Part } from '@/types'
import { useCart } from '@/store/cart'

function PartCardReal({ part, b2b }: { part: any; b2b: boolean }) {
  const { items, addItem } = useCart()
  const inCart = items.some((i) => i.id === part.id)
  const price = b2b ? (part.price_b2b || part.price) : part.price
  const totalStock = Object.values(part.stock as Record<string, number> || {}).reduce((a: number, b: number) => a + b, 0)

  return (
    <div className="part-card">
      <div className="pc-img">
        <div className="pc-placeholder" style={{ background: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 160, color: '#aaa', fontSize: 12 }}>
          {part.brand}
        </div>
        <div className="pc-badges">
          <span className="badge oem">{part.type || 'OEM'}</span>
          {totalStock > 0 && <span className="badge ok">В наличии</span>}
        </div>
      </div>
      <div className="pc-body">
        <div className="pc-oem">{part.oem}</div>
        <div className="pc-name">{part.name}</div>
        <div className="pc-fits">{part.brand}</div>
        {part.fits?.length > 0 && (
          <div className="pc-fits" style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>
            {(part.fits as string[]).slice(0, 3).join(' · ')}
          </div>
        )}
        <div className="pc-bottom">
          <div className="pc-price">
            <b>{fmtKZT(price)}</b>
            {b2b && part.price_b2b && <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>опт</span>}
          </div>
          <button
            className={`pc-cart ${inCart ? 'in' : ''}`}
            onClick={() => addItem({ ...part, stock: part.stock || {} }, 1)}
          >
            <Ico name={inCart ? 'check' : 'cart'} size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CatalogInner() {
  const params = useSearchParams()
  const systemParam = params.get('system') ?? ''
  const brandParam  = params.get('brand') ?? ''
  const modelParam  = params.get('model') ?? ''
  const qParam      = params.get('q') ?? ''

  const [parts, setParts]     = useState<any[]>([])
  const [total, setTotal]     = useState(0)
  const [page, setPage]       = useState(1)
  const [loading, setLoading] = useState(true)
  const [view, setView]       = useState<'grid' | 'list'>('grid')
  const [sort, setSort]       = useState('popular')
  const [b2b, setB2b]         = useState(false)
  const [filters, setFilters] = useState({
    oemOnly: false,
    inStock: false,
    priceMax: 1000000,
    system: systemParam,
    q: qParam,
  })

  // Sync search param from URL when user clicks "Найти"
  useEffect(() => {
    setFilters(f => ({ ...f, q: qParam, system: systemParam }))
    setPage(1)
  }, [qParam, systemParam])

  const brandObj = brands.find((b) => b.id === brandParam)
  const modelObj = (models[brandParam] ?? []).find((m) => m.id === modelParam)

  const title = modelObj
    ? `Запчасти на ${brandObj?.name} ${modelObj.name}`
    : filters.system
    ? `${systems.find((s) => s.id === filters.system)?.ru} — все запчасти`
    : filters.q
    ? `Поиск: ${filters.q}`
    : 'Каталог запчастей'

  const fetchParts = useCallback(async () => {
    setLoading(true)
    try {
      const sp = new URLSearchParams()
      if (filters.system)  sp.set('system', filters.system)
      if (filters.q)       sp.set('q', filters.q)
      if (filters.oemOnly) sp.set('oemOnly', '1')
      if (filters.inStock) sp.set('inStock', '1')
      if (brandParam)      sp.set('brand', brandParam)
      sp.set('priceMax', String(filters.priceMax))
      sp.set('sort', sort)
      sp.set('page', String(page))
      sp.set('limit', '24')

      const res = await fetch(`/api/parts?${sp}`)
      const data = await res.json()

      // Rebuild stock from part_stock rows if needed
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

  const crumbs = [
    { label: 'Главная', href: '/' },
    { label: 'Каталог' },
    ...(brandObj ? [{ label: brandObj.name }] : []),
    ...(modelObj ? [{ label: modelObj.name }] : []),
  ]

  return (
    <main className="plp">
      <div className="container">
        <Crumbs items={crumbs} />

        <header className="plp-head">
          <div>
            <h1>{title}</h1>
            <p className="plp-meta">
              Найдено <b>{total.toLocaleString('ru-RU')}</b> позиций
              {modelObj && <> · {modelObj.cls} · {modelObj.years}</>}
              {' · '}<Link href="/podbor">Сменить технику</Link>
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {modelObj && (
              <div className="plp-vehicle">
                <Ico name="truck" size={28} />
                <div>
                  <div className="plp-veh-name">{brandObj?.name} {modelObj.name}</div>
                  <div className="plp-veh-sub">{modelObj.cls} · {modelObj.years}</div>
                </div>
              </div>
            )}
            {/* B2B / B2C переключатель */}
            <div className="cart-mode-switch" style={{ flexShrink: 0 }}>
              <button className={!b2b ? 'on' : ''} onClick={() => setB2b(false)}>Физ. лицо</button>
              <button className={b2b ? 'on' : ''} onClick={() => setB2b(true)}>Юр. лицо</button>
            </div>
          </div>
        </header>

        <div className="plp-layout">
          <aside className="plp-filters">
            <div className="filt-block">
              <h4>Поиск</h4>
              <input
                type="text"
                placeholder="Название, OEM, артикул..."
                defaultValue={filters.q}
                style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 13 }}
                onChange={(e) => {
                  const v = e.target.value
                  const t = setTimeout(() => setFilters(f => ({ ...f, q: v })), 400)
                  return () => clearTimeout(t)
                }}
              />
            </div>

            <div className="filt-block">
              <h4>Тип</h4>
              <label className="filt-toggle">
                <input type="checkbox" checked={filters.oemOnly} onChange={(e) => setFilters(f => ({ ...f, oemOnly: e.target.checked }))} />
                <span>Только OEM (оригинал)</span>
              </label>
              <label className="filt-toggle">
                <input type="checkbox" checked={filters.inStock} onChange={(e) => setFilters(f => ({ ...f, inStock: e.target.checked }))} />
                <span>В наличии</span>
              </label>
            </div>

            <div className="filt-block">
              <h4>Система</h4>
              {systems.slice(0, 10).map((s) => (
                <label key={s.id} className="filt-row">
                  <input
                    type="radio"
                    name="system"
                    checked={filters.system === s.id}
                    onChange={() => setFilters(f => ({ ...f, system: f.system === s.id ? '' : s.id }))}
                  />
                  <span>{s.ru}</span>
                </label>
              ))}
              {filters.system && (
                <button className="filt-clear" onClick={() => setFilters(f => ({ ...f, system: '' }))}>
                  Сбросить
                </button>
              )}
            </div>

            <div className="filt-block">
              <h4>Цена, ₸</h4>
              <input
                type="range" min="0" max="1000000" step="10000"
                value={filters.priceMax}
                onChange={(e) => setFilters(f => ({ ...f, priceMax: +e.target.value }))}
              />
              <div className="filt-price-row">
                <span>0</span>
                <b>до {filters.priceMax.toLocaleString('ru-RU')} ₸</b>
              </div>
            </div>
          </aside>

          <div className="plp-results">
            <div className="plp-bar">
              <div className="plp-bar-left">
                <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>
                  {loading ? 'Загрузка...' : `${total.toLocaleString('ru-RU')} товаров`}
                </span>
              </div>
              <div className="plp-bar-right">
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="popular">Сначала популярные</option>
                  <option value="price-asc">Цена ↑</option>
                  <option value="price-desc">Цена ↓</option>
                  <option value="stock">Сначала в наличии</option>
                </select>
                <div className="view-switch">
                  <button className={view === 'grid' ? 'on' : ''} onClick={() => setView('grid')}><Ico name="grid" size={14} /></button>
                  <button className={view === 'list' ? 'on' : ''} onClick={() => setView('list')}><Ico name="rows" size={14} /></button>
                </div>
              </div>
            </div>

            {loading ? (
              <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--ink-3)' }}>Загрузка товаров...</div>
            ) : parts.length === 0 ? (
              <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--ink-3)' }}>Товары не найдены. Попробуйте изменить фильтры.</div>
            ) : (
              <div className={view === 'grid' ? 'plp-grid' : 'plp-list'}>
                {parts.map((p) => <PartCardReal key={p.id} part={p} b2b={b2b} />)}
              </div>
            )}

            {totalPages > 1 && (
              <div className="plp-pager">
                {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map((p) => (
                  <button key={p} className={page === p ? 'on' : ''} onClick={() => setPage(p)}>{p}</button>
                ))}
                {totalPages > 10 && <button>…</button>}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
