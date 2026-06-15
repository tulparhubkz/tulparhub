'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartPopup } from '@/store/cartPopup'
import { useCart } from '@/store/cart'
import { fmtKZT } from '@/lib/utils'

export function CartAddedPopup() {
  const { item, hide } = useCartPopup()
  const { items, setQty, removeItem } = useCart()
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (!item) return
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(hide, 6000)
    return () => clearTimeout(timerRef.current)
  }, [item, hide])

  if (!item) return null

  const cartItem = items.find(i => i.id === item.id)
  const qty = cartItem?.qty ?? item.qty

  const changeQty = (delta: number) => {
    const next = qty + delta
    if (next <= 0) removeItem(item.id)
    else setQty(item.id, next)
  }

  return (
    <>
      <div className="cap-backdrop" onClick={hide} />
      <div className="cap-modal">
        <div className="cap-head">
          <h2 className="cap-title">Добавлено в корзину</h2>
          <button className="cap-close" onClick={hide}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="cap-item">
          <div className="cap-img">
            {item.img
              ? <Image src={item.img} alt={item.name} width={72} height={72} style={{ objectFit: 'contain' }} unoptimized />
              : <div className="cap-img-placeholder">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity=".3"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </div>
            }
          </div>
          <div className="cap-meta">
            <div className="cap-brand">{item.brand}</div>
            <div className="cap-name">{item.name}</div>
            <div className="cap-oem">{item.oem}</div>
          </div>
          <div className="cap-right">
            <div className="cap-qty-row">
              <button className="cap-qty-btn" onClick={() => changeQty(-1)}>−</button>
              <span className="cap-qty">{qty}</span>
              <button className="cap-qty-btn" onClick={() => changeQty(1)}>+</button>
            </div>
            <div className="cap-price">{fmtKZT(item.price * qty)}</div>
            <div className="cap-price-unit">1 шт = {fmtKZT(item.price)}</div>
          </div>
        </div>

        <div className="cap-footer">
          <button className="cap-continue" onClick={hide}>Продолжить покупки</button>
          <Link href="/cart" className="cap-go-cart" onClick={hide}>Перейти в корзину →</Link>
        </div>
      </div>
    </>
  )
}
