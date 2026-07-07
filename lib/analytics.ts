'use client'

export type MetricaGoal =
  | 'SEARCH' | 'SEARCH_VIN' | 'SEARCH_MODEL'
  | 'PDP_VIEW' | 'ADD_TO_CART' | 'REMOVE_FROM_CART' | 'WISHLIST_ADD'
  | 'CHECKOUT_START' | 'ORDER_SUCCESS'
  | 'PODBOR_SUBMIT' | 'LEAD_SUBMIT' | 'CONTACT_CLICK'

export interface EcommerceProduct {
  id: string
  name: string
  price?: number
  brand?: string
  category?: string
  quantity?: number
}

type YmFn = (id: number, action: string, ...args: unknown[]) => void

declare global {
  interface Window {
    ym?: YmFn
    dataLayer?: unknown[]
  }
}

// Read at call time (not module-eval) so it works in both Next's inlined build
// and unit tests that stub the env.
function metricaId(): number {
  return Number(process.env.NEXT_PUBLIC_YANDEX_METRICA_ID) || 0
}

function ym(action: string, ...args: unknown[]): void {
  const id = metricaId()
  if (!id || typeof window === 'undefined' || !window.ym) return
  window.ym(id, action, ...args)
}

export function reachGoal(goal: MetricaGoal, params?: Record<string, unknown>): void {
  if (params) ym('reachGoal', goal, params)
  else ym('reachGoal', goal)
}

export function trackPageView(url: string): void {
  ym('hit', url)
}

export function setVisitParams(params: Record<string, unknown>): void {
  ym('params', params)
}

export function setUserID(userId: string): void {
  ym('setUserID', userId)
}

export function userParams(params: Record<string, unknown>): void {
  ym('userParams', params)
}

export function ecommerce(
  event: 'detail' | 'add' | 'remove' | 'purchase',
  products: EcommerceProduct[],
  actionField?: Record<string, unknown>,
): void {
  if (!metricaId() || typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  const payload: Record<string, unknown> = { products }
  if (actionField) payload.actionField = actionField
  window.dataLayer.push({ ecommerce: { currencyCode: 'KZT', [event]: payload } })
}

export function partProduct(
  p: { id: string; name: string; price: number; brand?: string | null; category?: string | null },
  quantity?: number,
): EcommerceProduct {
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    ...(p.brand ? { brand: p.brand } : {}),
    ...(p.category ? { category: p.category } : {}),
    ...(quantity ? { quantity } : {}),
  }
}
