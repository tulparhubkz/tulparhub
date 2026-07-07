import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'

export const USER_ROLES = ['retail', 'b2b', 'admin'] as const
export type UserRole = (typeof USER_ROLES)[number]

export interface AdminUserRow {
  id: string
  name: string | null
  email: string
  role: string
  phone: string | null
  company: string | null
  createdAt: Date
}

/** All registered users, newest first — for the admin panel. */
export async function listUsers(limit = 200): Promise<AdminUserRow[]> {
  return db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      phone: users.phone,
      company: users.company,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt))
    .limit(limit)
}

export async function updateUserRole(id: string, role: UserRole) {
  if (!USER_ROLES.includes(role)) throw new Error(`updateUserRole: invalid role "${role}"`)
  await db.update(users).set({ role }).where(eq(users.id, id))
}
