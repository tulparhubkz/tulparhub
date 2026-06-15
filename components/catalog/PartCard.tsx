'use client'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Btn } from '@/components/ui/Btn'
import { Ico } from '@/components/ui/Ico'
import { Placeholder } from '@/components/ui/Placeholder'
import { Price } from '@/components/ui/Price'
import { useCart } from '@/store/cart'
import { useWishlist } from '@/store/wishlist'
import type { Part } from '@/types'

export function PartCard({ part }: { part: Part }) {
  const { items, addItem } = useCart()
  const toggle = useWishlist(s => s.toggle)
  const inWish = useWishlist(s => s.items.some(i => i.id === part.id))
  const inCart = items.some((i) => i.id === part.id)
  const cityStock = part.stock['Алматы'] ?? 0

  return (
    <div className="part-card">
      <button
        className="part-fav"
        style={inWish ? { color: '#e53e3e' } : {}}
        onClick={() => toggle(part)}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill={inWish ? '#e53e3e' : 'none'} stroke={inWish ? '#e53e3e' : 'currentColor'} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
      </button>
      <div className="part-badges">
        <Badge tone={part.type === 'OEM' ? 'oem' : 'aft'}>{part.type}</Badge>
        {cityStock > 0
          ? <Badge tone="ok">Алматы · в наличии</Badge>
          : <Badge tone="warn">Под заказ</Badge>}
      </div>
      <Link href={`/catalog/${part.id}`} className="part-thumb">
        <Placeholder label={part.img} ratio="4/3" />
      </Link>
      <div className="part-body">
        <div className="part-oem">{part.oem}</div>
        <Link href={`/catalog/${part.id}`} className="part-name">{part.name}</Link>
        <div className="part-fits">
          Подходит: {part.fits.slice(0, 2).join(', ')}
          {part.fits.length > 2 ? ` +${part.fits.length - 2}` : ''}
        </div>
        <div className="part-meta">
          <span className="part-brand">{part.brand}</span>
        </div>
        <div className="part-foot">
          <Price value={part.price} vat={part.vat} />
          <Btn
            icon={inCart ? 'check' : 'cart'}
            size="sm"
            variant={inCart ? 'success' : 'primary'}
            onClick={() => addItem(part)}
          >
            {inCart ? 'В корзине' : 'В корзину'}
          </Btn>
        </div>
      </div>
    </div>
  )
}
