'use client'
import { useState, useTransition } from 'react'
import { AdminNav } from '@/components/admin/AdminNav'
import { setUserRole } from '../actions'

// Kept local (not imported from lib/services/users) so the server-only DB client
// never leaks into the client bundle.
const ROLES = ['retail', 'b2b', 'admin'] as const
const ROLE_RU: Record<string, string> = {
  retail: 'Розница',
  b2b: 'Опт (B2B)',
  admin: 'Админ',
}

interface UserRow {
  id: string
  name: string | null
  email: string
  role: string
  phone: string | null
  company: string | null
  createdAt: string | Date
}

function fmtDate(d: string | Date) {
  return new Date(d).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function AdminUsers({ users, adminId }: { users: UserRow[]; adminId: string }) {
  const [rows, setRows] = useState(users)
  const [error, setError] = useState('')
  const [, startTransition] = useTransition()

  const onRole = (id: string, role: string) => {
    setError('')
    const prev = rows
    setRows((r) => r.map((u) => (u.id === id ? { ...u, role } : u)))
    startTransition(async () => {
      const res = await setUserRole(id, role as (typeof ROLES)[number])
      if (!res.ok) {
        setRows(prev) // revert the optimistic change
        setError(res.message ?? 'Не удалось обновить роль')
      }
    })
  }

  return (
    <main className="adm">
      <div className="container">
        <AdminNav />
        <header className="au-head">
          <h1>Пользователи</h1>
          <p>{rows.length} аккаунтов · роль действует со следующей загрузки страницы у пользователя</p>
        </header>

        {error && <div className="au-error">{error}</div>}

        <div className="au-table">
          <div className="au-row au-thead">
            <span>Email</span>
            <span>Имя</span>
            <span>Компания / телефон</span>
            <span>Зарегистрирован</span>
            <span>Роль</span>
          </div>
          {rows.map((u) => (
            <div key={u.id} className="au-row">
              <span className="au-email">{u.email}</span>
              <span>{u.name ?? '—'}</span>
              <span className="au-sub">{u.company || u.phone || '—'}</span>
              <span className="au-sub">{fmtDate(u.createdAt)}</span>
              {u.id === adminId ? (
                <span className="au-self" title="Свою роль менять нельзя — попросите другого админа">
                  {ROLE_RU[u.role] ?? u.role} (вы)
                </span>
              ) : (
                <select value={u.role} onChange={(e) => onRole(u.id, e.target.value)}>
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{ROLE_RU[r]}</option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .adm { padding: 24px 0 80px; }
        .au-head { margin-bottom: 18px; }
        .au-head h1 { font-size: 26px; font-weight: 800; letter-spacing: -0.02em; }
        .au-head p { font-size: 13px; color: var(--ink-3); margin-top: 4px; }
        .au-error { border: 1.5px solid #fca5a5; background: #fef2f2; color: #dc2626; border-radius: 10px; padding: 10px 14px; font-size: 13px; margin-bottom: 14px; }
        .au-table { background: var(--surf); border: 1.5px solid var(--line); border-radius: 14px; overflow: hidden; }
        .au-row { display: grid; grid-template-columns: 2fr 1.2fr 1.5fr 1fr 130px; gap: 12px; align-items: center; padding: 12px 16px; border-bottom: 1px solid var(--line); font-size: 14px; }
        .au-row:last-child { border-bottom: none; }
        .au-thead { font-size: 12px; font-weight: 600; color: var(--ink-3); background: var(--surf-2); }
        .au-email { font-weight: 600; word-break: break-all; }
        .au-sub { color: var(--ink-2); font-size: 13px; }
        .au-self { font-size: 13px; color: var(--ink-3); }
        .au-row select { border: 1.5px solid var(--line-2); border-radius: 8px; padding: 6px 8px; font-size: 13px; font-family: inherit; background: var(--surf); color: var(--ink); }
        @media (max-width: 720px) {
          .au-row { grid-template-columns: 1fr 110px; }
          .au-row > span:nth-child(2), .au-row > span:nth-child(3), .au-row > span:nth-child(4) { display: none; }
        }
      `}</style>
    </main>
  )
}
