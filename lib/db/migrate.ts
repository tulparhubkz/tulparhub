/**
 * Apply pending Drizzle migrations. Run in the container on deploy:
 *   node -r dotenv/config ... OR via `npm run db:migrate`
 */
import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Pool } from 'pg'
import { sslOption } from './ssl'

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: sslOption(),
  })
  const db = drizzle(pool)
  console.log('Running migrations…')
  await migrate(db, { migrationsFolder: './drizzle' })
  console.log('Migrations complete.')
  await pool.end()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
