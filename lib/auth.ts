import NextAuth, { type NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'
import Nodemailer from 'next-auth/providers/nodemailer'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from '@/lib/db'
import { users, accounts, sessions, verificationTokens } from '@/lib/db/schema'
import { sendVerificationRequest } from '@/lib/auth-email'

// Providers are wired conditionally so the app boots fine before credentials
// exist. Add AUTH_GOOGLE_ID/SECRET and/or an email provider to enable them.
const providers: NextAuthConfig['providers'] = []
if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(Google) // auto-reads AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET
}

// Email magic-link sender. Resend is the default: set RESEND_API_KEY and we
// build its SMTP connection string automatically (host smtp.resend.com, user
// literally "resend", password = the API key). EMAIL_SERVER stays as a fallback
// for any other SMTP host. EMAIL_FROM must be an address on a domain verified
// in Resend (e.g. no-reply@tulparhub.kz). Inert until one of them is set.
const emailServer = process.env.RESEND_API_KEY
  ? `smtp://resend:${process.env.RESEND_API_KEY}@smtp.resend.com:587`
  : process.env.EMAIL_SERVER
if (emailServer) {
  providers.push(
    Nodemailer({ server: emailServer, from: process.env.EMAIL_FROM, sendVerificationRequest }),
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
