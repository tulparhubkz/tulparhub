import { describe, it, expect, vi, afterEach } from 'vitest'
import { reachGoal, trackPageView, ecommerce, setVisitParams, partProduct } from '@/lib/analytics'

afterEach(() => {
  vi.unstubAllEnvs()
  delete (globalThis as any).window
})

function withMetrica() {
  vi.stubEnv('NEXT_PUBLIC_YANDEX_METRICA_ID', '99999')
  const ym = vi.fn()
  ;(globalThis as any).window = { ym, dataLayer: [] as unknown[] }
  return ym
}

describe('reachGoal', () => {
  it('forwards the goal and params to window.ym with the tag id', () => {
    const ym = withMetrica()
    reachGoal('ADD_TO_CART', { id: 'p1' })
    expect(ym).toHaveBeenCalledWith(99999, 'reachGoal', 'ADD_TO_CART', { id: 'p1' })
  })

  it('no-ops when the env var is unset', () => {
    const ym = vi.fn()
    ;(globalThis as any).window = { ym }
    reachGoal('SEARCH')
    expect(ym).not.toHaveBeenCalled()
  })

  it('no-ops when window is undefined (SSR)', () => {
    vi.stubEnv('NEXT_PUBLIC_YANDEX_METRICA_ID', '99999')
    expect(() => reachGoal('SEARCH')).not.toThrow()
  })
})

describe('trackPageView / setVisitParams', () => {
  it('sends a hit', () => {
    const ym = withMetrica()
    trackPageView('/ru/catalog')
    expect(ym).toHaveBeenCalledWith(99999, 'hit', '/ru/catalog')
  })
  it('sends visit params', () => {
    const ym = withMetrica()
    setVisitParams({ buyer: 'b2b' })
    expect(ym).toHaveBeenCalledWith(99999, 'params', { buyer: 'b2b' })
  })
})

describe('ecommerce', () => {
  it('pushes a keyed ecommerce object onto dataLayer', () => {
    withMetrica()
    ecommerce('purchase', [partProduct({ id: 'p1', name: 'Фильтр', price: 100, brand: 'X' }, 2)], { id: 'TH-1', revenue: 200 })
    const layer = (globalThis as any).window.dataLayer
    expect(layer.at(-1)).toEqual({
      ecommerce: { currencyCode: 'KZT', purchase: { products: [{ id: 'p1', name: 'Фильтр', price: 100, brand: 'X', quantity: 2 }], actionField: { id: 'TH-1', revenue: 200 } } },
    })
  })
  it('no-ops when the env var is unset', () => {
    ;(globalThis as any).window = { dataLayer: [] as unknown[] }
    ecommerce('add', [partProduct({ id: 'p1', name: 'A', price: 1 })])
    expect((globalThis as any).window.dataLayer).toHaveLength(0)
  })
})
