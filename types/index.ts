export interface EquipmentType {
  id: string
  ru: string
  en?: string
  count: number
}

export interface Brand {
  id: string
  name: string
  country: string
  models: number
}

export interface Model {
  id: string
  brand_id: string
  name: string
  years: string
  cls: string
}

export interface System {
  id: string
  ru: string
  icon: string
  count: number
}

export interface Part {
  id: string
  oem: string
  name: string
  brand: string
  type: 'OEM' | 'Aftermarket'
  category: string
  fits: string[]
  price: number
  priceUSD: number
  vat: number
  stock: Record<string, number>
  eta: string
  img: string
  specs: Record<string, string>
  cross: string[]
  rating: number
  reviews: number
}

export interface RentalUnit {
  id: string
  name: string
  brand: string
  year: number
  type: string
  img: string
  specs: Record<string, string>
  rates: { shift: number; day: number; week: number; month: number }
  city: string
  operator: boolean
  delivery: string
  available: string
  condition: string
  hours: number
}

export interface City {
  id: string
  name: string
  country: string
  currency: string
  symbol: string
}

export interface CartItem extends Part {
  qty: number
}
