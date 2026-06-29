import { db } from '@/lib/db'
import { syncRuns } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'

/** Recent importer runs (CSV today, 1C later), newest first — for the admin panel. */
export async function listSyncRuns(limit = 50) {
  return db.select().from(syncRuns).orderBy(desc(syncRuns.startedAt)).limit(limit)
}
