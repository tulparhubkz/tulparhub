'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { getBrandInfo } from '@/lib/brandInfo'

interface BrandRow { name: string; count: number }

export default function PartsBrandsPage() {
  const [brands, setBrands] = useState<BrandRow[]>([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/part-brands')
      .then(r => r.json())
      .then(d => setBrands(d.brands ?? []))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    if (!query) return brands
    return brands.filter(b => b.name.toLowerCase().includes(query))
  }, [brands, q])

  return (
    <>
      <style>{`
        .pb-page { max-width: 1100px; margin: 0 auto; padding: 32px 20px 60px; }
        .pb-title { font-size: 26px; font-weight: 800; color: var(--ink); margin-bottom: 6px; }
        .pb-sub { font-size: 14px; color: var(--ink-3); margin-bottom: 24px; }
        .pb-search { width: 100%; max-width: 360px; padding: 11px 14px; border: 1.5px solid var(--line-2); border-radius: var(--radius); font-size: 14px; margin-bottom: 24px; }
        .pb-search:focus { outline: none; border-color: var(--accent); }
        .pb-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; }
        .pb-card { display: block; background: var(--surf); border: 1px solid var(--line); border-radius: var(--radius-lg); padding: 18px; text-decoration: none; transition: .15s; }
        .pb-card:hover { border-color: var(--accent); box-shadow: 0 4px 16px rgba(0,0,0,.06); }
        .pb-name { font-size: 16px; font-weight: 700; color: var(--ink); margin-bottom: 4px; }
        .pb-count { font-size: 13px; color: var(--ink-3); }
        .pb-country { font-size: 12px; color: var(--accent); margin-top: 6px; }
      `}</style>
      <main className="container pb-page">
        <div className="crumbs" style={{ marginBottom: 20 }}>
          <Link href="/">Главная</Link> / <span>Бренды</span>
        </div>
        <h1 className="pb-title">Бренды запчастей</h1>
        <p className="pb-sub">{brands.length} брендов в каталоге запчастей</p>

        <input
          className="pb-search"
          placeholder="Поиск бренда..."
          value={q}
          onChange={e => setQ(e.target.value)}
        />

        {loading ? (
          <p style={{ color: 'var(--ink-3)' }}>Загрузка...</p>
        ) : (
          <div className="pb-grid">
            {filtered.map(b => {
              const info = getBrandInfo(b.name)
              return (
                <Link key={b.name} href={`/parts-brands/${encodeURIComponent(b.name)}`} className="pb-card">
                  <div className="pb-name">{b.name}</div>
                  <div className="pb-count">{b.count} {b.count === 1 ? 'позиция' : 'позиций'}</div>
                  {info && <div className="pb-country">{info.country}</div>}
                </Link>
              )
            })}
          </div>
        )}
      </main>
    </>
  )
}
