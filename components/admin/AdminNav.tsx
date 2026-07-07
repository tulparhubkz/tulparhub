'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { href: '/admin', label: 'Заказы' },
  { href: '/admin/sync', label: 'Импорт каталога' },
  { href: '/admin/users', label: 'Пользователи' },
]

export function AdminNav() {
  const path = usePathname()
  return (
    <nav className="anav">
      {TABS.map((t) => (
        <Link key={t.href} href={t.href} className={path === t.href ? 'on' : ''}>
          {t.label}
        </Link>
      ))}
      <style jsx>{`
        .anav { display: flex; gap: 4px; border-bottom: 1.5px solid var(--line); margin-bottom: 22px; }
        .anav :global(a) { padding: 10px 16px; font-size: 14px; font-weight: 600; color: var(--ink-2); border-bottom: 2px solid transparent; margin-bottom: -1.5px; text-decoration: none; }
        .anav :global(a:hover) { color: var(--ink); }
        .anav :global(a.on) { color: var(--accent); border-bottom-color: var(--accent); }
      `}</style>
    </nav>
  )
}
