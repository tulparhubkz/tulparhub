'use client'
import { useRef, useState } from 'react'
import { Btn } from '@/components/ui/Btn'
import { Ico } from '@/components/ui/Ico'
import { Placeholder } from '@/components/ui/Placeholder'
import { fmtKZT } from '@/lib/utils'
import { useT } from '@/lib/i18n'
import { isValidPhone } from '@/lib/validation'
import { submitOrder } from '@/app/actions'
import type { RentalUnit } from '@/types'

interface BookingSheetProps {
  item: RentalUnit
  onClose: () => void
  onSubmit: (msg: string) => void
}

const DAY_MS = 86400000
const OPERATOR_RATE = 10000 // ₸/смена

function toISO(d: Date) {
  return d.toISOString().slice(0, 10)
}

export function BookingSheet({ item, onClose, onSubmit }: BookingSheetProps) {
  const t = useT()
  const [from, setFrom] = useState(() => toISO(new Date()))
  const [to, setTo] = useState(() => toISO(new Date(Date.now() + 3 * DAY_MS)))
  const [withOp, setWithOp] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const nameRef    = useRef<HTMLInputElement>(null)
  const phoneRef   = useRef<HTMLInputElement>(null)
  const addressRef = useRef<HTMLInputElement>(null)
  const fuelRef    = useRef<HTMLInputElement>(null)
  const cascoRef   = useRef<HTMLInputElement>(null)

  const days = Math.max(1, Math.round((new Date(to).getTime() - new Date(from).getTime()) / DAY_MS))
  const rateTotal = item.rates.day * days
  const operatorTotal = withOp ? OPERATOR_RATE * days : 0
  const grand = rateTotal + operatorTotal

  const handleSubmit = async () => {
    if (loading) return
    const name  = nameRef.current?.value?.trim()
    const phone = phoneRef.current?.value?.trim()
    if (!name)  { setError(t('cart.toast.enterName')); return }
    if (!phone) { setError(t('cart.toast.enterPhone')); return }
    if (!isValidPhone(phone)) { setError(t('cart.toast.badPhone')); return }
    setError('')
    setLoading(true)
    try {
      const result = await submitOrder({
        kind:      'booking',
        name,
        phone,
        unit_id:   item.id,
        address:   addressRef.current?.value ?? '',
        date_from: from,
        date_to:   to,
        comment:   [
          `Аренда: ${item.name} · ${days} дн.`,
          withOp ? 'с оператором' : 'без оператора',
          fuelRef.current?.checked ? 'топливо в счёт' : null,
          cascoRef.current?.checked ? 'каско' : null,
        ].filter(Boolean).join(' · '),
      })
      if (result.ok) {
        onSubmit(result.message)
        onClose()
      } else {
        setError(result.message)
      }
    } catch {
      setError(t('bs.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head">
          <div>
            <div className="sheet-pre">{t('bs.pre')}</div>
            <h3>{item.name}</h3>
          </div>
          <button onClick={onClose}><Ico name="close" size={16} /></button>
        </div>

        <div className="sheet-body">
          <div className="sheet-img"><Placeholder label={item.img} ratio="16/9" /></div>
          <div className="sheet-form">
            <div className="sheet-row">
              <label>{t('bs.period')}</label>
              <div className="sheet-period">
                <input type="date" value={from} max={to} onChange={(e) => e.target.value && setFrom(e.target.value)} />
                <span>→</span>
                <input type="date" value={to} min={from} onChange={(e) => e.target.value && setTo(e.target.value)} />
                <span className="sheet-period-tag">{days} {t('bs.daysShort')}</span>
              </div>
            </div>
            <div className="sheet-row">
              <label>{t('bs.address')}</label>
              <input ref={addressRef} type="text" placeholder={t('bs.addressPh')} />
            </div>
            <div className="sheet-row sheet-row-2">
              <div>
                <label>{t('bs.contact')}</label>
                <input ref={nameRef} type="text" placeholder={t('bs.namePh')} />
              </div>
              <div>
                <label>{t('bs.phone')}</label>
                <input ref={phoneRef} type="tel" placeholder="+7 (___) ___-__-__" />
              </div>
            </div>
            <div className="sheet-row">
              <label>{t('bs.extras')}</label>
              <div className="sheet-extras">
                <label className="filt-toggle"><input type="checkbox" checked={withOp} onChange={(e) => setWithOp(e.target.checked)} /><span>{t('bs.extra1')}</span></label>
                <label className="filt-toggle"><input ref={fuelRef} type="checkbox" defaultChecked /><span>{t('bs.extra2')}</span></label>
                <label className="filt-toggle"><input ref={cascoRef} type="checkbox" /><span>{t('bs.extra3')}</span></label>
              </div>
            </div>
          </div>
        </div>

        <div className="sheet-foot">
          <div className="sheet-total">
            <div><span>{t('bs.rate')} · {days} {t('bs.daysShort')}</span><b>{fmtKZT(rateTotal)}</b></div>
            {withOp && <div><span>{t('bs.op')} · {days} {t('bs.daysShort')}</span><b>{fmtKZT(operatorTotal)}</b></div>}
            <div><span>{t('cart.sum.delivery')}</span><b>0 ₸</b></div>
            <div className="sheet-grand"><span>{t('cart.summary.title')}</span><b>{fmtKZT(grand)}</b></div>
          </div>
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '9px 12px', color: '#dc2626', fontSize: 13, marginBottom: 10 }}>
              {error}
            </div>
          )}
          <div className="sheet-actions">
            <Btn variant="primary" size="lg" iconRight="arrow" onClick={handleSubmit} disabled={loading}>
              {loading ? t('cart.submitting') : t('bs.confirm')}
            </Btn>
          </div>
        </div>
      </div>
    </div>
  )
}
