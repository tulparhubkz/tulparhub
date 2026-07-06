import { getAdmin } from '@/lib/admin'
import { listLeads } from '@/lib/services/leads'
import { AdminDenied } from '@/components/admin/AdminDenied'
import { AdminLeads } from './AdminLeads'

export const dynamic = 'force-dynamic'

export default async function AdminLeadsPage() {
  const admin = await getAdmin()
  if (!admin) return <AdminDenied />

  const leads = await listLeads()
  return <AdminLeads leads={leads} />
}
