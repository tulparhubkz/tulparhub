'use client'
import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { Ico } from '@/components/ui/Ico'
import { ProductCard } from '@/components/catalog/ProductCard'
import { systems, brands, models } from '@/lib/data'
import { useT } from '@/lib/i18n'

export default function CatalogInner() {
  const t           = useT()
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
    ? `${t('catalog.title.modelPre')}${brandObj?.name} ${modelObj.name}`
    : brandObj && !modelParam ? `${t('catalog.title.brandPre')}${brandObj.name}`
    : vinParam && !filters.q ? `${t('catalog.title.vinPre')}${vinParam.toUpperCase()}`
    : filters.q ? `${t('catalog.title.qPre')}${filters.q}`
    : filters.system ? `${systems.find(s => s.id === filters.system)?.ru}${t('catalog.title.systemPost')}`
    : t('catalog.title.default')

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
        <h4>{t('catalog.filt.partBrand')}</h4>
        <div style={{ position:'relative', display:'flex', alignItems:'center' }}>
          <span style={{ position:'absolute', left:8, pointerEvents:'none', color:'var(--ink-3)' }}><Ico name="search" size={14} /></span>
          <input
            type="text"
            placeholder={t('catalog.filt.partBrandPh')}
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
        <h4>{t('catalog.filt.type')}</h4>
        <label className="filt-row">
          <input type="checkbox" checked={filters.oemOnly}
            onChange={e => { setFilters(f => ({ ...f, oemOnly: e.target.checked })); setPage(1) }} />
          <span>{t('catalog.filt.oem')}</span>
        </label>
        <label className="filt-row">
          <input type="checkbox" checked={filters.inStock}
            onChange={e => { setFilters(f => ({ ...f, inStock: e.target.checked, outOfStock: e.target.checked ? false : f.outOfStock })); setPage(1) }} />
          <span>{t('catalog.filt.inStock')}</span>
        </label>
        <label className="filt-row">
          <input type="checkbox" checked={filters.outOfStock}
            onChange={e => { setFilters(f => ({ ...f, outOfStock: e.target.checked, inStock: e.target.checked ? false : f.inStock })); setPage(1) }} />
          <span>{t('catalog.filt.onOrder')}</span>
        </label>
      </div>

      {/* System */}
      <div className="filt-block">
        <h4>{t('catalog.filt.system')}</h4>
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
        <h4>{t('catalog.filt.price')}</h4>
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
          <b>{t('catalog.filt.upTo')} {priceMax.toLocaleString('ru-RU')} ₸</b>
        </div>
      </div>

      {/* Reset */}
      {activeCount > 0 && (
        <div className="filt-block">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontSize:13, color:'var(--ink-3)' }}>{t('catalog.filt.selected')} {activeCount}</span>
            <button className="filt-clear" onClick={resetFilters}>{t('catalog.filt.resetAll')}</button>
          </div>
        </div>
      )}
    </>
  )

  return (
    <main className="plp">
      <div className="container">
        <div className="crumbs">
          <Link href="/">{t('common.home')}</Link> / <Link href="/catalog">{t('nav.catalog')}</Link>
          {brandObj && <> / {brandObj.name}</>}
          {modelObj && <> / {modelObj.name}</>}
          {filters.q && <> / {filters.q}</>}
          {filters.system && <> / {systems.find(s => s.id === filters.system)?.ru}</>}
        </div>

        <header className="plp-head">
          <div>
            <h1>{title}</h1>
            <p className="plp-meta">
              {t('catalog.meta.foundPre')}<b>{total.toLocaleString('ru-RU')}</b> {t('catalog.meta.positions')}
              {' · '}<Link href="/podbor">{t('catalog.changeVehicle')}</Link>
            </p>
          </div>
          <div className="cart-mode-switch">
            <button className={!b2b ? 'on' : ''} onClick={() => setB2b(false)}>{t('catalog.buyerInd')}</button>
            <button className={b2b ? 'on' : ''} onClick={() => setB2b(true)}>{t('catalog.buyerLeg')}</button>
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
                  {t('catalog.filters')}
                  {activeCount > 0 && <span className="ft-count">{activeCount}</span>}
                </button>
                <span style={{ fontSize:13, color:'var(--ink-3)' }}>
                  {loading ? t('common.loading') : `${total.toLocaleString('ru-RU')} ${t('catalog.itemsWord')}`}
                </span>
              </div>
              <select value={sort} onChange={e => { setSort(e.target.value); setPage(1) }}>
                <option value="popular">{t('catalog.sort.popular')}</option>
                <option value="price-asc">{t('catalog.sort.priceAsc')}</option>
                <option value="price-desc">{t('catalog.sort.priceDesc')}</option>
                <option value="stock">{t('catalog.sort.stock')}</option>
              </select>
            </div>

            {loading ? (
              <div className="plp-grid2">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="skel-card" aria-hidden="true">
                    <div className="skel skel-img" />
                    <div className="skel-body">
                      <div className="skel skel-line" style={{ width:'40%' }} />
                      <div className="skel skel-line" style={{ width:'90%' }} />
                      <div className="skel skel-line" style={{ width:'70%' }} />
                      <div className="skel skel-line" style={{ width:'55%', height:22, marginTop:6 }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : parts.length === 0 ? (
              <div style={{ padding:'4rem 0', textAlign:'center', color:'var(--ink-3)' }}>
                <p style={{ marginBottom:12 }}>{t('catalog.notFound')}</p>
                <button className="filt-clear" onClick={() => { resetFilters(); setFilters(f => ({ ...f, q:'' })) }}>{t('catalog.resetFilters')}</button>
              </div>
            ) : (
              <div className="plp-grid2">
                {parts.map(p => <ProductCard key={p.id} part={p} b2b={b2b} />)}
              </div>
            )}

            {totalPages > 1 && (
              <div className="plp-pager">
                {page > 1 && <button onClick={() => setPage(p => p - 1)}>{t('catalog.pager.back')}</button>}
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const n = Math.max(1, Math.min(page - 2, totalPages - 4)) + i
                  return (
                    <button key={n} className={page === n ? 'on' : ''} onClick={() => setPage(n)}>{n}</button>
                  )
                })}
                {totalPages > 5 && page < totalPages - 2 && <><span style={{padding:'0 4px'}}>…</span><button onClick={() => setPage(totalPages)}>{totalPages}</button></>}
                {page < totalPages && (
                  <button className="pager-next" onClick={() => setPage(p => p + 1)}>
                    {t('catalog.pager.next')} <Ico name="chevron" size={14} />
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
                <div className="sheet-pre">{t('catalog.sheetPre')}</div>
                <h3>{t('catalog.filters')}</h3>
              </div>
              <button onClick={() => setShowFilters(false)}><Ico name="close" size={20} /></button>
            </div>
            <div className="filters-sheet-body">{filterPanel}</div>
            <div className="filters-apply">
              <button className="btn btn-primary btn-lg btn-full" onClick={() => setShowFilters(false)}>
                {t('catalog.showPre')}{total.toLocaleString('ru-RU')} {t('catalog.itemsWord')}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
