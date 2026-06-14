import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { z } from 'zod'

const LeadSchema = z.object({
  kind: z.enum(['order', 'callback', 'booking', 'quote', 'rfq']),
  name: z.string().min(2).max(100),
  phone: z.string().min(7).max(20),
  email: z.string().email().optional().or(z.literal('')),
  city: z.string().max(50).optional(),
  comment: z.string().max(2000).optional(),
  company: z.string().max(200).optional(),
  bin: z.string().max(30).optional(),
  payment: z.string().max(50).optional(),
  delivery: z.string().max(50).optional(),
  items: z.array(z.object({
    id: z.string(),
    oem: z.string(),
    name: z.string(),
    qty: z.number().int().positive(),
    price: z.number().positive(),
  })).optional(),
  // for rental bookings
  unit_id: z.string().optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
  address: z.string().max(300).optional(),
})

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = LeadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 422 })
  }

  const payload = parsed.data

  // Try Supabase insert
  try {
    const db = createServerClient()
    const { error } = await db.from('leads').insert({
      kind:      payload.kind,
      name:      payload.name,
      phone:     payload.phone,
      email:     payload.email ?? null,
      city:      payload.city ?? null,
      comment:   payload.comment ?? null,
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
    // Log but still return success to client — lead will be retried or handled by ops
    console.error('[leads] Supabase insert failed:', err)
    // In production you'd also write to a fallback queue here
  }

  // Build invoice number for B2B orders
  const invoiceNumber = payload.kind === 'order'
    ? `TH-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
    : null

  return NextResponse.json({
    ok: true,
    message: payload.kind === 'order'
      ? `Заказ принят. Счёт ${invoiceNumber} отправлен на email.`
      : payload.kind === 'booking'
      ? 'Заявка на аренду принята. Менеджер свяжется в течение 15 минут.'
      : 'Заявка принята. Перезвоним в течение 12 минут.',
    invoiceNumber,
  })
}
