import { getAdmin } from '@/lib/admin'
import { listSyncRuns } from '@/lib/services/sync'
import { AdminNav } from '@/components/admin/AdminNav'
import { AdminDenied } from '@/components/admin/AdminDenied'
import { SyncLog } from '@/components/admin/SyncLog'

export const dynamic = 'force-dynamic'

function fmt(d: Date | null) {
  return d ? new Date(d).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''
}

export default async function SyncPage() {
  const admin = await getAdmin()
  if (!admin) return <AdminDenied />

  const runs = await listSyncRuns()
  const rows = runs.map((r) => ({
    id: r.id,
    source: r.source,
    status: r.status,
    startedAt: fmt(r.startedAt),
    finishedAt: fmt(r.finishedAt),
    rowsRead: r.rowsRead,
    partsUpserted: r.partsUpserted,
    stockUpserted: r.stockUpserted,
    error: r.error,
  }))

  return (
    <main style={{ padding: '24px 0 80px' }}>
      <div className="container">
        <AdminNav />
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-.02em', marginBottom: 16 }}>Импорт каталога</h1>
        <SyncLog rows={rows} />
      </div>
    </main>
  )
}
