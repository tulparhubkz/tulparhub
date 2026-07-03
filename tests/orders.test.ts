import { describe, it, expect, vi, beforeEach } from 'vitest'
import { orders as ordersTable, orderItems as orderItemsTable } from '@/lib/db/schema'

// In-memory stand-in for the Drizzle client. Selects are answered from a FIFO
// queue (one entry per expected query); inserts are captured for assertions.
const h = vi.hoisted(() => ({
  selectQueue: [] as unknown[][],
  selectCalls: 0,
  inserted: [] as Array<{ table: unknown; values: unknown }>,
  failReturningTimes: 0, // simulate unique_violation on the order insert N times
}))

vi.mock('@/lib/db', () => {
  const select = () => ({
    from: () => {
      h.selectCalls++
      const exec = () => Promise.resolve(h.selectQueue.shift() ?? [])
      const chain: Record<string, unknown> = {}
      for (const m of ['where', 'orderBy', 'limit']) chain[m] = () => chain
      chain.then = (res: (v: unknown) => void, rej: (e: unknown) => void) => exec().then(res, rej)
      return chain
    },
  })
  const tx = {
    insert: (table: unknown) => ({
      values: (values: unknown) => {
        const p = Promise.resolve() as Promise<void> & { returning: () => Promise<unknown[]> }
        p.returning = async () => {
          if (h.failReturningTimes > 0) {
            h.failReturningTimes--
            throw Object.assign(new Error('duplicate key'), { code: '23505' })
          }
          h.inserted.push({ table, values })
          return [{ id: 'order-uuid-1' }]
        }
        // a plain awaited insert (order_items) is recorded immediately;
        // the orders insert is only recorded when .returning() succeeds
        if (table !== ordersTable) h.inserted.push({ table, values })
        return p
      },
    }),
  }
  return {
    db: {
      select,
      transaction: async (fn: (t: typeof tx) => Promise<unknown>) => fn(tx),
    },
  }
})

import { createOrder, trackOrderByInvoice } from '@/lib/services/orders'

beforeEach(() => {
  h.selectQueue.length = 0
  h.inserted.length = 0
  h.selectCalls = 0
  h.failReturningTimes = 0
})

describe('createOrder — server-side re-pricing', () => {
  it('ignores client-supplied prices when the part exists in the catalog', async () => {
    h.selectQueue.push([{ id: 'main:A1', oem: 'OEM-1', name: 'Фильтр масляный', price: 50_000 }])

    const res = await createOrder({
      name: 'Иван', phone: '+77001234567',
      items: [{ id: 'main:A1', name: 'hacked name', qty: 2, price: 1 }], // 1 ₸ from client
    })

    expect(res.total).toBe(100_000) // 2 × catalog price, client price discarded
    expect(res.invoiceNumber).toMatch(/^TH-\d{4}-\d{6}$/)

    const order = h.inserted.find((i) => i.table === ordersTable)?.values as { total: number }
    expect(order.total).toBe(100_000)

    const items = h.inserted.find((i) => i.table === orderItemsTable)?.values as Array<{
      price: number; name: string; oem: string; orderId: string
    }>
    expect(items).toHaveLength(1)
    expect(items[0].price).toBe(50_000)
    expect(items[0].name).toBe('Фильтр масляный') // snapshot from catalog, not client
    expect(items[0].oem).toBe('OEM-1')
    expect(items[0].orderId).toBe('order-uuid-1')
  })

  it('prices at price_b2b for wholesale buyers, retail otherwise', async () => {
    const row = { id: 'main:A1', oem: null, name: 'Сцепление', price: 2_135_695, priceB2b: 1_708_527 }
    const item = { id: 'main:A1', name: 'Сцепление', qty: 1, price: 1 }

    h.selectQueue.push([row])
    const wholesale = await createOrder({ name: 'ТОО', phone: '+77001234567', b2b: true, items: [item] })
    expect(wholesale.total).toBe(1_708_527)

    h.selectQueue.push([row])
    const retail = await createOrder({ name: 'И', phone: '+77001234567', items: [item] }) // no b2b flag
    expect(retail.total).toBe(2_135_695)
  })

  it('falls back to retail for b2b buyers when the part has no wholesale price', async () => {
    h.selectQueue.push([{ id: 'main:A1', oem: null, name: 'Деталь', price: 5_000, priceB2b: null }])
    const res = await createOrder({
      name: 'ТОО', phone: '+77001234567', b2b: true,
      items: [{ id: 'main:A1', name: 'Деталь', qty: 2, price: 1 }],
    })
    expect(res.total).toBe(10_000)
  })

  it('falls back to the client price only when the part is gone from the catalog', async () => {
    h.selectQueue.push([]) // part not found
    const res = await createOrder({
      name: 'Иван', phone: '+77001234567',
      items: [{ id: 'main:GONE', name: 'Снятая позиция', qty: 3, price: 700 }],
    })
    expect(res.total).toBe(2_100)
  })

  it('rejects an empty order', async () => {
    await expect(createOrder({ name: 'И', phone: '7', items: [] })).rejects.toThrow(/empty order/)
  })

  it('filters out zero/negative quantities before pricing', async () => {
    await expect(
      createOrder({ name: 'И', phone: '7', items: [{ id: 'a', name: 'x', qty: 0, price: 10 }] }),
    ).rejects.toThrow(/empty order/)
  })

  it('retries with a fresh invoice number on a unique violation (23505)', async () => {
    h.selectQueue.push([{ id: 'main:A1', oem: null, name: 'Деталь', price: 1_000 }])
    h.failReturningTimes = 1
    const res = await createOrder({
      name: 'Иван', phone: '+77001234567',
      items: [{ id: 'main:A1', name: 'Деталь', qty: 1, price: 1_000 }],
    })
    expect(res.invoiceNumber).toMatch(/^TH-\d{4}-\d{6}$/) // succeeded on retry
  })
})

