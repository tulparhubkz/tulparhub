'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, CardPart } from '@/types'
import { useCartPopup } from './cartPopup'

interface CartStore {
  items: CartItem[]
  city: string
  /** opts.b2b: the buyer was looking at the wholesale price — show it in the popup too. */
  addItem: (part: CardPart, qty?: number, opts?: { b2b?: boolean }) => void
  removeItem: (id: string) => void
  setQty: (id: string, qty: number) => void
  clearCart: () => void
  setCity: (city: string) => void
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
      },
      removeItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      setQty: (id, qty) =>
        set((s) => ({
          items: qty === 0
            ? s.items.filter((i) => i.id !== id)
            : s.items.map((i) => i.id === id ? { ...i, qty } : i),
        })),
      clearCart: () => set({ items: [] }),
      setCity: (city) => set({ city }),
    }),
    { name: 'tulparhub-cart' }
  )
)

export const useCartCount = () => useCart((s) => s.items.reduce((a, b) => a + b.qty, 0))
