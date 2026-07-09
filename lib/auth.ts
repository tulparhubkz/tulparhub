import NextAuth, { type NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'
import Resend from 'next-auth/providers/resend'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from '@/lib/db'
import { users, accounts, sessions, verificationTokens } from '@/lib/db/schema'
import { sendVerificationRequest, emailConfigErrors } from '@/lib/auth-email'

// Providers are wired conditionally so the app boots fine before credentials
// exist. Add AUTH_GOOGLE_ID/SECRET and/or RESEND_API_KEY to enable them.
const providers: NextAuthConfig['providers'] = []
if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(Google) // auto-reads AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET
}

// Email magic-link sender via Resend's HTTP API (see lib/auth-email). We use the
// API rather than SMTP because hosts like Render block outbound SMTP ports.
// EMAIL_FROM must be an address on a Resend-verified domain. Inert until set.
// Log any config gaps at boot (visible in deploy logs); GET
// /api/auth/email-diagnostics reports the same codes on demand.
const emailErrors = emailConfigErrors()
if (emailErrors.length) {
  console.warn(`[auth] email sign-in config issues: ${emailErrors.join(', ')}`)
}
if (process.env.RESEND_API_KEY) {
  providers.push(
    Resend({ apiKey: process.env.RESEND_API_KEY, from: process.env.EMAIL_FROM, sendVerificationRequest }),
  )
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: { strategy: 'database' },
  pages: { signIn: '/auth' },
  trustHost: true, // self-hosted behind Caddy
  providers,
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        const u = user as { role?: string; accountType?: string | null }
        session.user.id = user.id
        session.user.role = u.role ?? 'retail'
        // Null until the profile is completed — the client ProfileGate uses this
        // to push fresh Google sign-ins through /auth/complete.
        session.user.accountType = u.accountType ?? null
      }
      return session
    },
  },
})
