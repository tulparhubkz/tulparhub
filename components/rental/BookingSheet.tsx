'use client'
import { useRef, useState } from 'react'
import { Btn } from '@/components/ui/Btn'
import { Ico } from '@/components/ui/Ico'
import { Placeholder } from '@/components/ui/Placeholder'
import { fmtKZT } from '@/lib/utils'
import { submitOrder } from '@/app/actions'
import type { RentalUnit } from '@/types'

interface BookingSheetProps {
  item: RentalUnit
  onClose: () => void
  onSubmit: (msg: string) => void
}

export function BookingSheet({ item, onClose, onSubmit }: BookingSheetProps) {
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
        name:      nameRef.current?.value ?? 'Клиент',
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
      onSubmit('Ошибка отправки. Позвоните нам напрямую.')
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
            <div className="sheet-pre">Бронирование</div>
            <h3>{item.name}</h3>
          </div>
          <button onClick={onClose}><Ico name="close" size={16} /></button>
        </div>

        <div className="sheet-body">
          <div className="sheet-img"><Placeholder label={item.img} ratio="16/9" /></div>
          <div className="sheet-form">
            <div className="sheet-row">
              <label>Период</label>
              <div className="sheet-period">
                <div><Ico name="cal" size={14} /> 25 июня 2026</div>
                <span>→</span>
                <div><Ico name="cal" size={14} /> 28 июня 2026</div>
                <span className="sheet-period-tag">3 дня</span>
              </div>
            </div>
            <div className="sheet-row">
              <label>Адрес объекта</label>
              <input ref={addressRef} type="text" placeholder="Алматы, ул. ..." defaultValue="Алматы, мкр. Думан, 18" />
            </div>
            <div className="sheet-row sheet-row-2">
              <div>
                <label>Контактное лицо</label>
                <input ref={nameRef} type="text" placeholder="Имя Фамилия" />
              </div>
              <div>
                <label>Телефон</label>
                <input ref={phoneRef} type="text" placeholder="+7 (___) ___-__-__" />
              </div>
            </div>
            <div className="sheet-row">
              <label>Доп. услуги</label>
              <div className="sheet-extras">
                <label className="filt-toggle"><input type="checkbox" defaultChecked /><span>Оператор (10 000 ₸/смена)</span></label>
                <label className="filt-toggle"><input type="checkbox" defaultChecked /><span>Топливо ДТ — расход в счёт</span></label>
                <label className="filt-toggle"><input type="checkbox" /><span>Каско на период аренды (от 8 000 ₸/сутки)</span></label>
              </div>
            </div>
          </div>
        </div>

        <div className="sheet-foot">
          <div className="sheet-total">
            <div><span>Тариф · 3 дня</span><b>{fmtKZT(total)}</b></div>
            <div><span>Оператор · 3 смены</span><b>{fmtKZT(30000)}</b></div>
            <div><span>Доставка</span><b>0 ₸</b></div>
            <div className="sheet-grand"><span>Итого</span><b>{fmtKZT(total + 30000)}</b></div>
          </div>
          <div className="sheet-actions">
            <Btn variant="primary" size="lg" iconRight="arrow" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Отправка...' : 'Подтвердить бронирование'}
            </Btn>
            <button className="sheet-link">Договор аренды (PDF)</button>
          </div>
        </div>
      </div>
    </div>
  )
}
