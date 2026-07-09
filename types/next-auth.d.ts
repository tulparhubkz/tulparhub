import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
      accountType: string | null
    } & DefaultSession['user']
  }

  interface User {
    role?: string
    accountType?: string | null
  }
}
