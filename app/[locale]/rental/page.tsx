'use client'
import { useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { Crumbs } from '@/components/ui/Crumbs'
import { ToastHost, type ToastItem } from '@/components/ui/Toast'
import { RentalCard } from '@/components/rental/RentalCard'
import { BookingSheet } from '@/components/rental/BookingSheet'
import { rental } from '@/lib/data'
import { useT } from '@/lib/i18n'
import type { RentalUnit } from '@/types'

export default function RentalPage() {
  const router = useRouter()
  const t = useT()
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
    { label: t('common.home'), onClick: () => router.push('/') },
    { label: t('rental.crumb') },
  ]

  const TYPE_PILLS: Array<[string, string]> = [
    ['all', t('rental.type.all')], ['excavator', t('rental.type.excavator')],
    ['loader', t('rental.type.loader')], ['dump', t('rental.type.dump')],
    ['crane', t('rental.type.crane')], ['roller', t('rental.type.roller')],
  ]
  const OP_PILLS: Array<[string, string]> = [
    ['any', t('rental.op.any')], ['yes', t('rental.op.yes')], ['no', t('rental.op.no')],
  ]

  return (
    <main className="rental">
      <div className="container">
        <Crumbs items={crumbs} />

        <header className="rental-head">
          <div>
            <div className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--ink-3)', marginBottom: 8 }}>
              <span className="eyebrow-dot" /> {t('rental.eyebrow')}
            </div>
            <h1>{t('rental.title')}</h1>
            <p>{t('rental.sub')}</p>
          </div>
        </header>

        {/* Filter bar */}
        <div className="rental-filterbar">
          <div className="rfb-group">
            <span className="rfb-lbl">{t('rental.filter.type')}</span>
            <div className="rfb-pills">
              {TYPE_PILLS.map(([k, l]) => (
                <button key={k} className={typeFilter === k ? 'on' : ''} onClick={() => setTypeFilter(k)}>{l}</button>
              ))}
            </div>
          </div>
          <div className="rfb-group">
            <span className="rfb-lbl">{t('rental.filter.operator')}</span>
            <div className="rfb-pills">
              {OP_PILLS.map(([k, l]) => (
                <button key={k} className={withOp === k ? 'on' : ''} onClick={() => setWithOp(k)}>{l}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="rental-results">
          <div className="rental-info">{t('rental.info.pre')}<b>{items.length}</b>{t('rental.info.post')}</div>
          <div className="rental-grid">
            {items.map((r) => <RentalCard key={r.id} item={r} onBook={() => setSelected(r)} />)}
          </div>
        </div>

        {/* How it works */}
        <section className="rental-how">
          <h3>{t('rental.how.title')}</h3>
          <div className="how-grid">
            {([
              { n: '01', t: 'rental.how1.title', d: 'rental.how1.text' },
              { n: '02', t: 'rental.how2.title', d: 'rental.how2.text' },
              { n: '03', t: 'rental.how3.title', d: 'rental.how3.text' },
              { n: '04', t: 'rental.how4.title', d: 'rental.how4.text' },
            ] as const).map((s) => (
              <div key={s.n} className="how-card">
                <div className="how-n">{s.n}</div>
                <div className="how-t">{t(s.t)}</div>
                <div className="how-d">{t(s.d)}</div>
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
