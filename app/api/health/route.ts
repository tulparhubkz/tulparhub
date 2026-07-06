import { NextResponse } from 'next/server'
import { sql } from 'drizzle-orm'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

// Liveness + DB reachability. Used by the e2e webServer readiness probe and
// suitable for an external uptime monitor (Render free tier gives no alerts).
export async function GET() {
  try {
    await db.execute(sql`select 1`)
    return NextResponse.json({ ok: true, db: true })
  } catch {
    return NextResponse.json({ ok: false, db: false }, { status: 503 })
  }
}
