'use server'

import { createLead } from '@/lib/services/leads'
import { createOrder, trackOrderByInvoice, type TrackedOrder } from '@/lib/services/orders'
import { notifyOps, formatOrderMessage, formatLeadMessage } from '@/lib/notify'
import { isValidPhone, isValidEmail } from '@/lib/validation'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

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

export async function submitOrder(payload: OrderPayload): Promise<{ ok: boolean; message: string; invoiceNumber?: string; total?: number; orderId?: string }> {
  if (!payload.name?.trim() || !payload.phone?.trim()) {
    return { ok: false, message: 'Заполните имя и телефон' }
  }
  if (!isValidPhone(payload.phone)) {
    return { ok: false, message: 'Введите корректный номер телефона' }
  }
  if (payload.email?.trim() && !isValidEmail(payload.email)) {
    return { ok: false, message: 'Введите корректный email' }
  }

  // Real orders are persisted to orders/order_items; failures are surfaced so a
  // customer never sees "accepted" for an order that wasn't saved.
  if (payload.kind === 'order') {
    if (!payload.items?.length) {
      return { ok: false, message: 'Корзина пуста' }
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
        message: `Заказ принят. Счёт ${order.invoiceNumber} сформирован.`,
        invoiceNumber: order.invoiceNumber,
        total: order.total,
        orderId: order.id,
      }
    } catch (err) {
      console.error('[submitOrder] order error:', err)
      return { ok: false, message: 'Не удалось оформить заказ. Попробуйте ещё раз или позвоните нам.' }
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

  const messages: Record<string, string> = {
    callback: 'Заявка принята. Перезвоним в течение 12 минут.',
    booking:  'Заявка на аренду отправлена. Менеджер свяжется через 15 минут.',
    quote:    'Запрос цены отправлен. Коммерческое предложение — в течение 1 часа.',
  }

  return { ok: true, message: messages[payload.kind] ?? 'Заявка принята.' }
}

export async function trackOrder(
  invoiceNumber: string,
  phone: string,
): Promise<{ found: boolean; order?: TrackedOrder }> {
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
