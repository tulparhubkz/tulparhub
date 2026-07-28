'use client'
import { useState, useTransition } from 'react'
import { AdminNav } from '@/components/admin/AdminNav'
import { setLeadStatus } from '../actions'

// Kept local (not imported from lib/services/leads) so the server-only DB
// client never leaks into the client bundle.
const KIND_RU: Record<string, string> = {
  callback: 'Обратный звонок',
  booking: 'Бронь аренды',
  quote: 'Запрос цены',
  rfq: 'Запрос цены',
  order: 'Заказ (легаси)',
}
const KIND_FILTERS = ['all', 'callback', 'booking', 'quote'] as const
const KIND_FILTER_RU: Record<string, string> = {
  all: 'Все',
  callback: 'Звонки',
  booking: 'Брони',
  quote: 'Запросы цены',
}

interface Lead {
  id: string
  kind: string
  status: string
  name: string
  phone: string
  email: string | null
  city: string | null
  comment: string | null
  meta: Record<string, unknown> | null
  createdAt: string | Date
}

function fmtDate(d: string | Date) {
  return new Date(d).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function metaLine(l: Lead): string | null {
  const m = l.meta ?? {}
  const parts: string[] = []
  if (typeof m.unit_id === 'string' && m.unit_id) parts.push(`Техника: ${m.unit_id}`)
  if (typeof m.date_from === 'string' && m.date_from) parts.push(`${m.date_from} → ${typeof m.date_to === 'string' && m.date_to ? m.date_to : '…'}`)
  if (typeof m.address === 'string' && m.address) parts.push(m.address)
  if (Array.isArray(m.items) && m.items.length) parts.push(`${m.items.length} поз.`)
  return parts.length ? parts.join(' · ') : null
}

export function AdminLeads({ leads }: { leads: Lead[] }) {
  const [rows, setRows] = useState(leads)
  const [kind, setKind] = useState<(typeof KIND_FILTERS)[number]>('all')
  const [showDone, setShowDone] = useState(false)
  const [, startTransition] = useTransition()

  const onToggle = (id: string, done: boolean) => {
    const status = done ? 'done' : 'new'
    setRows((r) => r.map((l) => (l.id === id ? { ...l, status } : l)))
    startTransition(async () => {
      const res = await setLeadStatus(id, status)
      if (!res.ok) location.reload()
    })
  }

  const visible = rows.filter(
    (l) => (kind === 'all' || l.kind === kind || (kind === 'quote' && l.kind === 'rfq')) && (showDone || l.status !== 'done'),
  )
  const newCount = rows.filter((l) => l.status !== 'done').length

  return (
    <main className="adm">
      <div className="container">
        <AdminNav />
        <header className="al-head">
          <div>
            <h1>Заявки</h1>
            <p>{newCount} необработанных из {rows.length} за последнее время</p>
          </div>
        </header>

        <div className="al-filters">
          {KIND_FILTERS.map((k) => (
            <button key={k} className={`chip${kind === k ? ' on' : ''}`} onClick={() => setKind(k)}>
              {KIND_FILTER_RU[k]}
            </button>
          ))}
          <label className="al-done-toggle">
            <input type="checkbox" checked={showDone} onChange={(e) => setShowDone(e.target.checked)} />
            показать обработанные
          </label>
        </div>

        {visible.length === 0 ? (
          <div className="empty-state">{showDone ? 'Заявок нет.' : 'Необработанных заявок нет.'}</div>
        ) : (
          <div className="al-list">
            {visible.map((l) => (
              <div key={l.id} className={`al-card${l.status === 'done' ? ' done' : ''}`}>
                <div className="al-top">
                  <span className={`al-kind k-${l.kind}`}>{KIND_RU[l.kind] ?? l.kind}</span>
                  <span className="al-date">{fmtDate(l.createdAt)}</span>
                </div>
                <div className="al-who">
                  <b>{l.name}</b>
                  <a href={`tel:${l.phone}`}>{l.phone}</a>
                  {l.email && <span className="al-sub">{l.email}</span>}
                  {l.city && <span className="al-sub">{l.city}</span>}
                </div>
                {metaLine(l) && <div className="al-meta">{metaLine(l)}</div>}
                {l.comment && <div className="al-comment">{l.comment}</div>}
                <label className="al-check">
                  <input
                    type="checkbox"
                    checked={l.status === 'done'}
                    onChange={(e) => onToggle(l.id, e.target.checked)}
                  />
                  обработан
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx global>{`
        .al-head { margin-bottom: 16px; }
        .al-head h1 { font-size: var(--text-2xl); font-weight: 800; letter-spacing: -0.02em; }
        .al-head p { font-size: var(--text-sm); color: var(--ink-3); margin-top: 4px; }
        .al-filters { display: flex; align-items: center; gap: var(--sp-2); flex-wrap: wrap; margin-bottom: var(--sp-4); }
        .al-done-toggle { display: inline-flex; align-items: center; gap: 6px; font-size: var(--text-sm); color: var(--ink-2); margin-left: auto; cursor: pointer; }
        .al-list { display: flex; flex-direction: column; gap: var(--sp-3); }
        .al-card { background: var(--surf); border: 1.5px solid var(--line); border-radius: 14px; padding: var(--sp-4); display: flex; flex-direction: column; gap: var(--sp-2); }
        .al-card.done { opacity: 0.55; }
        .al-top { display: flex; justify-content: space-between; align-items: center; gap: var(--sp-2); }
        .al-kind { font-size: var(--text-xs); font-weight: 700; padding: 4px 10px; border-radius: 999px; background: var(--surf-2); color: var(--ink-2); }
        .al-kind.k-callback { background: var(--accent-soft); color: var(--accent-deep); }
        .al-kind.k-booking { background: #eef2ff; color: #4338ca; }
        .al-kind.k-quote, .al-kind.k-rfq { background: var(--ok-soft); color: var(--ok); }
        .al-date { font-size: var(--text-xs); color: var(--ink-3); }
        .al-who { display: flex; align-items: baseline; gap: var(--sp-3); flex-wrap: wrap; font-size: var(--text-md); }
        .al-who a { color: var(--accent); font-weight: 600; text-decoration: none; }
        .al-sub { color: var(--ink-3); font-size: var(--text-sm); }
        .al-meta { font-size: var(--text-sm); color: var(--ink-2); }
        .al-comment { font-size: var(--text-sm); color: var(--ink-2); background: var(--surf-2); border-radius: 8px; padding: var(--sp-2) var(--sp-3); }
        .al-check { display: inline-flex; align-items: center; gap: 8px; font-size: var(--text-sm); color: var(--ink-2); cursor: pointer; align-self: flex-start; padding: var(--sp-1) 0; }
      `}</style>
    </main>
  )
}
