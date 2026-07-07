'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, CardPart } from '@/types'
import { useCartPopup } from './cartPopup'
import { reachGoal, ecommerce, partProduct } from '@/lib/analytics'

interface CartStore {
  items: CartItem[]
  city: string
  /** opts.b2b: the buyer was looking at the wholesale price — show it in the popup too. */
  addItem: (part: CardPart, qty?: number, opts?: { b2b?: boolean }) => void
  removeItem: (id: string) => void
  setQty: (id: string, qty: number) => void
  /** Merge fresh catalog data into stored items (price refresh — see below). */
  refreshItems: (fresh: CardPart[]) => void
  clearCart: () => void
  setCity: (city: string) => void
}

// Persisted cart items go stale: prices change between visits, and a guest who
// signs in as B2B has items captured with price_b2b: null. Refresh money- and
// availability-fields from the API while keeping qty and unknown items as-is.
export function mergeCartItems(items: CartItem[], fresh: CardPart[]): CartItem[] {
  const byId = new Map(fresh.map((p) => [p.id, p]))
  return items.map((i) => {
    const p = byId.get(i.id)
    if (!p) return i // part gone/inactive — keep the stored snapshot
    return { ...i, price: p.price, price_b2b: p.price_b2b, eta: p.eta, stock: p.stock ?? i.stock }
  })
}

export const useCart = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      city: 'Алматы',
      addItem: (part, qty = 1, opts) => {
        set((s) => {
          const existing = s.items.find((i) => i.id === part.id)
          if (existing) {
            return { items: s.items.map((i) => i.id === part.id ? { ...i, qty: i.qty + qty } : i) }
          }
          return { items: [...s.items, { ...part, qty }] }
        })
        useCartPopup.getState().show({
          id: part.id,
          name: part.name,
          oem: part.oem ?? '',
          brand: part.brand ?? '',
          price: opts?.b2b && part.price_b2b ? part.price_b2b : part.price,
          qty,
          img: part.img ?? undefined,
        })
        reachGoal('ADD_TO_CART', { id: part.id, qty })
        ecommerce('add', [partProduct(part, qty)])
      },
      removeItem: (id) =>
        set((s) => {
          const item = s.items.find((i) => i.id === id)
          if (item) {
            reachGoal('REMOVE_FROM_CART', { id })
            ecommerce('remove', [partProduct(item, item.qty)])
          }
          return { items: s.items.filter((i) => i.id !== id) }
        }),
      setQty: (id, qty) =>
        set((s) => {
          if (qty === 0) {
            const item = s.items.find((i) => i.id === id)
            if (item) {
              reachGoal('REMOVE_FROM_CART', { id })
              ecommerce('remove', [partProduct(item, item.qty)])
            }
            return { items: s.items.filter((i) => i.id !== id) }
          }
          return { items: s.items.map((i) => (i.id === id ? { ...i, qty } : i)) }
        }),
      refreshItems: (fresh) => set((s) => ({ items: mergeCartItems(s.items, fresh) })),
      clearCart: () => set({ items: [] }),
      setCity: (city) => set({ city }),
    }),
    { name: 'tulparhub-cart' }
  )
)

export const useCartCount = () => useCart((s) => s.items.reduce((a, b) => a + b.qty, 0))
