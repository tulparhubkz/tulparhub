'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { fmtKZT } from '@/lib/utils'
import { useCart } from '@/store/cart'
import { useWishlist } from '@/store/wishlist'

// Shared product card (the Autopiter-style ".card"). Used by the catalog,
// wishlist and brand pages so there is one card to maintain.
const imgCache = new Map<string, string | null>()

function usePartImage(oem: string, name: string) {
  const key = oem || name
  const [url, setUrl] = useState<string | null>(imgCache.has(key) ? imgCache.get(key)! : null)
  useEffect(() => {
    if (imgCache.has(key)) {
      setUrl(imgCache.get(key) ?? null)
      return
    }
    const p = new URLSearchParams()
    if (oem) p.set('oem', oem)
    if (name) p.set('name', name)
    fetch(`/api/part-image?${p}`)
      .then((r) => r.json())
      .then((d) => {
        imgCache.set(key, d.url ?? null)
        setUrl(d.url ?? null)
      })
      .catch(() => imgCache.set(key, null))
  }, [key, oem, name])
  return url
}

export function ProductCard({ part, b2b = false }: { part: any; b2b?: boolean }) {
  const router = useRouter()
  const { items, addItem } = useCart()
  const toggle = useWishlist((s) => s.toggle)
  const inWish = useWishlist((s) => s.items.some((i) => i.id === part.id))
  const inCart = items.some((i) => i.id === part.id)
  const price = b2b ? part.price_b2b || part.price : part.price
  const stockMap: Record<string, number> = part.stock ?? {}
  const totalQty = Object.values(stockMap).reduce((a: number, b: number) => a + b, 0)
  const isOEM = (part.type || '').toUpperCase() === 'OEM'
  const imgUrl = usePartImage(part.oem ?? '', part.name ?? '')

  return (
    <div className="card" onClick={() => router.push(`/catalog/${part.id}`)} style={{ cursor: 'pointer' }}>
      <div className="card-img">
        {imgUrl ? (
          <Image src={imgUrl} alt={part.name} fill sizes="(max-width:560px) 100vw, 25vw" style={{ objectFit: 'contain', padding: 8 }} unoptimized />
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,var(--surf-2),#e8edf5)' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="1.2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
          </div>
        )}
        <span className="brandchip" style={{ fontFamily: 'var(--font-jetbrains),monospace' }}>{part.brand}</span>
        <button className={`fav${inWish ? ' active' : ''}`} onClick={(e) => { e.stopPropagation(); toggle({ ...part, stock: stockMap }) }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill={inWish ? '#e53e3e' : 'none'} stroke={inWish ? '#e53e3e' : 'currentColor'} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
        </button>
      </div>
      <div className="card-body">
        <div className="card-badges">
          <span className={`badge ${isOEM ? 'oem' : 'analog'}`}>{isOEM ? 'OEM' : 'Аналог'}</span>
          {totalQty > 0 ? (
            <span className="badge stock"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg> В наличии</span>
          ) : (
            <span className="badge" style={{ background: 'var(--surf-2)', color: 'var(--ink-3)' }}>Под заказ</span>
          )}
        </div>
        <div className="card-art">{part.oem}</div>
        <div className="card-name">{part.name}</div>
        <div className="card-brand">{part.brand}</div>
        <div className="card-foot">
          <div className="card-price">
            <span className="now">{fmtKZT(price)}</span>
            <span className="unit">с НДС · за шт</span>
          </div>
          <button className="buy" onClick={(e) => { e.stopPropagation(); addItem({ ...part, stock: stockMap }, 1) }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
            {inCart ? 'В корзине' : 'В корзину'}
          </button>
        </div>
      </div>
    </div>
  )
}
