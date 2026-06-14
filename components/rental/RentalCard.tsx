'use client'
import { Badge } from '@/components/ui/Badge'
import { Btn } from '@/components/ui/Btn'
import { Ico } from '@/components/ui/Ico'
import { Placeholder } from '@/components/ui/Placeholder'
import { fmtKZT } from '@/lib/utils'
import type { RentalUnit } from '@/types'

export function RentalCard({ item, onBook }: { item: RentalUnit; onBook: () => void }) {
  return (
    <div className="rcard">
      <div className="rcard-img">
        <Placeholder label={item.img} ratio="16/10" />
        <div className="rcard-badges">
          <Badge tone="ok">{item.available}</Badge>
          {item.operator && <Badge tone="info">С оператором</Badge>}
        </div>
      </div>
      <div className="rcard-body">
        <div className="rcard-brand">{item.brand} · {item.year} · {item.hours.toLocaleString('ru-RU')} м/ч</div>
        <div className="rcard-name">{item.name}</div>
        <div className="rcard-specs">
          {Object.entries(item.specs).slice(0, 3).map(([k, v]) => (
            <div key={k} className="rcard-spec"><span>{k}</span><b>{v}</b></div>
          ))}
        </div>
        <div className="rcard-rates">
          <div><span>Смена 8ч</span><b>{fmtKZT(item.rates.shift)}</b></div>
          <div><span>Сутки</span><b>{fmtKZT(item.rates.day)}</b></div>
          <div><span>Неделя</span><b>{fmtKZT(item.rates.week)}</b></div>
          <div><span>Месяц</span><b>{fmtKZT(item.rates.month)}</b></div>
        </div>
        <div className="rcard-foot">
          <div className="rcard-loc"><Ico name="pin" size={12} /> {item.city} · {item.delivery}</div>
          <div className="rcard-actions">
            <Btn variant="primary" size="sm" iconRight="arrow" onClick={onBook}>Забронировать</Btn>
            <button className="rcard-call"><Ico name="phone" size={12} /></button>
          </div>
        </div>
      </div>
    </div>
  )
}
