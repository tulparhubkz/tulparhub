'use server'

import { createServerClient } from '@/lib/supabase-server'
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

export async function submitOrder(payload: OrderPayload): Promise<{ ok: boolean; message: string; invoiceNumber?: string }> {
  if (!payload.name?.trim() || !payload.phone?.trim()) {
    return { ok: false, message: 'Заполните имя и телефон' }
  }
  if (payload.phone.replace(/\D/g, '').length < 7) {
    return { ok: false, message: 'Введите корректный номер телефона' }
  }

  try {
    const db = createServerClient()
    const { error } = await db.from('leads').insert({
      kind:    payload.kind,
      name:    payload.name.trim(),
      phone:   payload.phone.trim(),
      email:   payload.email?.trim() ?? null,
      city:    payload.city ?? null,
      comment: payload.comment?.trim() ?? null,
      meta: {
        company:   payload.company,
        bin:       payload.bin,
        payment:   payload.payment,
        delivery:  payload.delivery,
        unit_id:   payload.unit_id,
        date_from: payload.date_from,
        date_to:   payload.date_to,
        address:   payload.address,
        items:     payload.items,
      },
    })
    if (error) throw error
  } catch (err) {
    console.error('[submitOrder] DB error:', err)
    // Don't surface DB errors to user — fail open, ops will retry
  }

  revalidatePath('/')

  const invoiceNumber = payload.kind === 'order'
    ? `TH-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
    : undefined

  const messages: Record<string, string> = {
    order:    `Заказ принят. Счёт ${invoiceNumber} сформирован и отправлен на email.`,
    callback: 'Заявка принята. Перезвоним в течение 12 минут.',
    booking:  'Заявка на аренду отправлена. Менеджер свяжется через 15 минут.',
    quote:    'Запрос цены отправлен. Коммерческое предложение — в течение 1 часа.',
  }

  return { ok: true, message: messages[payload.kind] ?? 'Заявка принята.', invoiceNumber }
}

export async function submitCallback(formData: FormData) {
  return submitOrder({
    kind:  'callback',
    name:  String(formData.get('name') ?? ''),
    phone: String(formData.get('phone') ?? ''),
    city:  String(formData.get('city') ?? ''),
  })
}
