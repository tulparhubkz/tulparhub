'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { getBrandInfo } from '@/lib/brandInfo'
import { ProductCard } from '@/components/catalog/ProductCard'
import { useT } from '@/lib/i18n'

export default function BrandPage() {
  const t = useT()
  const { brand: brandParam } = useParams<{ brand: string }>()
  const brand = decodeURIComponent(brandParam ?? '')
  const info = getBrandInfo(brand)

  const [parts, setParts] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/parts?brand=${encodeURIComponent(brand)}&page=1`)
      .then(r => r.json())
      .then(d => {
        const items = (d.items || []).map((p: any) => ({
          ...p,
          stock: p.part_stock
            ? Object.fromEntries(p.part_stock.map((s: any) => [s.city, s.qty]))
            : {},
        }))
        setParts(items)
        setTotal(d.total || 0)
      })
      .finally(() => setLoading(false))
  }, [brand])

  return (
    <>
      <style jsx global>{`
        .bp-page { max-width: 1200px; margin: 0 auto; padding: 32px 20px 60px; }
        .bp-head { display: flex; gap: 28px; align-items: flex-start; background: var(--surf); border: 1px solid var(--line); border-radius: var(--radius-lg); padding: 28px; margin-bottom: 32px; }
        .bp-logo { width: 96px; height: 96px; border-radius: var(--radius); background: var(--surf-2); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 28px; font-weight: 800; color: var(--ink-2); }
        .bp-name { font-size: 28px; font-weight: 800; color: var(--ink); margin-bottom: 6px; }
        .bp-count { font-size: 14px; color: var(--ink-3); margin-bottom: 14px; }
        .bp-meta-row { display: flex; gap: 24px; margin-bottom: 14px; font-size: 13.5px; }
        .bp-meta-row b { color: var(--ink-2); font-weight: 600; margin-right: 6px; }
        .bp-desc { font-size: 14px; color: var(--ink-2); line-height: 1.6; max-width: 760px; }
        .bp-noinfo { font-size: 14px; color: var(--ink-3); font-style: italic; }
      `}</style>
      <main className="container bp-page">
        <div className="crumbs" style={{ marginBottom: 20 }}>
          <Link href="/">{t('common.home')}</Link> / <Link href="/parts-brands">{t('nav.brands')}</Link> / <span>{brand}</span>
        </div>

        <div className="bp-head">
          <div className="bp-logo">{brand.slice(0, 2).toUpperCase()}</div>
          <div>
            <div className="bp-name">{brand}</div>
            <div className="bp-count">{total} {t('brand.itemsWord')}</div>
            {info ? (
              <>
                <div className="bp-meta-row">
                  <span><b>{t('brand.country')}</b>{info.country}</span>
                  <span><b>{t('brand.website')}</b> {info.website}</span>
                </div>
                <p className="bp-desc">{info.description}</p>
              </>
            ) : (
              <p className="bp-noinfo">{t('brand.noInfo')}</p>
            )}
          </div>
        </div>

        <h2 style={{ fontSize: 19, fontWeight: 700, color: 'var(--ink)', marginBottom: 16 }}>
          {t('brand.allProductsPre')}{brand}
        </h2>

        {loading ? (
          <p style={{ color: 'var(--ink-3)' }}>{t('common.loading')}</p>
        ) : parts.length === 0 ? (
          <p style={{ color: 'var(--ink-3)' }}>{t('catalog.notFound')}</p>
        ) : (
          <div className="plp-grid2">
            {parts.map(p => <ProductCard key={p.id} part={p} />)}
          </div>
        )}
      </main>
    </>
  )
}
