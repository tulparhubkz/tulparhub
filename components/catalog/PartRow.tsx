'use client'
import Link from 'next/link'
import { Btn } from '@/components/ui/Btn'
import { Placeholder } from '@/components/ui/Placeholder'
import { Price } from '@/components/ui/Price'
import { useCart } from '@/store/cart'
import type { Part } from '@/types'

export function PartRow({ part, showVAT }: { part: Part; showVAT: boolean }) {
  const { items, addItem } = useCart()
  const inCart = items.some((i) => i.id === part.id)

  return (
    <div className="part-row">
      <Link href={`/catalog/${part.id}`} className="prow-thumb">
        <Placeholder label={part.img} ratio="1" />
      </Link>
      <div className="prow-info">
        <div className="prow-oem">{part.oem}</div>
        <Link href={`/catalog/${part.id}`} className="prow-name">{part.name}</Link>
        <div className="prow-brand">{part.brand} · {part.type}</div>
        <div className="prow-fits">Подходит: {part.fits.join(', ')}</div>
      </div>
      <div className="prow-specs">
        {Object.entries(part.specs).slice(0, 3).map(([k, v]) => (
          <div key={k} className="prow-spec"><span>{k}</span><b>{v}</b></div>
        ))}
      </div>
      <div className="prow-stock">
        {Object.entries(part.stock).map(([c, n]) => (
          <div key={c} className={`prow-st ${n > 5 ? 'ok' : n > 0 ? 'low' : 'no'}`}>
            <span className="prow-st-dot" />
            <span>{c}</span>
            <b>{n > 0 ? `${n} шт` : '—'}</b>
          </div>
        ))}
      </div>
      <div className="prow-cta">
        <Price value={part.price} vat={part.vat} showVAT={showVAT} size="sm" />
        <Btn icon={inCart ? 'check' : 'cart'} size="sm" full variant={inCart ? 'success' : 'primary'} onClick={() => addItem(part)}>
          {inCart ? 'В корзине' : 'В корзину'}
        </Btn>
        <button className="prow-list">+ Список запроса</button>
      </div>
    </div>
  )
}
