import { db } from '@/lib/db'
import { orders, orderItems, parts } from '@/lib/db/schema'
import { inArray, eq, desc } from 'drizzle-orm'
import { phoneDigits } from '@/lib/validation'

export const ORDER_STATUSES = ['new', 'confirmed', 'shipped', 'done', 'cancelled'] as const
export type OrderStatus = (typeof ORDER_STATUSES)[number]
export const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded'] as const
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number]

export interface OrderItemInput {
  id: string // part id
  oem?: string
  name: string
  qty: number
  price: number // client-provided; only a fallback — see re-pricing below
}

export interface OrderInput {
  userId?: string | null
  name: string
  phone: string
  email?: string | null
  city?: string | null
  company?: string | null
  bin?: string | null
  delivery?: string | null
  address?: string | null
  comment?: string | null
  payment?: string | null
  items: OrderItemInput[]
}

export interface CreatedOrder {
  id: string
  invoiceNumber: string
  total: number
}

function genInvoice(): string {
  const year = new Date().getFullYear()
  const rand = Math.floor(100000 + Math.random() * 900000) // 6 digits
  return `TH-${year}-${rand}`
}

/**
 * Persist a real order to `orders` + `order_items` (atomic).
 *
 * Line items are re-priced from the catalog so the stored total never trusts a
 * client-supplied price. `name`/`oem` are snapshotted onto the line item so it
 * survives later catalog edits. Returns the goods total (delivery/discount are
 * not persisted yet — see issue #15 follow-ups).
 */
export async function createOrder(input: OrderInput): Promise<CreatedOrder> {
  const clean = (input.items ?? []).filter((i) => i && i.id && i.qty > 0)
  if (clean.length === 0) throw new Error('createOrder: empty order')

  // Re-price from the DB; fall back to the client value only if the part is gone.
  const ids = Array.from(new Set(clean.map((i) => i.id)))
  const rows = await db
    .select({ id: parts.id, oem: parts.oem, name: parts.name, price: parts.price })
    .from(parts)
    .where(inArray(parts.id, ids))
  const byId = new Map(rows.map((r) => [r.id, r]))

  const lineItems = clean.map((i) => {
    const p = byId.get(i.id)
    return {
      partId: p?.id ?? null,
      oem: p?.oem ?? i.oem ?? null,
      name: p?.name ?? i.name,
      qty: i.qty,
      price: p?.price ?? i.price ?? 0,
    }
  })
  const total = lineItems.reduce((a, c) => a + c.price * c.qty, 0)

  // Insert atomically; retry on the (rare) invoice-number collision.
  for (let attempt = 0; attempt < 5; attempt++) {
    const invoiceNumber = genInvoice()
    try {
      const id = await db.transaction(async (tx) => {
        const [o] = await tx
          .insert(orders)
          .values({
            invoiceNumber,
            userId: input.userId ?? null,
            status: 'new',
            paymentStatus: 'pending',
            paymentProvider: input.payment ?? null,
            total,
            customerName: input.name,
            customerPhone: input.phone,
            customerEmail: input.email ?? null,
            city: input.city ?? null,
            company: input.company ?? null,
            bin: input.bin ?? null,
            delivery: input.delivery ?? null,
            address: input.address ?? null,
            comment: input.comment ?? null,
          })
          .returning({ id: orders.id })

        await tx.insert(orderItems).values(lineItems.map((li) => ({ ...li, orderId: o.id })))
        return o.id
      })
      return { id, invoiceNumber, total }
    } catch (err) {
      // 23505 = unique_violation on invoice_number → try a fresh number
      if ((err as { code?: string })?.code === '23505' && attempt < 4) continue
      throw err
    }
  }
  throw new Error('createOrder: could not allocate a unique invoice number')
}

export interface TrackedOrder {
  invoiceNumber: string
  createdAt: string // ISO — serializable across the server-action boundary
  status: string
  paymentStatus: string
  paymentProvider: string | null
  delivery: string | null
  city: string | null
  total: number
  items: Array<{ name: string; oem: string | null; qty: number; price: number }>
}

