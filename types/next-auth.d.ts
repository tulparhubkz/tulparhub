import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
      accountType: string | null
      // Profile fields collected at signup, exposed so checkout can prefill its
      // contact form instead of asking for them a second time.
      phone: string | null
      company: string | null
      bin: string | null
    } & DefaultSession['user']
  }

  interface User {
    role?: string
    accountType?: string | null
    phone?: string | null
    company?: string | null
    bin?: string | null
  }
}
