import { describe, it, expect } from 'vitest'
import { mergeCartItems } from '@/store/cart'
import type { CardPart, CartItem } from '@/types'

const base = {
  oem: null, name: 'Деталь', brand: null, type: 'OEM', category: null, fits: [],
  price_usd: null, vat: 12, eta: 'В наличии', img: null, specs: {}, cross: [],
  rating: 0, reviews: 0, part_stock: [],
}

const item = (over: Partial<CartItem>): CartItem =>
  ({ ...base, id: 'main:1', price: 100, price_b2b: null, qty: 2, stock: {}, ...over }) as CartItem
const fresh = (over: Partial<CardPart>): CardPart =>
  ({ ...base, id: 'main:1', price: 100, price_b2b: null, stock: {}, ...over }) as CardPart

describe('mergeCartItems — cart price refresh (#80 follow-up)', () => {
  it('updates price and price_b2b, keeps qty', () => {
    const out = mergeCartItems(
      [item({ price: 100, price_b2b: null, qty: 3 })],
      [fresh({ price: 120, price_b2b: 90 })],
    )
    expect(out[0].price).toBe(120)
    expect(out[0].price_b2b).toBe(90) // guest→b2b login case: null gets filled in
    expect(out[0].qty).toBe(3)
  })

  it('keeps items the API did not return (removed/inactive parts)', () => {
    const out = mergeCartItems(
      [item({ id: 'main:GONE', price: 100 })],
      [fresh({ id: 'main:OTHER', price: 999 })],
    )
    expect(out[0].price).toBe(100)
    expect(out[0].id).toBe('main:GONE')
  })

  it('strips price_b2b again when the fresh DTO has it nulled (b2b → signed out)', () => {
    const out = mergeCartItems(
      [item({ price_b2b: 90 })],
      [fresh({ price_b2b: null })],
    )
    expect(out[0].price_b2b).toBeNull()
  })

  it('refreshes eta and stock alongside prices', () => {
    const out = mergeCartItems(
      [item({ eta: 'В наличии', stock: { Алматы: 5 } })],
      [fresh({ eta: 'Под заказ 3–5 дней', stock: { Алматы: 0 } })],
    )
    expect(out[0].eta).toBe('Под заказ 3–5 дней')
    expect(out[0].stock).toEqual({ Алматы: 0 })
  })
})
