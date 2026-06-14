'use client'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Btn } from '@/components/ui/Btn'
import { Ico } from '@/components/ui/Ico'
import { Placeholder } from '@/components/ui/Placeholder'
import { Price } from '@/components/ui/Price'
import { useCart } from '@/store/cart'
import type { Part } from '@/types'

export function PartCard({ part }: { part: Part }) {
  const { items, addItem } = useCart()
  const inCart = items.some((i) => i.id === part.id)
  const cityStock = part.stock['Алматы'] ?? 0

  return (
    <div className="part-card">
      <button className="part-fav"><Ico name="heart" size={14} /></button>
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
          <span className="part-rating">
            <Ico name="star" size={12} /> {part.rating} · {part.reviews}
          </span>
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
