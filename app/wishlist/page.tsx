'use client'
import Link from 'next/link'
import { useWishlist } from '@/store/wishlist'
import { useCart } from '@/store/cart'
import { PartCard } from '@/components/catalog/PartCard'

export default function WishlistPage() {
  const { items, remove } = useWishlist()
  const { addItem } = useCart()

  return (
    <main className="container" style={{ padding: '32px 0 60px' }}>
      <div className="crumbs" style={{ marginBottom: 20 }}>
        <Link href="/">Главная</Link> / <span>Избранное</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--ink)', margin: 0 }}>Избранное</h1>
        {items.length > 0 && (
          <span style={{ fontSize: 14, color: 'var(--ink-3)' }}>{items.length} товаров</span>
        )}
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--ink-3)' }}>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" style={{ opacity: .3, marginBottom: 16 }}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <p style={{ fontSize: 17, fontWeight: 600, color: 'var(--ink)', marginBottom: 8 }}>Избранное пусто</p>
          <p style={{ fontSize: 14, marginBottom: 24 }}>Нажмите ♡ на карточке товара чтобы сохранить</p>
          <Link href="/catalog" style={{ padding: '11px 24px', background: 'var(--accent)', color: '#fff', borderRadius: 'var(--radius)', textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
            Перейти в каталог
          </Link>
        </div>
      ) : (
        <div className="plp-grid">
          {items.map(part => (
            <PartCard key={part.id} part={part} />
          ))}
        </div>
      )}
    </main>
  )
}
