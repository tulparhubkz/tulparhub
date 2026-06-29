import Link from 'next/link'
import { getAdmin } from '@/lib/admin'
import { listOrders } from '@/lib/services/orders'
import { AdminOrders } from './AdminOrders'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const admin = await getAdmin()

  if (!admin) {
    return (
      <main className="container" style={{ padding: '64px 16px', maxWidth: 560 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Доступ запрещён</h1>
        <p style={{ color: 'var(--ink-2)', lineHeight: 1.6 }}>
          Раздел администратора доступен только пользователям с ролью <b>admin</b>.{' '}
          <Link href="/auth?callbackUrl=/admin" style={{ color: 'var(--accent)' }}>Войти</Link>.
        </p>
      </main>
    )
  }

  const orders = await listOrders()
  return <AdminOrders orders={orders} adminEmail={admin.email} />
}
