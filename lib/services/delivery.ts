/**
 * Delivery tariff — the single source of truth shared by the cart (display) and
 * `createOrder` (persistence), so the price the buyer sees can never drift from
 * the price stored on the order / shown on the invoice.
 */

/** Courier is free once the goods total reaches this (KZT). */
export const FREE_COURIER_THRESHOLD = 30_000

/**
 * Delivery cost for a method given the goods subtotal, in KZT.
 * `null` = "рассчитывается менеджером" — an unknown or freight cost we must not
 * invent a number for (it is not added to the order total).
 */
export function deliveryCost(method: string | null | undefined, goodsTotal: number): number | null {
  switch (method) {
    case 'pickup':
      return 0
    case 'courier':
      return goodsTotal >= FREE_COURIER_THRESHOLD ? 0 : 2500
    case 'sdek':
      return 4800
    case 'freight':
      return null
    default:
      return null // unknown method — never invent a charge
  }
}
