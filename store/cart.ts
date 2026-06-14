'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Part } from '@/types'

interface CartStore {
  items: CartItem[]
  city: string
  lang: string
  addItem: (part: Part, qty?: number) => void
  removeItem: (id: string) => void
  setQty: (id: string, qty: number) => void
  clearCart: () => void
  setCity: (city: string) => void
  setLang: (lang: string) => void
}

export const useCart = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      city: 'Алматы',
      lang: 'RU',
      addItem: (part, qty = 1) =>
        set((s) => {
          const existing = s.items.find((i) => i.id === part.id)
          if (existing) {
            return { items: s.items.map((i) => i.id === part.id ? { ...i, qty: i.qty + qty } : i) }
          }
          return { items: [...s.items, { ...part, qty }] }
        }),
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
      setLang: (lang) => set({ lang }),
    }),
    { name: 'tulparhub-cart' }
  )
)

export const useCartCount = () => useCart((s) => s.items.reduce((a, b) => a + b.qty, 0))
