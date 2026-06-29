import { getAdmin } from '@/lib/admin'
import { listOrders } from '@/lib/services/orders'
import { AdminDenied } from '@/components/admin/AdminDenied'
import { AdminOrders } from './AdminOrders'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const admin = await getAdmin()
  if (!admin) return <AdminDenied />

  const orders = await listOrders()
  return <AdminOrders orders={orders} adminEmail={admin.email} />
}
