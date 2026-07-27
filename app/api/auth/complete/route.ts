import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { profileSchema, profileToColumns } from '@/lib/auth-signup'

// Complete the profile for a signed-in user whose accountType is still null
// (e.g. a fresh Google sign-in). The email/identity come from the session — the
// form only supplies the account-type fields.
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

  const parsed = profileSchema.safeParse(body)
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
      termsAcceptedAt: new Date(),
    })
    .where(eq(users.id, session.user.id))

  return NextResponse.json({ ok: true })
}
