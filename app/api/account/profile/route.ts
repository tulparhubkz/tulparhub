import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { profileEditSchema, profileToColumns } from '@/lib/auth-signup'

// Read the current user's editable profile so /account/profile can prefill its
// form (the session only carries a subset — e.g. it has `name`, not the split
// first/last name a физ. лицо edits).
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const [row] = await db
    .select({
      accountType: users.accountType,
      firstName: users.firstName,
      lastName: users.lastName,
      name: users.name,
      phone: users.phone,
      company: users.company,
      bin: users.bin,
      position: users.position,
    })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1)
  if (!row) return NextResponse.json({ error: 'not_found' }, { status: 404 })

  return NextResponse.json(row)
}

// Update the editable profile. Unlike /api/auth/complete this does not require
// re-accepting the terms and leaves termsAcceptedAt untouched — the user has
// already consented; here they are only changing checkout details.
export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 })
  }

  const parsed = profileEditSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'validation' }, { status: 400 })
  }

  const cols = profileToColumns(parsed.data)
  await db
    .update(users)
    .set({
      accountType: cols.accountType,
      role: cols.role,
      firstName: cols.firstName,
      lastName: cols.lastName,
      name: cols.name,
      phone: cols.phone,
      company: cols.company,
      bin: cols.bin,
      position: cols.position,
    })
    .where(eq(users.id, session.user.id))

  return NextResponse.json({ ok: true })
}
