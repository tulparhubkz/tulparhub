'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Part } from '@/types'

interface WishlistStore {
  items: Part[]
  toggle: (part: Part) => void
  has: (id: string) => boolean
  remove: (id: string) => void
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (part) => {
        const exists = get().items.some(i => i.id === part.id)
        set(s => ({
          items: exists
            ? s.items.filter(i => i.id !== part.id)
            : [part, ...s.items],
        }))
      },
      has: (id) => get().items.some(i => i.id === id),
      remove: (id) => set(s => ({ items: s.items.filter(i => i.id !== id) })),
    }),
    { name: 'tulpar-wishlist' }
  )
)
