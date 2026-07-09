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

describe('toDTO — images', () => {
  const img = { url200: 'https://cdn/200/a.jpg', url800: 'https://cdn/800/a.jpg', url1600: 'https://cdn/1600/a.jpg' }

  it('passes the vendor photos through untouched, in order', () => {
    const second = { url200: 'https://cdn/200/b.jpg', url800: 'https://cdn/800/b.jpg', url1600: 'https://cdn/1600/b.jpg' }
    expect(toDTO(row, [], {}, [img, second]).images).toEqual([img, second])
  })

  it('substitutes a single stand-in when the vendor ships no photo', () => {
    const images = toDTO(row, [], {}, []).images
    expect(images).toHaveLength(1)
    expect(images[0].url200).toMatch(/^https?:\/\//)
  })

  it('repeats the stand-in across sizes — those sources publish one resolution', () => {
    const [only] = toDTO(row, [], {}, []).images
    expect(only.url200).toBe(only.url800)
    expect(only.url800).toBe(only.url1600)
  })

  it('prefers a real photo over the stand-in', () => {
    expect(toDTO(row, [], {}, [img]).images[0].url200).toBe(img.url200)
  })

  it('yields no image when the part classifies to nothing', () => {
    const unknown = { ...row, oem: 'НЕТ', name: 'Совершенно неизвестная запчасть' }
    expect(toDTO(unknown, [], {}, []).images).toEqual([])
  })
})

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