/**
 * Guest order tracking: invoice number + the phone used at checkout (last 10
 * digits must match, so +7/8 prefixes are interchangeable). Any mismatch —
 * wrong number, wrong phone — returns the same null, so order numbers can't
 * be enumerated.
 */
export async function trackOrderByInvoice(invoiceNumber: string, phone: string): Promise<TrackedOrder | null> {
  const inv = (invoiceNumber ?? '').trim().toUpperCase()
  const digits = phoneDigits(phone)
  if (!/^TH-\d{4}-\d{6}$/.test(inv) || digits.length < 10) return null

  const [o] = await db.select().from(orders).where(eq(orders.invoiceNumber, inv))
  if (!o) return null
  if (phoneDigits(o.customerPhone).slice(-10) !== digits.slice(-10)) return null

  const its = await db.select().from(orderItems).where(eq(orderItems.orderId, o.id))
  return {
    invoiceNumber: o.invoiceNumber,
    createdAt: o.createdAt.toISOString(),
    status: o.status,
    paymentStatus: o.paymentStatus,
    paymentProvider: o.paymentProvider,
    delivery: o.delivery,
    city: o.city,
    total: o.total,
    items: its.map((it) => ({ name: it.name, oem: it.oem, qty: it.qty, price: it.price })),
  }
}

/** Full order + line items by UUID — for the invoice document (id is unguessable). */
export async function getOrderWithItems(id: string) {
  if (!id || id.length < 30) return null // UUIDs only; cheap junk filter
  const [o] = await db.select().from(orders).where(eq(orders.id, id))
  if (!o) return null
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, o.id))
  return { ...o, items }
}

export interface OrderLineItem {
  id: string
  name: string
  oem: string | null
  qty: number
  price: number
}

export interface OrderListItem {
  id: string
  invoiceNumber: string
  createdAt: Date
  customerName: string
  customerPhone: string
  customerEmail: string | null
  company: string | null
  city: string | null
  delivery: string | null
  paymentProvider: string | null
  status: string
  paymentStatus: string
  total: number
  items: OrderLineItem[]
}

/** A signed-in user's own orders, newest first — for «Мои заказы». */
export async function listUserOrders(userId: string, limit = 50): Promise<OrderListItem[]> {
  if (!userId) return []
  const os = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt))
    .limit(limit)
  return attachItems(os)
}

/** Most-recent orders with their line items, for the admin panel. */
export async function listOrders(limit = 100): Promise<OrderListItem[]> {
  const os = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(limit)
  return attachItems(os)
}

async function attachItems(os: (typeof orders.$inferSelect)[]): Promise<OrderListItem[]> {
  if (os.length === 0) return []

  const its = await db
    .select()
    .from(orderItems)
    .where(inArray(orderItems.orderId, os.map((o) => o.id)))

  const byOrder = new Map<string, OrderLineItem[]>()
  for (const it of its) {
    const arr = byOrder.get(it.orderId) ?? []
    arr.push({ id: it.id, name: it.name, oem: it.oem, qty: it.qty, price: it.price })
    byOrder.set(it.orderId, arr)
  }

  return os.map((o) => ({
    id: o.id,
    invoiceNumber: o.invoiceNumber,
    createdAt: o.createdAt,
    customerName: o.customerName,
    customerPhone: o.customerPhone,
    customerEmail: o.customerEmail,
    company: o.company,
    city: o.city,
    delivery: o.delivery,
    paymentProvider: o.paymentProvider,
    status: o.status,
    paymentStatus: o.paymentStatus,
    total: o.total,
    items: byOrder.get(o.id) ?? [],
  }))
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  if (!ORDER_STATUSES.includes(status)) throw new Error(`updateOrderStatus: invalid status "${status}"`)
  await db.update(orders).set({ status }).where(eq(orders.id, id))
}

export async function updateOrderPayment(id: string, paymentStatus: PaymentStatus) {
  if (!PAYMENT_STATUSES.includes(paymentStatus)) throw new Error(`updateOrderPayment: invalid payment status "${paymentStatus}"`)
  await db.update(orders).set({ paymentStatus }).where(eq(orders.id, id))
}
