'use server'

import { createLead } from '@/lib/services/leads'
import { createOrder, trackOrderByInvoice, type TrackedOrder } from '@/lib/services/orders'
import { notifyOps, formatOrderMessage, formatLeadMessage } from '@/lib/notify'
import { isValidPhone, isValidEmail } from '@/lib/validation'
import { rateLimit, clientIpFrom } from '@/lib/rateLimit'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import type { TranslationKey } from '@/lib/i18n/dictionaries'

// Results carry a translation key (+ ICU params), not prose — the UI runs in
// three locales and renders them via t(message, params). See issue #69.
export interface ActionResult {
  ok: boolean
  message: TranslationKey
  params?: Record<string, string>
  invoiceNumber?: string
  total?: number
  orderId?: string
}

export interface OrderPayload {
  kind: 'order' | 'callback' | 'booking' | 'quote'
  name: string
  phone: string
  email?: string
  city?: string
  comment?: string
  company?: string
  bin?: string
  payment?: string
  delivery?: string
  items?: Array<{ id: string; oem: string; name: string; qty: number; price: number }>
  unit_id?: string
  date_from?: string
  date_to?: string
  address?: string
}

export async function submitOrder(payload: OrderPayload): Promise<ActionResult> {
  // Per-IP throttle: spam must not reach the DB or the ops Telegram chat (#68).
  if (!rateLimit(`submit:${clientIpFrom(headers())}`, { limit: 5, windowMs: 60_000 })) {
    return { ok: false, message: 'act.rateLimited' }
  }
  if (!payload.name?.trim() || !payload.phone?.trim()) {
    return { ok: false, message: 'act.fillNamePhone' }
  }
  if (!isValidPhone(payload.phone)) {
    return { ok: false, message: 'act.badPhone' }
  }
  if (payload.email?.trim() && !isValidEmail(payload.email)) {
    return { ok: false, message: 'act.badEmail' }
  }

  // Real orders are persisted to orders/order_items; failures are surfaced so a
  // customer never sees "accepted" for an order that wasn't saved.
  if (payload.kind === 'order') {
    if (!payload.items?.length) {
      return { ok: false, message: 'act.emptyCart' }
    }
    // Attach the signed-in user if there is a session (guest checkout otherwise).
    let userId: string | null = null
    let sessionEmail: string | null = null
    try {
      const session = await auth()
      userId = session?.user?.id ?? null
      sessionEmail = session?.user?.email ?? null
    } catch {
      /* auth not configured / no session — proceed as guest */
    }

    try {
      const order = await createOrder({
        userId,
        name:     payload.name.trim(),
        phone:    payload.phone.trim(),
        email:    payload.email?.trim() || sessionEmail || null,
        city:     payload.city ?? null,
        company:  payload.company ?? null,
        bin:      payload.bin ?? null,
        delivery: payload.delivery ?? null,
        address:  payload.address ?? null,
        comment:  payload.comment?.trim() ?? null,
        payment:  payload.payment ?? null,
        items:    payload.items,
      })
      // Fire-and-forget: a Telegram outage must never block or fail a checkout.
      void notifyOps(formatOrderMessage({
        invoiceNumber: order.invoiceNumber,
        total: order.total,
        name: payload.name.trim(),
        phone: payload.phone.trim(),
        email: payload.email?.trim() || null,
        payment: payload.payment,
        delivery: payload.delivery,
        company: payload.company,
        bin: payload.bin,
        city: payload.city,
        comment: payload.comment,
        items: (payload.items ?? []).map((i) => ({ name: i.name, qty: i.qty })),
      }))

      revalidatePath('/')
      return {
        ok: true,
        message: 'act.orderAccepted',
        params: { num: order.invoiceNumber },
        invoiceNumber: order.invoiceNumber,
        total: order.total,
        orderId: order.id,
      }
    } catch (err) {
      console.error('[submitOrder] order error:', err)
      return { ok: false, message: 'act.orderFailed' }
    }
  }

  // Lightweight leads (callback / booking / quote) — fail open, ops will retry.
  try {
    await createLead({
      kind:    payload.kind,
      name:    payload.name.trim(),
      phone:   payload.phone.trim(),
      email:   payload.email?.trim() ?? null,
      city:    payload.city ?? null,
      comment: payload.comment?.trim() ?? null,
      company:   payload.company,
      bin:       payload.bin,
      payment:   payload.payment,
      delivery:  payload.delivery,
      unit_id:   payload.unit_id,
      date_from: payload.date_from,
      date_to:   payload.date_to,
      address:   payload.address,
      items:     payload.items,
    })
  } catch (err) {
    console.error('[submitOrder] lead error:', err)
  }

  void notifyOps(formatLeadMessage({
    kind: payload.kind,
    name: payload.name.trim(),
    phone: payload.phone.trim(),
    city: payload.city,
    comment: payload.comment,
    unitId: payload.unit_id,
    dates: payload.date_from ? `${payload.date_from} → ${payload.date_to ?? '…'}` : null,
  }))

  revalidatePath('/')

  const messages: Record<string, TranslationKey> = {
    callback: 'act.callbackOk',
    booking:  'act.bookingOk',
    quote:    'act.quoteOk',
  }

  return { ok: true, message: messages[payload.kind] ?? 'act.leadOk' }
}

export async function trackOrder(
  invoiceNumber: string,
  phone: string,
): Promise<{ found: boolean; order?: TrackedOrder }> {
  // Same shape as a miss — a rate-limited prober learns nothing (#68).
  if (!rateLimit(`track:${clientIpFrom(headers())}`, { limit: 20, windowMs: 60_000 })) {
    return { found: false }
  }
  try {
    const order = await trackOrderByInvoice(invoiceNumber, phone)
    return order ? { found: true, order } : { found: false }
  } catch (err) {
    console.error('[trackOrder] error:', err)
    return { found: false } // uniform response — no enumeration, no error detail
  }
}

export async function submitCallback(formData: FormData) {
  return submitOrder({
    kind:  'callback',
    name:  String(formData.get('name') ?? ''),
    phone: String(formData.get('phone') ?? ''),
    city:  String(formData.get('city') ?? ''),
  })
}
