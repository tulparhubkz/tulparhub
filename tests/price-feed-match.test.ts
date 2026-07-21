import { describe, it, expect } from 'vitest'
import { matchFeed, joinKey, type CatalogPart } from '@/lib/services/priceFeed'
import type { PriceFeed, PriceRow } from '@/lib/import/priceFeed'

function feed(rows: Array<Partial<PriceRow>>): PriceFeed {
  return {
    city: 'Алматы',
    pricedOn: '2026-07-17',
    skipped: [],
    rows: rows.map((r) => ({
      name: r.name ?? 'part',
      brand: r.brand ?? 'ELRING',
      article: r.article ?? '000',
      qty: r.qty ?? 0,
      priceB2b: r.priceB2b ?? 100,
    })),
  }
}

describe('joinKey', () => {
  it('normalizes case and surrounding whitespace', () => {
    expect(joinKey(' 61-34190-10 ', ' victor reinz ')).toBe('61-34190-10|VICTOR REINZ')
  })
  it('tolerates a null brand', () => {
    expect(joinKey('X1', null)).toBe('X1|')
  })
})

describe('matchFeed', () => {
  const catalog: CatalogPart[] = [
    { id: 'main:1', oem: '61-34190-10', brand: 'VICTOR REINZ' },
    { id: 'main:2', oem: '279.660', brand: 'ELRING' },
    { id: 'main:3', oem: 'CU 2184', brand: 'MANN-FILTER' },
  ]

  it('matches on (article, brand) and collects price + qty', () => {
    const m = matchFeed(
      feed([
        { article: '61-34190-10', brand: 'VICTOR REINZ', priceB2b: 14383, qty: 2 },
        { article: '279.660', brand: 'ELRING', priceB2b: 119892, qty: 5 },
      ]),
      catalog,
    )
    expect(m.matchedRows).toBe(2)
    expect(m.priceByPart.get('main:1')).toBe(14383)
    expect(m.qtyByPart.get('main:1')).toBe(2)
    expect(m.priceByPart.get('main:2')).toBe(119892)
    expect(m.unmatched).toEqual([])
  })

  it('matches despite case and whitespace differences', () => {
    const m = matchFeed(feed([{ article: 'cu 2184', brand: 'mann-filter', priceB2b: 6700, qty: 1 }]), catalog)
    expect(m.priceByPart.get('main:3')).toBe(6700)
  })

  it('reports rows with no catalogue part as unmatched, not an error', () => {
    const m = matchFeed(
      feed([
        { article: '61-34190-10', brand: 'VICTOR REINZ', priceB2b: 1, qty: 1 },
        { article: '139588.686', brand: 'PROPARTS', priceB2b: 999, qty: 3 },
      ]),
      catalog,
    )
    expect(m.matchedRows).toBe(1)
    expect(m.unmatched).toEqual([{ brand: 'PROPARTS', article: '139588.686' }])
  })

  it('fans a shared (article, brand) out to every part that has it', () => {
    const dup: CatalogPart[] = [
      { id: 'main:a', oem: '804.980', brand: 'ELRING' },
      { id: 'main:b', oem: '804.980', brand: 'ELRING' },
    ]
    const m = matchFeed(feed([{ article: '804.980', brand: 'ELRING', priceB2b: 134, qty: 24 }]), dup)
    expect(m.matchedRows).toBe(1)
    expect(m.priceByPart.get('main:a')).toBe(134)
    expect(m.priceByPart.get('main:b')).toBe(134)
    expect(m.qtyByPart.size).toBe(2)
  })

  it('lets the last row win when the feed repeats a key', () => {
    const m = matchFeed(
      feed([
        { article: '279.660', brand: 'ELRING', priceB2b: 100, qty: 1 },
        { article: '279.660', brand: 'ELRING', priceB2b: 200, qty: 9 },
      ]),
      catalog,
    )
    expect(m.priceByPart.get('main:2')).toBe(200)
    expect(m.qtyByPart.get('main:2')).toBe(9)
  })

  it('ignores catalogue parts that have no OEM article', () => {
    const m = matchFeed(feed([{ article: '', brand: 'ELRING', priceB2b: 1, qty: 1 }]), [
      { id: 'main:x', oem: null, brand: 'ELRING' },
    ])
    expect(m.matchedRows).toBe(0)
    expect(m.priceByPart.size).toBe(0)
  })
})
