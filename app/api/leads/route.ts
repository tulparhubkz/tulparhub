import { NextRequest, NextResponse } from 'next/server'
import { createLead } from '@/lib/services/leads'
import { z } from 'zod'

// Real orders go through the submitOrder server action (app/actions.ts), which
// persists to orders/order_items with server-side re-pricing. This endpoint
// only takes lightweight leads — it must not pretend to create orders.
const LeadSchema = z.object({
  kind: z.enum(['callback', 'booking', 'quote', 'rfq']),
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

  try {
    await createLead(payload)
  } catch (err) {
    // Log but still return success to client — ops will follow up / retry.
    console.error('[leads] insert failed:', err)
  }

  return NextResponse.json({
    ok: true,
    message: payload.kind === 'booking'
      ? 'Заявка на аренду принята. Менеджер свяжется в течение 15 минут.'
      : 'Заявка принята. Перезвоним в течение 12 минут.',
  })
}
