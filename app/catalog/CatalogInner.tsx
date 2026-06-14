'use client'
import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Ico } from '@/components/ui/Ico'
import { Chip } from '@/components/ui/Badge'
import { Crumbs } from '@/components/ui/Crumbs'
import { PartCard } from '@/components/catalog/PartCard'
import { PartRow } from '@/components/catalog/PartRow'
import { parts, systems, brands, models } from '@/lib/data'

export default function CatalogInner() {
  const params = useSearchParams()
  const systemParam = params.get('system') ?? ''
  const brandParam  = params.get('brand') ?? ''
  const modelParam  = params.get('model') ?? ''

  const [view, setView]   = useState<'grid' | 'list'>('grid')
  const [sort, setSort]   = useState('popular')
  const [showVAT, setShowVAT] = useState(true)
  const [filters, setFilters] = useState({
    oemOnly: false, inStock: false, priceMax: 300000,
    systems: systemParam ? [systemParam] : [] as string[],
  })

  const brandObj = brands.find((b) => b.id === brandParam)
  const modelObj = (models[brandParam] ?? []).find((m) => m.id === modelParam)

  const title = modelObj
    ? `Запчасти на ${brandObj?.name} ${modelObj.name}`
    : systemParam
    ? `${systems.find((s) => s.id === systemParam)?.ru} — все запчасти`
    : 'Каталог запчастей'

  const list = useMemo(() => {
    let res = [...parts, ...parts.map((p) => ({
      ...p, id: p.id + '-b', price: Math.round(p.price * 0.85),
      brand: p.brand + ' (an.)', type: 'Aftermarket' as const,
    }))]
    if (filters.oemOnly) res = res.filter((p) => p.type === 'OEM')
    if (filters.inStock) res = res.filter((p) => (p.stock['Алматы'] ?? 0) > 0)
    if (filters.systems.length) res = res.filter((p) => filters.systems.includes(p.category))
    res = res.filter((p) => p.price <= filters.priceMax)
    if (sort === 'price-asc')  res.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') res.sort((a, b) => b.price - a.price)
    if (sort === 'stock') res.sort((a, b) => (b.stock['Алматы'] ?? 0) - (a.stock['Алматы'] ?? 0))
    return res
  }, [filters, sort])

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
              Найдено <b>{list.length}</b> позиций
              {modelObj && <> · {modelObj.cls} · {modelObj.years}</>}
              {' · '}<Link href="/podbor">Сменить технику</Link>
            </p>
          </div>
          {modelObj && (
            <div className="plp-vehicle">
              <Ico name="truck" size={28} />
              <div>
                <div className="plp-veh-name">{brandObj?.name} {modelObj.name}</div>
                <div className="plp-veh-sub">{modelObj.cls} · {modelObj.years}</div>
              </div>
            </div>
          )}
        </header>

        <div className="plp-layout">
          <aside className="plp-filters">
            <div className="filt-block">
              <h4>Применённые</h4>
              <div className="filt-chips">
                {filters.systems.map((s) => (
                  <Chip key={s} onClick={() => setFilters({ ...filters, systems: filters.systems.filter((x) => x !== s) })}>
                    {systems.find((x) => x.id === s)?.ru} <Ico name="close" size={10} />
                  </Chip>
                ))}
                {filters.oemOnly && <Chip onClick={() => setFilters({ ...filters, oemOnly: false })}>Только OEM <Ico name="close" size={10} /></Chip>}
              </div>
              <button className="filt-clear" onClick={() => setFilters({ oemOnly: false, inStock: false, priceMax: 300000, systems: [] })}>Сбросить всё</button>
            </div>

            <div className="filt-block">
              <h4>Тип</h4>
              <label className="filt-toggle"><input type="checkbox" checked={filters.oemOnly} onChange={(e) => setFilters({ ...filters, oemOnly: e.target.checked })} /><span>Только OEM (оригинал)</span></label>
              <label className="filt-toggle"><input type="checkbox" checked={filters.inStock} onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })} /><span>В наличии в Алматы</span></label>
            </div>

            <div className="filt-block">
              <h4>Система</h4>
              {systems.slice(0, 8).map((s) => (
                <label key={s.id} className="filt-row">
                  <input
                    type="checkbox"
                    checked={filters.systems.includes(s.id)}
                    onChange={(e) => setFilters({ ...filters, systems: e.target.checked ? [...filters.systems, s.id] : filters.systems.filter((x) => x !== s.id) })}
                  />
                  <span>{s.ru}</span>
                  <span className="filt-count">{s.count}</span>
                </label>
              ))}
            </div>

            <div className="filt-block">
              <h4>Цена, ₸</h4>
              <input type="range" min="0" max="300000" step="5000" value={filters.priceMax} onChange={(e) => setFilters({ ...filters, priceMax: +e.target.value })} />
              <div className="filt-price-row">
                <span>0</span>
                <b>до {filters.priceMax.toLocaleString('ru-RU')} ₸</b>
              </div>
            </div>

            <div className="filt-block">
              <h4>Производитель детали</h4>
              {['Bosch', 'MANN-FILTER', 'WABCO', 'Gates', 'КАМАЗ', 'ТЯЖМАШ', 'БЗА'].map((b) => (
                <label key={b} className="filt-row">
                  <input type="checkbox" />
                  <span>{b}</span>
                  <span className="filt-count">{Math.floor(Math.random() * 40) + 5}</span>
                </label>
              ))}
            </div>
          </aside>

          <div className="plp-results">
            <div className="plp-bar">
              <div className="plp-bar-left">
                <label className="vat-toggle">
                  <input type="checkbox" checked={showVAT} onChange={(e) => setShowVAT(e.target.checked)} />
                  <span>Показывать цену без НДС</span>
                </label>
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

            {view === 'grid'
              ? <div className="plp-grid">{list.map((p) => <PartCard key={p.id} part={p} />)}</div>
              : <div className="plp-list">{list.map((p) => <PartRow key={p.id} part={p} showVAT={showVAT} />)}</div>
            }

            <div className="plp-pager">
              <button className="on">1</button>
              <button>2</button>
              <button>3</button>
              <button>…</button>
              <button>12</button>
              <button className="pager-next">Дальше <Ico name="chevron" size={14} /></button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
