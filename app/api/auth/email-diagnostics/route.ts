import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { emailDiagnostics } from '@/lib/auth-email'

// Reports exactly why email sign-in is (mis)configured — the specific codes,
// plus an optional live test send (`?test=1`) to Resend's test address.
//   GET /api/auth/email-diagnostics
//   GET /api/auth/email-diagnostics?test=1
// Access: an admin session, OR `Authorization: Bearer <AUTH_SECRET>` (so it
// still works when email/login itself is broken). Never returns secrets.
export async function GET(req: Request) {
  const session = await auth()
  const isAdmin = session?.user?.role === 'admin'
  const bearer = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  const hasToken = !!process.env.AUTH_SECRET && bearer === process.env.AUTH_SECRET
  if (!isAdmin && !hasToken) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const test = new URL(req.url).searchParams.get('test') === '1'
  const diag = await emailDiagnostics(test)
  return NextResponse.json(diag, { status: diag.ok ? 200 : 503 })
}
