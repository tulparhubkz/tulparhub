import { getAdmin } from '@/lib/admin'
import { listUsers } from '@/lib/services/users'
import { AdminDenied } from '@/components/admin/AdminDenied'
import { AdminUsers } from './AdminUsers'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  const admin = await getAdmin()
  if (!admin) return <AdminDenied />

  const users = await listUsers()
  return <AdminUsers users={users} adminId={admin.id} />
}
