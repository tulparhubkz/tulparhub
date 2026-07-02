import { describe, it, expect } from 'vitest'
import { toDTO } from '@/lib/services/parts'

const row = {
  id: 'main:123',
  vendorId: 'main',
  vendorSku: '123',
  oem: '91-00254',
  name: 'Фильтр масляный',
  brand: 'MANN',
  type: 'OEM',
  category: 'filters',
  fits: ['KAMAZ 6520'],
  price: 50_000,
  priceB2b: 41_000,
  priceUsd: 106,
  vat: 12,
  eta: 'В наличии',
  img: 'filters',
  specs: { Бренд: 'MANN' },
  cross: ['91-00254'],
  rating: 0,
  reviews: 0,
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
} as Parameters<typeof toDTO>[0]

describe('toDTO — wholesale price gating (#49)', () => {
  it('strips price_b2b for guests/retail (default)', () => {
    const dto = toDTO(row, [])
    expect(dto.price_b2b).toBeNull()
    expect(dto.price).toBe(50_000) // retail always present
  })

  it('includes price_b2b for b2b/admin viewers', () => {
    expect(toDTO(row, [], { b2b: true }).price_b2b).toBe(41_000)
  })

  it('keeps the legacy contract shape (snake_case keys, nested part_stock)', () => {
    const dto = toDTO(row, [{ city: 'Алматы', qty: 3 }], { b2b: false })
    expect(dto.part_stock).toEqual([{ city: 'Алматы', qty: 3 }])
    expect(Object.keys(dto)).toContain('price_b2b') // key present, value null — clients use `||` fallbacks
  })
})
