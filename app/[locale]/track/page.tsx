'use client'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { fmtKZT } from '@/lib/utils'
import { formatPhoneInput } from '@/lib/validation'
import { useT, type TranslationKey } from '@/lib/i18n'
import { trackOrder } from '@/app/actions'
import type { TrackedOrder } from '@/lib/services/orders'

// Progression used for the timeline; `cancelled` is rendered as a banner instead.
const FLOW = ['new', 'confirmed', 'shipped', 'done'] as const
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
const STEP_ICONS = ['✅', '📞', '📦', '🏁']

function TrackInner() {
  const t = useT()
  const params = useSearchParams()
  const [num, setNum] = useState(params.get('num') ?? '')
  const [phone, setPhone] = useState(params.get('phone') ?? '')
  const [loading, setLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [order, setOrder] = useState<TrackedOrder | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setNotFound(false)
    try {
      const res = await trackOrder(num, phone)
      if (res.found && res.order) {
        setOrder(res.order)
      } else {
        setOrder(null)
        setNotFound(true)
      }
    } catch {
      setOrder(null)
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  const cancelled = order?.status === 'cancelled'
  const stepIdx = order ? FLOW.indexOf(order.status as (typeof FLOW)[number]) : -1

  return (
    <>
      <style jsx global>{`
        .trk-page { min-height: 70vh; padding: 40px 16px 60px; display: flex; justify-content: center; }
        .trk-wrap { width: 100%; max-width: 560px; display: flex; flex-direction: column; gap: 20px; }
        .trk-head h1 { font-size: 26px; font-weight: 800; letter-spacing: -.02em; color: var(--ink); margin-bottom: 6px; }
        .trk-head p { color: var(--ink-2); font-size: 14px; line-height: 1.5; }
        .trk-card { background: var(--surf); border: 1.5px solid var(--line); border-radius: 16px; padding: 24px; }
        .trk-form { display: flex; flex-direction: column; gap: 14px; }
        .trk-form label { display: flex; flex-direction: column; gap: 6px; font-size: 13px; font-weight: 500; color: var(--ink-2); }
        .trk-form input { padding: 12px 14px; border: 1.5px solid var(--line-2); border-radius: 10px; font-size: 15px; outline: none; }
        .trk-form input:focus { border-color: var(--accent); }
        .trk-num-input { font-family: var(--font-jetbrains, monospace); letter-spacing: .04em; text-transform: uppercase; }
        .trk-submit { padding: 13px 0; background: var(--accent); color: #fff; font-weight: 700; font-size: 15px; border: none; border-radius: 10px; cursor: pointer; }
        .trk-submit:hover { background: var(--accent-deep); }
        .trk-submit:disabled { opacity: .7; cursor: default; }
        .trk-error { background: #fef2f2; border: 1px solid #fca5a5; border-radius: 10px; padding: 12px 16px; color: #dc2626; font-size: 14px; }
        .trk-order-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; margin-bottom: 4px; }
        .trk-order-num { font-family: var(--font-jetbrains, monospace); font-size: 17px; font-weight: 700; color: var(--ink); letter-spacing: .04em; }
        .trk-date { font-size: 12px; color: var(--ink-3); margin-bottom: 16px; }
        .trk-pill { font-size: 11px; font-weight: 700; padding: 5px 11px; border-radius: 999px; white-space: nowrap; }
        .trk-pill.pending { background: var(--surf-2); color: var(--ink-3); }
        .trk-pill.paid { background: #f0fdf4; color: #15803d; }
        .trk-pill.failed { background: #fef2f2; color: #b91c1c; }
        .trk-pill.refunded { background: #fff7ed; color: #c2410c; }
        .trk-cancelled { background: #fef2f2; border: 1px solid #fca5a5; border-radius: 10px; padding: 12px 16px; color: #b91c1c; font-size: 14px; font-weight: 600; margin-bottom: 16px; }
        .trk-steps { display: flex; flex-direction: column; }
        .trk-step { display: flex; gap: 14px; align-items: flex-start; padding-bottom: 20px; position: relative; }
        .trk-step:last-child { padding-bottom: 0; }
        .trk-step:not(:last-child)::before { content: ''; position: absolute; left: 17px; top: 38px; bottom: 0; width: 2px; background: var(--line); }
        .trk-step.on:not(:last-child)::before { background: #16a34a; }
        .trk-dot { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0; border: 2px solid var(--line); background: var(--surf-2); filter: grayscale(1); opacity: .55; }
        .trk-step.on .trk-dot { background: #f0fdf4; border-color: #16a34a; filter: none; opacity: 1; }
        .trk-step-label { padding-top: 8px; font-size: 14px; font-weight: 600; color: var(--ink-3); }
        .trk-step.on .trk-step-label { color: var(--ink); }
        .trk-items { display: flex; flex-direction: column; gap: 8px; margin-bottom: 14px; }
        .trk-items-title { font-size: 13px; font-weight: 700; color: var(--ink-2); margin-bottom: 2px; }
        .trk-item { display: flex; gap: 10px; align-items: baseline; font-size: 13px; }
        .trk-item .oem { font-family: var(--font-jetbrains, monospace); color: var(--ink-2); flex-shrink: 0; }
        .trk-item .nm { color: var(--ink); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; }
        .trk-item .q { color: var(--ink-3); flex-shrink: 0; }
        .trk-item .p { font-weight: 700; color: var(--ink); flex-shrink: 0; }
        .trk-total { display: flex; justify-content: space-between; border-top: 1.5px solid var(--line); padding-top: 12px; font-size: 15px; color: var(--ink-2); }
        .trk-total b { color: var(--ink); font-weight: 800; }
        .trk-again { background: none; border: none; color: var(--accent); font-size: 14px; font-weight: 600; cursor: pointer; padding: 0; align-self: center; }
        @media (max-width: 600px) { .trk-card { padding: 18px 16px; } }
      `}</style>

      <main className="trk-page">
        <div className="trk-wrap">
          <div className="trk-head">
            <h1>{t('track.title')}</h1>
            <p>{t('track.sub')}</p>
          </div>

          {!order && (
            <div className="trk-card">
              <form className="trk-form" onSubmit={handleSubmit}>
                <label>
                  {t('track.numLabel')}
                  <input
                    className="trk-num-input"
                    value={num}
                    onChange={(e) => setNum(e.target.value)}
                    placeholder={t('track.numPh')}
                    required
                    autoComplete="off"
                  />
                </label>
                <label>
                  {t('track.phoneLabel')}
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
                    placeholder={t('track.phonePh')}
                    required
                  />
                </label>
                {notFound && <div className="trk-error">{t('track.notFound')}</div>}
                <button className="trk-submit" type="submit" disabled={loading}>
                  {loading ? t('track.loading') : t('track.submit')}
                </button>
              </form>
            </div>
          )}

          {order && (
            <>
              <div className="trk-card">
                <div className="trk-order-head">
                  <span className="trk-order-num">{t('track.orderPre')}{order.invoiceNumber}</span>
                  <span className={`trk-pill ${order.paymentStatus}`}>
                    {t(PAY_KEY[order.paymentStatus] ?? 'track.pay.pending')}
                  </span>
                </div>
                <div className="trk-date">
                  {t('track.placedAt')}: {new Date(order.createdAt).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>

                {cancelled && <div className="trk-cancelled">{t('track.cancelledNote')}</div>}

                <div className="trk-steps">
                  {FLOW.map((s, i) => (
                    <div key={s} className={`trk-step${!cancelled && i <= stepIdx ? ' on' : ''}`}>
                      <div className="trk-dot">{STEP_ICONS[i]}</div>
                      <div className="trk-step-label">{t(STATUS_KEY[s])}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="trk-card">
                <div className="trk-items-title">{t('track.itemsTitle')}</div>
                <div className="trk-items">
                  {order.items.map((it, i) => (
                    <div key={i} className="trk-item">
                      {it.oem && <span className="oem">{it.oem}</span>}
                      <span className="nm">{it.name}</span>
                      <span className="q">×{it.qty} {t('track.qty')}</span>
                      <span className="p">{fmtKZT(it.price * it.qty)}</span>
                    </div>
                  ))}
                </div>
                <div className="trk-total">
                  <span>{t('track.total')}</span>
                  <b>{fmtKZT(order.total)}</b>
                </div>
              </div>

              <button className="trk-again" onClick={() => { setOrder(null); setNotFound(false) }}>
                {t('track.checkAnother')}
              </button>
            </>
          )}
        </div>
      </main>
    </>
  )
}

export default function TrackPage() {
  return (
    <Suspense>
      <TrackInner />
    </Suspense>
  )
}
