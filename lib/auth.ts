import NextAuth, { type NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'
import Nodemailer from 'next-auth/providers/nodemailer'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from '@/lib/db'
import { users, accounts, sessions, verificationTokens } from '@/lib/db/schema'

// Providers are wired conditionally so the app boots fine before credentials
// exist. Add AUTH_GOOGLE_ID/SECRET and/or EMAIL_SERVER to .env to enable them.
const providers: NextAuthConfig['providers'] = []
if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(Google) // auto-reads AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET
}
if (process.env.EMAIL_SERVER) {
  providers.push(
    Nodemailer({ server: process.env.EMAIL_SERVER, from: process.env.EMAIL_FROM }),
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
        session.user.id = user.id
        session.user.role = (user as { role?: string }).role ?? 'retail'
      }
      return session
    },
  },
})
