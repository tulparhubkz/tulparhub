'use client'
import { useRef, useState } from 'react'
import { Btn } from '@/components/ui/Btn'
import { Ico } from '@/components/ui/Ico'
import { Placeholder } from '@/components/ui/Placeholder'
import { fmtKZT } from '@/lib/utils'
import { useT } from '@/lib/i18n'
import { submitOrder } from '@/app/actions'
import type { RentalUnit } from '@/types'

interface BookingSheetProps {
  item: RentalUnit
  onClose: () => void
  onSubmit: (msg: string) => void
}

export function BookingSheet({ item, onClose, onSubmit }: BookingSheetProps) {
  const t = useT()
  const days = 3
  const total = item.rates.day * days
  const nameRef    = useRef<HTMLInputElement>(null)
  const phoneRef   = useRef<HTMLInputElement>(null)
  const addressRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (loading) return
    setLoading(true)
    try {
      const result = await submitOrder({
        kind:      'booking',
        name:      nameRef.current?.value ?? t('bs.defaultName'),
        phone:     phoneRef.current?.value ?? '',
        unit_id:   item.id,
        address:   addressRef.current?.value ?? '',
        date_from: '2026-06-25',
        date_to:   '2026-06-28',
        comment:   `Аренда: ${item.name}`,
      })
      onSubmit(result.message)
      onClose()
    } catch {
      onSubmit(t('bs.error'))
      onClose()
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
                <div><Ico name="cal" size={14} /> {t('bs.dateFrom')}</div>
                <span>→</span>
                <div><Ico name="cal" size={14} /> {t('bs.dateTo')}</div>
                <span className="sheet-period-tag">{t('bs.days3')}</span>
              </div>
            </div>
            <div className="sheet-row">
              <label>{t('bs.address')}</label>
              <input ref={addressRef} type="text" placeholder={t('bs.addressPh')} defaultValue="Алматы, мкр. Думан, 18" />
            </div>
            <div className="sheet-row sheet-row-2">
              <div>
                <label>{t('bs.contact')}</label>
                <input ref={nameRef} type="text" placeholder={t('bs.namePh')} />
              </div>
              <div>
                <label>{t('bs.phone')}</label>
                <input ref={phoneRef} type="text" placeholder="+7 (___) ___-__-__" />
              </div>
            </div>
            <div className="sheet-row">
              <label>{t('bs.extras')}</label>
              <div className="sheet-extras">
                <label className="filt-toggle"><input type="checkbox" defaultChecked /><span>{t('bs.extra1')}</span></label>
                <label className="filt-toggle"><input type="checkbox" defaultChecked /><span>{t('bs.extra2')}</span></label>
                <label className="filt-toggle"><input type="checkbox" /><span>{t('bs.extra3')}</span></label>
              </div>
            </div>
          </div>
        </div>

        <div className="sheet-foot">
          <div className="sheet-total">
            <div><span>{t('bs.rate3')}</span><b>{fmtKZT(total)}</b></div>
            <div><span>{t('bs.op3')}</span><b>{fmtKZT(30000)}</b></div>
            <div><span>{t('cart.sum.delivery')}</span><b>0 ₸</b></div>
            <div className="sheet-grand"><span>{t('cart.summary.title')}</span><b>{fmtKZT(total + 30000)}</b></div>
          </div>
          <div className="sheet-actions">
            <Btn variant="primary" size="lg" iconRight="arrow" onClick={handleSubmit} disabled={loading}>
              {loading ? t('cart.submitting') : t('bs.confirm')}
            </Btn>
            <button className="sheet-link">{t('bs.contract')}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
