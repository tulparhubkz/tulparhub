'use client'
import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Ico } from '@/components/ui/Ico'
import { ProductCard } from '@/components/catalog/ProductCard'
import { systems, brands, models } from '@/lib/data'

export default function CatalogInner() {
  const params      = useSearchParams()
  const systemParam = params.get('system') ?? ''
  const brandParam  = params.get('brand')  ?? ''
  const modelParam  = params.get('model')  ?? ''
  const vinParam    = params.get('vin')    ?? ''
  const qParam      = params.get('q')      ?? ''

  const [parts, setParts]         = useState<any[]>([])
  const [total, setTotal]         = useState(0)
  const [page, setPage]           = useState(1)
  const [loading, setLoading]     = useState(true)
  const [sort, setSort]           = useState('popular')
  const [b2b, setB2b]             = useState(false)
  const [showFilters, setShowFilters] = useState(false) // mobile filter sheet
  const [brandSearch, setBrandSearch] = useState('')   // filter by parts manufacturer (MANN, Bosch…)
  const [priceMax, setPriceMax]   = useState(1000000)
  const [priceCommit, setPriceCommit] = useState(1000000) // fires fetch only on mouse/touch up
  const [filters, setFilters]     = useState({
    oemOnly: false, inStock: false, outOfStock: false,
    system: systemParam,
    q: qParam,
  })

  // Sync URL params → filters when navigation changes
  useEffect(() => {
    setFilters(f => ({ ...f, q: qParam, system: systemParam }))
    setPage(1)
  }, [qParam, systemParam])

  const brandObj = brands.find(b => b.id === brandParam)
  const modelObj = (models[brandParam] ?? []).find(m => m.id === modelParam)

  const title = modelObj
    ? `Запчасти на ${brandObj?.name} ${modelObj.name}`
    : brandObj && !modelParam ? `Запчасти ${brandObj.name}`
    : vinParam && !filters.q ? `Запчасти по VIN: ${vinParam.toUpperCase()}`
    : filters.q ? `Поиск: ${filters.q}`
    : filters.system ? `${systems.find(s => s.id === filters.system)?.ru} — все запчасти`
    : 'Каталог запчастей'

  const fetchParts = useCallback(async () => {
    setLoading(true)
    try {
      const sp = new URLSearchParams()
      if (filters.system)   sp.set('system',   filters.system)
      if (filters.q)        sp.set('q',         filters.q)
      if (vinParam && !filters.q) sp.set('vin', vinParam)
      if (filters.oemOnly)  sp.set('oemOnly',  '1')
      if (filters.inStock)  sp.set('inStock',  '1')
      if (brandParam)       sp.set('brand',    brandParam)
      if (modelParam)       sp.set('model',    modelParam)
      if (brandSearch.trim()) sp.set('partBrand', brandSearch.trim())
      sp.set('priceMax', String(priceCommit))
      sp.set('sort',     sort)
      sp.set('page',     String(page))

      const res  = await fetch(`/api/parts?${sp}`)
      const data = await res.json()
      let items: any[] = (data.items || []).map((p: any) => ({
        ...p,
        stock: p.part_stock
          ? Object.fromEntries(p.part_stock.map((s: any) => [s.city, s.qty]))
          : {},
      }))

      // Client-side: "Под заказ" = totalQty === 0
      if (filters.outOfStock && !filters.inStock) {
        items = items.filter(p => {
          const qty = Object.values(p.stock as Record<string,number>).reduce((a,b) => a+b, 0)
          return qty === 0
        })
      }

      // Client-side: sort by stock (in-stock first)
      if (sort === 'stock') {
        items.sort((a, b) => {
          const qa = Object.values(a.stock as Record<string,number>).reduce((x,y)=>x+y,0)
          const qb = Object.values(b.stock as Record<string,number>).reduce((x,y)=>x+y,0)
          return qb - qa
        })
      }

      setParts(items)
      setTotal(data.total || 0)
    } finally {
      setLoading(false)
    }
  }, [filters, sort, page, brandParam, modelParam, vinParam, brandSearch, priceCommit])

  useEffect(() => { fetchParts() }, [fetchParts])

  const totalPages = Math.ceil(total / 24)

  const activeCount = [
    filters.system, filters.oemOnly, filters.inStock, filters.outOfStock,
    brandSearch.trim(), priceCommit < 1000000,
  ].filter(Boolean).length

  const resetFilters = () => {
    setFilters(f => ({ ...f, system:'', oemOnly:false, inStock:false, outOfStock:false }))
    setBrandSearch('')
    setPriceMax(1000000)
    setPriceCommit(1000000)
    setPage(1)
  }

  // Filter controls — shared by the desktop sidebar and the mobile bottom sheet.
  const filterPanel = (
    <>
      {/* Parts manufacturer search */}
      <div className="filt-block">
        <h4>Производитель запчасти</h4>
        <div style={{ position:'relative', display:'flex', alignItems:'center' }}>
          <span style={{ position:'absolute', left:8, pointerEvents:'none', color:'var(--ink-3)' }}><Ico name="search" size={14} /></span>
          <input
            type="text"
            placeholder="MANN, Bosch, ELRING…"
            value={brandSearch}
            onChange={e => { setBrandSearch(e.target.value); setPage(1) }}
            style={{ width:'100%', padding:'8px 10px 8px 30px', border:'1.5px solid var(--line-2)', borderRadius:8, fontSize:13, outline:'none' }}
          />
          {brandSearch && (
            <button onClick={() => { setBrandSearch(''); setPage(1) }}
              style={{ position:'absolute', right:8, background:'none', border:'none', cursor:'pointer', color:'var(--ink-3)', fontSize:16 }}>×</button>
          )}
        </div>
      </div>

      {/* Type */}
      <div className="filt-block">
        <h4>Тип</h4>
        <label className="filt-row">
          <input type="checkbox" checked={filters.oemOnly}
            onChange={e => { setFilters(f => ({ ...f, oemOnly: e.target.checked })); setPage(1) }} />
          <span>Только OEM (оригинал)</span>
        </label>
        <label className="filt-row">
          <input type="checkbox" checked={filters.inStock}
            onChange={e => { setFilters(f => ({ ...f, inStock: e.target.checked, outOfStock: e.target.checked ? false : f.outOfStock })); setPage(1) }} />
          <span>В наличии</span>
        </label>
        <label className="filt-row">
          <input type="checkbox" checked={filters.outOfStock}
            onChange={e => { setFilters(f => ({ ...f, outOfStock: e.target.checked, inStock: e.target.checked ? false : f.inStock })); setPage(1) }} />
          <span>Под заказ</span>
        </label>
      </div>

      {/* System */}
      <div className="filt-block">
        <h4>Система</h4>
        {systems.map(s => (
          <label key={s.id} className="filt-row">
            <input type="checkbox"
              checked={filters.system === s.id}
              onChange={e => { setFilters(f => ({ ...f, system: e.target.checked ? s.id : '' })); setPage(1) }} />
            <span>{s.ru}</span>
            <span className="filt-count">{s.count.toLocaleString('ru-RU')}</span>
          </label>
        ))}
      </div>

      {/* Price */}
      <div className="filt-block">
        <h4>Цена, ₸</h4>
        <input
          type="range" min="0" max="1000000" step="10000"
          value={priceMax}
          onChange={e => setPriceMax(+e.target.value)}
          onMouseUp={e => { setPriceCommit((e.target as HTMLInputElement).valueAsNumber); setPage(1) }}
          onTouchEnd={e => { setPriceCommit((e.target as HTMLInputElement).valueAsNumber); setPage(1) }}
          style={{ width:'100%' }}
        />
        <div className="filt-price-row">
          <span>0 ₸</span>
          <b>до {priceMax.toLocaleString('ru-RU')} ₸</b>
        </div>
      </div>

      {/* Reset */}
      {activeCount > 0 && (
        <div className="filt-block">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontSize:13, color:'var(--ink-3)' }}>Выбрано фильтров: {activeCount}</span>
            <button className="filt-clear" onClick={resetFilters}>Сбросить все</button>
          </div>
        </div>
      )}
    </>
  )

  return (
    <main className="plp">
      <div className="container">
        <div className="crumbs">
          <Link href="/">Главная</Link> / <Link href="/catalog">Каталог</Link>
          {brandObj && <> / {brandObj.name}</>}
          {modelObj && <> / {modelObj.name}</>}
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
          {/* ── Sidebar filters (desktop) ── */}
          <aside className="plp-filters">{filterPanel}</aside>

          {/* ── Results ── */}
          <div className="plp-results">
            <div className="plp-bar">
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <button className="filters-trigger" onClick={() => setShowFilters(true)}>
                  <Ico name="filter" size={16} />
                  Фильтры
                  {activeCount > 0 && <span className="ft-count">{activeCount}</span>}
                </button>
                <span style={{ fontSize:13, color:'var(--ink-3)' }}>
                  {loading ? 'Загрузка…' : `${total.toLocaleString('ru-RU')} товаров`}
                </span>
              </div>
              <select value={sort} onChange={e => { setSort(e.target.value); setPage(1) }}>
                <option value="popular">Сначала популярные</option>
                <option value="price-asc">Цена ↑ (дешевле)</option>
                <option value="price-desc">Цена ↓ (дороже)</option>
                <option value="stock">Сначала в наличии</option>
              </select>
            </div>

            {loading ? (
              <div style={{ padding:'4rem 0', textAlign:'center', color:'var(--ink-3)' }}>Загрузка…</div>
            ) : parts.length === 0 ? (
              <div style={{ padding:'4rem 0', textAlign:'center', color:'var(--ink-3)' }}>
                <p style={{ marginBottom:12 }}>Товары не найдены.</p>
                <button className="filt-clear" onClick={() => { resetFilters(); setFilters(f => ({ ...f, q:'' })) }}>Сбросить фильтры</button>
              </div>
            ) : (
              <div className="plp-grid2">
                {parts.map(p => <ProductCard key={p.id} part={p} b2b={b2b} />)}
              </div>
            )}

            {totalPages > 1 && (
              <div className="plp-pager">
                {page > 1 && <button onClick={() => setPage(p => p - 1)}>← Назад</button>}
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const n = Math.max(1, Math.min(page - 2, totalPages - 4)) + i
                  return (
                    <button key={n} className={page === n ? 'on' : ''} onClick={() => setPage(n)}>{n}</button>
                  )
                })}
                {totalPages > 5 && page < totalPages - 2 && <><span style={{padding:'0 4px'}}>…</span><button onClick={() => setPage(totalPages)}>{totalPages}</button></>}
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

      {/* ── Mobile filter sheet ── */}
      {showFilters && (
        <div className="sheet-backdrop" onClick={() => setShowFilters(false)}>
          <div className="sheet filters-sheet" onClick={e => e.stopPropagation()}>
            <div className="sheet-head">
              <div>
                <div className="sheet-pre">Каталог</div>
                <h3>Фильтры</h3>
              </div>
              <button onClick={() => setShowFilters(false)}><Ico name="close" size={20} /></button>
            </div>
            <div className="filters-sheet-body">{filterPanel}</div>
            <div className="filters-apply">
              <button className="btn btn-primary btn-lg btn-full" onClick={() => setShowFilters(false)}>
                Показать {total.toLocaleString('ru-RU')} товаров
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
