'use client'
import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { fmtKZT } from '@/lib/utils'
import { useT, type TranslationKey } from '@/lib/i18n'

// Reuses the track.* status/payment labels so wording stays consistent.
const STATUS_KEY: Record<string, TranslationKey> = {
  new: 'track.status.new',
  confirmed: 'track.status.confirmed',
  shipped: 'track.status.shipped',
  done: 'track.status.done',
  cancelled: 'track.status.cancelled',
}
const PAY_KEY: Record<string, TranslationKey> = {
  pending: 'track.pay.pending',
  paid: 'track.pay.paid',
  failed: 'track.pay.failed',
  refunded: 'track.pay.refunded',
}

interface Item { id: string; name: string; oem: string | null; qty: number; price: number }
interface Order {
  id: string; invoiceNumber: string; createdAt: string | Date
  status: string; paymentStatus: string; total: number
  delivery: string | null; deliveryCost: number | null; items: Item[]
}

function fmtDate(d: string | Date) {
  return new Date(d).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function MyOrders({ signedIn, orders }: { signedIn: boolean; orders: Order[] }) {
  const t = useT()
  const [open, setOpen] = useState<string | null>(null)

  return (
    <>
      <style jsx global>{`
        .mo { min-height: 60vh; padding: 28px 0 60px; }
        .mo .container { max-width: 760px; }
        .mo h1 { font-size: 26px; font-weight: 800; letter-spacing: -.02em; margin-bottom: 18px; }
        .mo-card { background: var(--surf); border: 1.5px solid var(--line); border-radius: 14px; overflow: hidden; margin-bottom: 10px; }
        .mo-row { width: 100%; display: flex; align-items: center; gap: 12px; padding: 14px 16px; background: none; border: none; cursor: pointer; text-align: left; }
        .mo-main { display: flex; flex-direction: column; gap: 2px; min-width: 0; flex: 1; }
        .mo-num { font-family: var(--font-jetbrains, monospace); font-size: 14px; font-weight: 700; color: var(--ink); }
        .mo-date { font-size: 12px; color: var(--ink-3); }
        .mo-pills { display: flex; gap: 6px; flex-wrap: wrap; justify-content: flex-end; }
        .mo-pill { font-size: 11px; font-weight: 700; padding: 4px 9px; border-radius: 999px; white-space: nowrap; }
        .mo-pill.st-new { background: #eef2ff; color: #4338ca; } .mo-pill.st-confirmed { background: #ecfeff; color: #0e7490; }
        .mo-pill.st-shipped { background: #fff7ed; color: #c2410c; } .mo-pill.st-done { background: #f0fdf4; color: #15803d; }
        .mo-pill.st-cancelled { background: #fef2f2; color: #b91c1c; }
        .mo-pill.pay-pending { background: var(--surf-2); color: var(--ink-3); } .mo-pill.pay-paid { background: #f0fdf4; color: #15803d; }
        .mo-pill.pay-failed { background: #fef2f2; color: #b91c1c; } .mo-pill.pay-refunded { background: #fff7ed; color: #c2410c; }
        .mo-total { font-size: 14px; font-weight: 800; color: var(--ink); white-space: nowrap; }
        .mo-detail { border-top: 1px solid var(--line); background: var(--surf-2); padding: 12px 16px; }
        .mo-item { display: flex; gap: 10px; align-items: baseline; font-size: 13px; padding: 3px 0; }
        .mo-item .oem { font-family: var(--font-jetbrains, monospace); color: var(--ink-2); flex-shrink: 0; }
        .mo-item .nm { color: var(--ink); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; }
        .mo-item .pr { font-weight: 700; color: var(--ink); flex-shrink: 0; }
        .mo-links { display: flex; gap: 14px; margin-top: 10px; }
        .mo-links a { color: var(--accent); font-size: 13px; font-weight: 600; text-decoration: none; }
        .mo-center { text-align: center; padding: 56px 16px; background: var(--surf); border: 1.5px solid var(--line); border-radius: 16px; }
        .mo-center h2 { font-size: 19px; font-weight: 700; margin-bottom: 8px; }
        .mo-center p { color: var(--ink-2); font-size: 14px; margin-bottom: 18px; }
        .mo-cta { display: inline-flex; padding: 11px 24px; background: var(--accent); color: #fff; border-radius: 10px; font-weight: 700; font-size: 14px; text-decoration: none; }
        .mo-guest { margin-top: 14px; font-size: 13px; color: var(--ink-3); }
        .mo-guest a { color: var(--accent); font-weight: 600; }
        @media (max-width: 600px) { .mo-pills { justify-content: flex-start; } .mo-row { flex-wrap: wrap; } }
      `}</style>

      <main className="mo">
        <div className="container">
          <h1>{t('myorders.title')}</h1>

          {!signedIn ? (
            <div className="mo-center">
              <h2>{t('myorders.loginTitle')}</h2>
              <p>{t('myorders.loginText')}</p>
              <Link href="/auth" className="mo-cta">{t('myorders.loginBtn')}</Link>
              <div className="mo-guest">{t('myorders.guestHint')} <Link href="/track">{t('track.fromSuccess')}</Link></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="mo-center">
              <p>{t('myorders.empty')}</p>
              <Link href="/catalog" className="mo-cta">{t('myorders.emptyCta')}</Link>
              <div className="mo-guest">{t('myorders.guestHint')} <Link href="/track">{t('track.fromSuccess')}</Link></div>
            </div>
          ) : (
            orders.map((o) => (
              <div key={o.id} className="mo-card">
                <button className="mo-row" onClick={() => setOpen(open === o.id ? null : o.id)}>
                  <div className="mo-main">
                    <span className="mo-num">{o.invoiceNumber}</span>
                    <span className="mo-date">{fmtDate(o.createdAt)} · {o.items.length} {t('myorders.pos')}</span>
                  </div>
                  <div className="mo-pills">
                    <span className={`mo-pill st-${o.status}`}>{t(STATUS_KEY[o.status] ?? 'track.status.new')}</span>
                    <span className={`mo-pill pay-${o.paymentStatus}`}>{t(PAY_KEY[o.paymentStatus] ?? 'track.pay.pending')}</span>
                  </div>
                  <span className="mo-total">{fmtKZT(o.total)}</span>
                </button>
                {open === o.id && (
                  <div className="mo-detail">
                    {o.items.map((it) => (
                      <div key={it.id} className="mo-item">
                        {it.oem && <span className="oem">{it.oem}</span>}
                        <span className="nm">{it.name}</span>
                        <span className="pr">×{it.qty} · {fmtKZT(it.price * it.qty)}</span>
                      </div>
                    ))}
                    {(o.deliveryCost !== null || o.delivery === 'freight') && (
                      <div className="mo-item mo-delivery">
                        <span className="nm">{t('track.delivery')}</span>
                        <span className="pr">{o.deliveryCost === null ? t('cart.byCalc') : o.deliveryCost === 0 ? t('cart.free') : fmtKZT(o.deliveryCost)}</span>
                      </div>
                    )}
                    <div className="mo-links">
                      <Link href={`/invoice/${o.id}`} target="_blank">{t('myorders.invoice')} (PDF)</Link>
                      <Link href={`/track?num=${encodeURIComponent(o.invoiceNumber)}`}>{t('track.fromSuccess')}</Link>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </>
  )
}
