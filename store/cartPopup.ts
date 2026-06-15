'use client'
import { create } from 'zustand'

export interface CartPopupItem {
  id: string
  name: string
  oem: string
  brand: string
  price: number
  qty: number
  img?: string
}

interface CartPopupStore {
  item: CartPopupItem | null
  show: (item: CartPopupItem) => void
  hide: () => void
}

export const useCartPopup = create<CartPopupStore>((set) => ({
  item: null,
  show: (item) => set({ item }),
  hide: () => set({ item: null }),
}))