describe('createOrder — delivery cost in the total', () => {
  const part = { id: 'main:A1', oem: null, name: 'Деталь', price: 10_000, priceB2b: null }
  const insertedOrder = () =>
    h.inserted.find((i) => i.table === ordersTable)?.values as { total: number; deliveryCost: number | null }

  it('adds the courier fee below the free-shipping threshold', async () => {
    h.selectQueue.push([part]) // goods = 10 000 (< 30 000)
    const res = await createOrder({
      name: 'Иван', phone: '+77001234567', delivery: 'courier',
      items: [{ id: 'main:A1', name: 'Деталь', qty: 1, price: 1 }],
    })
    expect(res.total).toBe(12_500) // 10 000 goods + 2 500 courier
    expect(insertedOrder().total).toBe(12_500)
    expect(insertedOrder().deliveryCost).toBe(2_500)
  })

  it('charges nothing for courier once goods reach the free threshold', async () => {
    h.selectQueue.push([part]) // goods = 40 000 (>= 30 000)
    const res = await createOrder({
      name: 'Иван', phone: '+77001234567', delivery: 'courier',
      items: [{ id: 'main:A1', name: 'Деталь', qty: 4, price: 1 }],
    })
    expect(res.total).toBe(40_000)
    expect(insertedOrder().deliveryCost).toBe(0)
  })

  it('stores null delivery cost for freight (manager-calc) and leaves total at goods', async () => {
    h.selectQueue.push([part])
    const res = await createOrder({
      name: 'Иван', phone: '+77001234567', delivery: 'freight',
      items: [{ id: 'main:A1', name: 'Деталь', qty: 2, price: 1 }],
    })
    expect(res.total).toBe(20_000) // no delivery folded in
    expect(insertedOrder().deliveryCost).toBeNull()
  })
})

describe('trackOrderByInvoice — anti-enumeration', () => {
  const orderRow = {
    id: 'order-uuid-1',
    invoiceNumber: 'TH-2026-123456',
    createdAt: new Date('2026-06-01T10:00:00Z'),
    status: 'new',
    paymentStatus: 'pending',
    paymentProvider: 'invoice',
    delivery: 'courier',
    deliveryCost: 2_500,
    city: 'Алматы',
    total: 100_000,
    customerPhone: '+7 (700) 123-45-67',
  }

  it('rejects malformed invoice numbers without touching the database', async () => {
    expect(await trackOrderByInvoice('DROP TABLE orders', '87001234567')).toBeNull()
    expect(await trackOrderByInvoice('TH-2026-12345', '87001234567')).toBeNull() // 5 digits
    expect(await trackOrderByInvoice('TH-2026-123456', '123')).toBeNull() // short phone
    expect(h.selectCalls).toBe(0)
  })

  it('returns the same null for "no such order" and "wrong phone"', async () => {
    h.selectQueue.push([]) // unknown invoice
    const notFound = await trackOrderByInvoice('TH-2026-999999', '87001234567')

    h.selectQueue.push([orderRow]) // known invoice, wrong phone
    const wrongPhone = await trackOrderByInvoice('TH-2026-123456', '87009999999')

    expect(notFound).toBeNull()
    expect(wrongPhone).toBeNull()
    expect(notFound).toStrictEqual(wrongPhone) // indistinguishable to a prober
  })

  it('does not fetch line items when the phone check fails', async () => {
    h.selectQueue.push([orderRow])
    await trackOrderByInvoice('TH-2026-123456', '87009999999')
    expect(h.selectCalls).toBe(1)
  })

  it('matches +7 and 8 prefixes as the same phone, case-insensitive invoice', async () => {
    h.selectQueue.push([orderRow], []) // order row, then empty items
    const res = await trackOrderByInvoice('th-2026-123456', '8 700 123 45 67')
    expect(res).not.toBeNull()
    expect(res!.invoiceNumber).toBe('TH-2026-123456')
    expect(res!.createdAt).toBe('2026-06-01T10:00:00.000Z') // serialized for the client
  })

  it('returns only whitelisted fields (no customer PII beyond what the caller typed)', async () => {
    h.selectQueue.push(
      [orderRow],
      [{ name: 'Фильтр', oem: 'OEM-1', qty: 2, price: 50_000, id: 'li-1', orderId: 'order-uuid-1', partId: 'p' }],
    )
    const res = await trackOrderByInvoice('TH-2026-123456', '87001234567')
    expect(res).not.toBeNull()
    expect(Object.keys(res!).sort()).toEqual(
      ['city', 'createdAt', 'delivery', 'deliveryCost', 'invoiceNumber', 'items', 'paymentProvider', 'paymentStatus', 'status', 'total'].sort(),
    )
    expect(res!.items[0]).toStrictEqual({ name: 'Фильтр', oem: 'OEM-1', qty: 2, price: 50_000 })
  })
})
