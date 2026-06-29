'use client'
import { useState, useTransition } from 'react'
import { fmtKZT } from '@/lib/utils'
import { setOrderStatus, setPaymentStatus } from './actions'

// Kept local (not imported from lib/services/orders) so the server-only DB client
// never leaks into the client bundle.
const STATUSES = ['new', 'confirmed', 'shipped', 'done', 'cancelled'] as const
const PAYMENTS = ['pending', 'paid', 'failed', 'refunded'] as const
const STATUS_RU: Record<string, string> = {
  new: 'Новый', confirmed: 'Подтверждён', shipped: 'Отгружен', done: 'Выполнен', cancelled: 'Отменён',
}
const PAY_RU: Record<string, string> = {
  pending: 'Ожидает', paid: 'Оплачен', failed: 'Ошибка', refunded: 'Возврат',
}

interface OrderItem { id: string; name: string; oem: string | null; qty: number; price: number }
interface Order {
  id: string; invoiceNumber: string; createdAt: string | Date
  customerName: string; customerPhone: string; customerEmail: string | null
  company: string | null; city: string | null; delivery: string | null; paymentProvider: string | null
  status: string; paymentStatus: string; total: number; items: OrderItem[]
}

function fmtDate(d: string | Date) {
  return new Date(d).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function AdminOrders({ orders, adminEmail }: { orders: Order[]; adminEmail: string | null }) {
  const [rows, setRows] = useState(orders)
  const [open, setOpen] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  const revenue = rows.filter((o) => o.status !== 'cancelled').reduce((a, c) => a + c.total, 0)

  const onStatus = (id: string, status: string) => {
    setRows((r) => r.map((o) => (o.id === id ? { ...o, status } : o)))
    startTransition(async () => {
      const res = await setOrderStatus(id, status as (typeof STATUSES)[number])
      if (!res.ok) location.reload()
    })
  }
  const onPay = (id: string, paymentStatus: string) => {
    setRows((r) => r.map((o) => (o.id === id ? { ...o, paymentStatus } : o)))
    startTransition(async () => {
      const res = await setPaymentStatus(id, paymentStatus as (typeof PAYMENTS)[number])
      if (!res.ok) location.reload()
    })
  }

  return (
    <main className="adm">
      <div className="container">
        <header className="adm-head">
          <div>
            <h1>Заказы</h1>
            <p>{rows.length} заказов · выручка (без отменённых) <b>{fmtKZT(revenue)}</b></p>
          </div>
          {adminEmail && <span className="adm-who">{adminEmail}</span>}
        </header>

        {rows.length === 0 ? (
          <div className="adm-empty">Заказов пока нет.</div>
        ) : (
          <div className="adm-list">
            {rows.map((o) => (
              <div key={o.id} className={`adm-card s-${o.status}`}>
                <button className="adm-row" onClick={() => setOpen(open === o.id ? null : o.id)}>
                  <div className="adm-c adm-inv">
                    <b>{o.invoiceNumber}</b>
                    <span>{fmtDate(o.createdAt)}</span>
                  </div>
                  <div className="adm-c adm-cust">
                    <b>{o.customerName}</b>
                    <span>{o.company || o.customerPhone}</span>
                  </div>
                  <div className="adm-c adm-tot">
                    <b>{fmtKZT(o.total)}</b>
                    <span>{o.items.length} поз. · {o.paymentProvider || '—'}</span>
                  </div>
                  <div className="adm-c adm-badges">
                    <span className={`pill st st-${o.status}`}>{STATUS_RU[o.status] ?? o.status}</span>
                    <span className={`pill pay pay-${o.paymentStatus}`}>{PAY_RU[o.paymentStatus] ?? o.paymentStatus}</span>
                  </div>
                  <span className={`adm-chev ${open === o.id ? 'up' : ''}`}>▾</span>
                </button>

                {open === o.id && (
                  <div className="adm-detail">
                    <div className="adm-items">
                      {o.items.map((it) => (
                        <div key={it.id} className="adm-item">
                          <span className="ai-oem">{it.oem || '—'}</span>
                          <span className="ai-name">{it.name}</span>
                          <span className="ai-qty">×{it.qty}</span>
                          <span className="ai-price">{fmtKZT(it.price * it.qty)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="adm-meta">
                      <div><span>Телефон</span><b>{o.customerPhone}</b></div>
                      {o.customerEmail && <div><span>Email</span><b>{o.customerEmail}</b></div>}
                      {o.city && <div><span>Город</span><b>{o.city}</b></div>}
                      {o.delivery && <div><span>Доставка</span><b>{o.delivery}</b></div>}
                    </div>
                    <div className="adm-controls">
                      <label>
                        <span>Статус заказа</span>
                        <select value={o.status} onChange={(e) => onStatus(o.id, e.target.value)}>
                          {STATUSES.map((s) => <option key={s} value={s}>{STATUS_RU[s]}</option>)}
                        </select>
                      </label>
                      <label>
                        <span>Оплата</span>
                        <select value={o.paymentStatus} onChange={(e) => onPay(o.id, e.target.value)}>
                          {PAYMENTS.map((p) => <option key={p} value={p}>{PAY_RU[p]}</option>)}
                        </select>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .adm { padding: 24px 0 80px; }
        .adm-head { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; }
        .adm-head h1 { font-size: 26px; font-weight: 800; letter-spacing: -.02em; }
        .adm-head p { color: var(--ink-2); font-size: 14px; margin-top: 4px; }
        .adm-who { font-size: 13px; color: var(--ink-3); background: var(--surf-2); border: 1px solid var(--line); border-radius: 8px; padding: 6px 12px; }
        .adm-empty { padding: 48px; text-align: center; color: var(--ink-3); background: var(--surf); border: 1.5px solid var(--line); border-radius: 16px; }
        .adm-list { display: flex; flex-direction: column; gap: 10px; }
        .adm-card { background: var(--surf); border: 1.5px solid var(--line); border-radius: 14px; overflow: hidden; }
        .adm-row { width: 100%; display: grid; grid-template-columns: 1.3fr 1.4fr 1fr 1.2fr 24px; gap: 14px; align-items: center; padding: 14px 16px; background: none; border: none; cursor: pointer; text-align: left; }
        .adm-c { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .adm-c b { font-size: 14px; color: var(--ink); font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .adm-c span { font-size: 12px; color: var(--ink-3); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .adm-inv b { font-family: var(--font-jetbrains, monospace); }
        .adm-badges { flex-direction: row; gap: 6px; flex-wrap: wrap; }
        .pill { font-size: 11px; font-weight: 700; padding: 4px 9px; border-radius: 999px; white-space: nowrap; }
        .st-new { background: #eef2ff; color: #4338ca; } .st-confirmed { background: #ecfeff; color: #0e7490; }
        .st-shipped { background: #fff7ed; color: #c2410c; } .st-done { background: #f0fdf4; color: #15803d; }
        .st-cancelled { background: #fef2f2; color: #b91c1c; }
        .pay-pending { background: var(--surf-2); color: var(--ink-3); } .pay-paid { background: #f0fdf4; color: #15803d; }
        .pay-failed { background: #fef2f2; color: #b91c1c; } .pay-refunded { background: #fff7ed; color: #c2410c; }
        .adm-chev { color: var(--ink-3); transition: transform .15s; justify-self: end; }
        .adm-chev.up { transform: rotate(180deg); }
        .adm-detail { border-top: 1px solid var(--line); padding: 14px 16px; display: flex; flex-direction: column; gap: 14px; background: var(--surf-2); }
        .adm-items { display: flex; flex-direction: column; gap: 6px; }
        .adm-item { display: grid; grid-template-columns: 120px 1fr auto auto; gap: 10px; align-items: center; font-size: 13px; }
        .ai-oem { font-family: var(--font-jetbrains, monospace); color: var(--ink-2); }
        .ai-name { color: var(--ink); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .ai-qty { color: var(--ink-3); } .ai-price { font-weight: 700; color: var(--ink); }
        .adm-meta { display: flex; flex-wrap: wrap; gap: 18px; }
        .adm-meta div { display: flex; flex-direction: column; }
        .adm-meta span { font-size: 11px; color: var(--ink-3); } .adm-meta b { font-size: 13px; color: var(--ink); }
        .adm-controls { display: flex; gap: 14px; flex-wrap: wrap; }
        .adm-controls label { display: flex; flex-direction: column; gap: 4px; font-size: 12px; color: var(--ink-3); }
        .adm-controls select { padding: 8px 12px; border: 1.5px solid var(--line-2); border-radius: 9px; background: var(--surf); font-size: 14px; color: var(--ink); cursor: pointer; }
        @media (max-width: 720px) {
          .adm-row { grid-template-columns: 1fr auto; grid-template-areas: 'inv tot' 'cust badges'; }
          .adm-inv { grid-area: inv; } .adm-tot { grid-area: tot; align-items: flex-end; }
          .adm-cust { grid-area: cust; } .adm-badges { grid-area: badges; justify-content: flex-end; }
          .adm-chev { display: none; }
          .adm-item { grid-template-columns: 1fr auto; }
          .ai-oem { display: none; }
        }
      `}</style>
    </main>
  )
}
