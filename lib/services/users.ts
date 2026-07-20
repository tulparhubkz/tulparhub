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

export interface OrderContactInfo {
  b2b: boolean
  name: string
  phone: string
  company?: string | null
  bin?: string | null
}

// The customer snapshot an order carries, as stored on the orders row.
export interface OrderContactSnapshot {
  customerName: string
  customerPhone: string
  company: string | null
  bin: string | null
}

// Rebuild the checkout contact info from a stored order, so a guest order that
// gets claimed after signing in can backfill the profile the same way a
// signed-in checkout does. Orders have no b2b column (and b2b pricing is forced
// off for guests), so company/bin presence is the signal that it was a ЮЛ order.
export function contactInfoFromOrder(o: OrderContactSnapshot): OrderContactInfo {
  const company = o.company?.trim() || null
  const bin = o.bin?.trim() || null
  return {
    b2b: !!(company || bin),
    name: o.customerName,
    phone: o.customerPhone,
    company,
    bin,
  }
}

// The current profile fields that decide what a checkout order may backfill.
export interface ProfileSnapshot {
  accountType: string | null
  firstName: string | null
  lastName: string | null
  name: string | null
  phone: string | null
  company: string | null
  bin: string | null
}

// Decide which profile columns a checkout order should write. Only fills fields
// that are still empty — a one-off order for someone else must not overwrite the
// saved profile — and only declares the account type/role when the profile was
// never completed (e.g. a user who skipped onboarding), matching how signup maps
// физ→retail / юр→b2b. It never downgrades or flips the role of an already-
// onboarded user. Pure so it can be unit-tested without a DB.
export function computeProfileBackfill(cur: ProfileSnapshot, info: OrderContactInfo): Partial<typeof users.$inferInsert> {
  const set: Partial<typeof users.$inferInsert> = {}

  const name = info.name.trim()
  const phone = info.phone.trim()
  const company = info.company?.trim() || null
  const bin = info.bin?.trim() || null

  if (!cur.name && name) set.name = name
  if (!cur.phone && phone) set.phone = phone
  if (info.b2b) {
    if (!cur.company && company) set.company = company
    if (!cur.bin && bin) set.bin = bin
  }

  // First-time profile completion: declare type + role and split the name into
  // first/last for a физ. лицо (the profile form edits those two fields).
  if (!cur.accountType) {
    set.accountType = info.b2b ? 'company' : 'individual'
    set.role = info.b2b ? 'b2b' : 'retail'
    if (!info.b2b && name) {
      const parts = name.split(/\s+/)
      if (!cur.firstName) set.firstName = parts[0]
      if (!cur.lastName && parts.length > 1) set.lastName = parts.slice(1).join(' ')
    }
  }

  return set
}

// Save the contact details a signed-in user typed at checkout onto their
// profile, so /account/profile shows them and the next checkout prefills.
export async function backfillProfileFromOrder(userId: string, info: OrderContactInfo): Promise<void> {
  const [cur] = await db
    .select({
      accountType: users.accountType,
      firstName: users.firstName,
      lastName: users.lastName,
      name: users.name,
      phone: users.phone,
      company: users.company,
      bin: users.bin,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)
  if (!cur) return

  const set = computeProfileBackfill(cur, info)
  if (Object.keys(set).length === 0) return
  await db.update(users).set(set).where(eq(users.id, userId))
}
