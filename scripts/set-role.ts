// Usage: npx tsx scripts/set-role.ts <retail|b2b|admin> <email>
// One-off role switcher until there's an admin UI for user roles.
import 'dotenv/config'
import { eq } from 'drizzle-orm'
import { db } from '../lib/db'
import { users } from '../lib/db/schema'

const ROLES = ['retail', 'b2b', 'admin']

async function main() {
  const [role, email] = process.argv.slice(2)
  if (!ROLES.includes(role) || !email) {
    console.error('Usage: npx tsx scripts/set-role.ts <retail|b2b|admin> <email>')
    process.exit(1)
  }
  const rows = await db.update(users).set({ role }).where(eq(users.email, email)).returning({ email: users.email, role: users.role })
  if (rows.length === 0) {
    console.error(`No user with email ${email} — sign in on the site once first.`)
    process.exit(1)
  }
  console.log(`✓ ${rows[0].email} → role=${rows[0].role}`)
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1) })
