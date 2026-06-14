'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Ico } from '@/components/ui/Ico'
import { Crumbs } from '@/components/ui/Crumbs'
import { ToastHost, type ToastItem } from '@/components/ui/Toast'
import { RentalCard } from '@/components/rental/RentalCard'
import { BookingSheet } from '@/components/rental/BookingSheet'
import { rental } from '@/lib/data'
import type { RentalUnit } from '@/types'

export default function RentalPage() {
  const router = useRouter()
  const [typeFilter, setTypeFilter] = useState('all')
  const [withOp, setWithOp]         = useState('any')
  const [selected, setSelected]     = useState<RentalUnit | null>(null)
  const [toasts, setToasts]         = useState<ToastItem[]>([])

  const addToast = (msg: string) =>
    setToasts((t) => [...t, { id: Date.now(), msg, icon: 'check' }])

  const items = rental.filter((r) => {
    if (typeFilter !== 'all' && r.type !== typeFilter) return false
    if (withOp === 'yes' && !r.operator) return false
    if (withOp === 'no' && r.operator) return false
    return true
  })

  const crumbs = [
    { label: 'Главная', onClick: () => router.push('/') },
    { label: 'Аренда спецтехники' },
  ]

  return (
    <main className="rental">
      <div className="container">
        <Crumbs items={crumbs} />

        <header className="rental-head">
          <div>
            <div className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--ink-3)', marginBottom: 8 }}>
              <span className="eyebrow-dot" /> Аренда
            </div>
            <h1>Спецтехника в аренду — 240+ единиц</h1>
            <p>Экскаваторы, погрузчики, самосвалы, краны, катки. Прозрачные тарифы за смену, сутки, неделю, месяц.</p>
          </div>
          <div className="rental-trust">
            <div><b>240+</b><span>единиц парка</span></div>
            <div><b>4 ч.</b><span>средняя подача</span></div>
            <div><b>99,1%</b><span>SLA по срокам</span></div>
          </div>
        </header>

        {/* Filter bar */}
        <div className="rental-filterbar">
          <div className="rfb-group">
            <span className="rfb-lbl">Тип</span>
            <div className="rfb-pills">
              {[['all','Все'],['excavator','Экскаваторы'],['loader','Погрузчики'],['dump','Самосвалы'],['crane','Краны'],['roller','Катки']].map(([k, l]) => (
                <button key={k} className={typeFilter === k ? 'on' : ''} onClick={() => setTypeFilter(k)}>{l}</button>
              ))}
            </div>
          </div>
          <div className="rfb-group">
            <span className="rfb-lbl">С оператором</span>
            <div className="rfb-pills">
              {[['any','Любой'],['yes','С оператором'],['no','Без оператора']].map(([k, l]) => (
                <button key={k} className={withOp === k ? 'on' : ''} onClick={() => setWithOp(k)}>{l}</button>
              ))}
            </div>
          </div>
          <div className="rfb-group">
            <span className="rfb-lbl">Когда</span>
            <div className="rfb-date">
              <Ico name="cal" size={14} />
              <input type="text" defaultValue="25 июня — 28 июня" />
            </div>
          </div>
          <div className="rfb-group">
            <span className="rfb-lbl">Где</span>
            <div className="rfb-date">
              <Ico name="pin" size={14} />
              <input type="text" defaultValue="Алматы и область" />
            </div>
          </div>
        </div>

        <div className="rental-results">
          <div className="rental-info">Найдено <b>{items.length}</b> единиц техники в Алматы — доступны сегодня или в ближайшие 3 дня.</div>
          <div className="rental-grid">
            {items.map((r) => <RentalCard key={r.id} item={r} onBook={() => setSelected(r)} />)}
          </div>
        </div>

        {/* How it works */}
        <section className="rental-how">
          <h3>Как это работает</h3>
          <div className="how-grid">
            {[
              { n: '01', t: 'Подбор', d: 'Выбираете технику и сроки на сайте или по телефону.' },
              { n: '02', t: 'Договор', d: 'Заключаем договор аренды. Можем работать по 1С — закрывающие документы автоматически.' },
              { n: '03', t: 'Подача', d: 'Доставляем технику в течение 4 часов. Тралом в черте города — бесплатно.' },
              { n: '04', t: 'Закрытие', d: 'Возврат техники и подписание актов. Удалённый учёт моточасов через GPS.' },
            ].map((s) => (
              <div key={s.n} className="how-card">
                <div className="how-n">{s.n}</div>
                <div className="how-t">{s.t}</div>
                <div className="how-d">{s.d}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {selected && (
        <BookingSheet
          item={selected}
          onClose={() => setSelected(null)}
          onSubmit={(msg) => addToast(msg)}
        />
      )}

      <ToastHost toasts={toasts} onClear={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />
    </main>
  )
}
