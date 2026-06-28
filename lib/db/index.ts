import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

// `pg` builds the pool lazily (no connection until first query), so constructing
// it at import time is safe even without DATABASE_URL — keeps `next build` and
// Docker image builds working. Missing config only fails when a query runs.
const connectionString = process.env.DATABASE_URL
if (!connectionString) console.warn('[db] DATABASE_URL is not set — queries will fail')

// Hosted Postgres (Neon/Supabase/Render on Vercel) needs TLS; local/Docker does not.
const isLocal = /@(localhost|127\.0\.0\.1|db)([:/]|$)/.test(connectionString ?? '')
const ssl = connectionString && !isLocal ? { rejectUnauthorized: false } : undefined

// Reuse the pool across dev hot-reloads to avoid exhausting connections.
const globalForDb = globalThis as unknown as { __pgPool?: Pool }
const pool =
  globalForDb.__pgPool ??
  new Pool({ connectionString, ssl, max: Number(process.env.DATABASE_POOL_MAX ?? 10) })
if (process.env.NODE_ENV !== 'production') globalForDb.__pgPool = pool

export const db = drizzle(pool, { schema })
export { schema }
