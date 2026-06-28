// Plain-ESM migration runner used inside the production container (no tsx needed).
// Local dev uses `npm run db:migrate` (tsx + migrate.ts) instead.
import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import pg from 'pg'

const cs = process.env.DATABASE_URL ?? ''
const wantsSsl =
  /sslmode=(require|verify)/.test(cs) || /[?&]ssl=true/.test(cs) || process.env.DATABASE_SSL === 'true'
const pool = new pg.Pool({
  connectionString: cs,
  ssl: wantsSsl ? { rejectUnauthorized: false } : undefined,
})
const db = drizzle(pool)
console.log('Running migrations…')
await migrate(db, { migrationsFolder: './drizzle' })
console.log('Migrations complete.')
await pool.end()
