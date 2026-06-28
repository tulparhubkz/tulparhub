import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'
import { sslOption } from './ssl'

// `pg` builds the pool lazily (no connection until first query), so constructing
// it at import time is safe even without DATABASE_URL — keeps `next build` and
// Docker image builds working. Missing config only fails when a query runs.
const connectionString = process.env.DATABASE_URL
if (!connectionString) console.warn('[db] DATABASE_URL is not set — queries will fail')

// Reuse the pool across dev hot-reloads to avoid exhausting connections.
const globalForDb = globalThis as unknown as { __pgPool?: Pool }
const pool =
  globalForDb.__pgPool ??
  new Pool({
    connectionString,
    ssl: sslOption(connectionString),
    max: Number(process.env.DATABASE_POOL_MAX ?? 10),
  })
if (process.env.NODE_ENV !== 'production') globalForDb.__pgPool = pool

export const db = drizzle(pool, { schema })
export { schema }
