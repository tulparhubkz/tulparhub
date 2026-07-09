'use client'
import { useEffect } from 'react'
import { usePathname, useRouter } from '@/i18n/navigation'
import { useSession } from 'next-auth/react'

// Push authenticated users who haven't completed their profile (accountType is
// null — e.g. a fresh Google sign-in) to /auth/complete. Email magic-link
// sign-ups already have their profile applied at createUser, so they skip this.
// Admins (staff) have no физ/юр account type and must never be onboarded.
export function ProfileGate() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (status !== 'authenticated') return
    if (session.user.accountType || session.user.role === 'admin') return
    if (pathname === '/auth/complete' || pathname === '/auth') return
    const cb = encodeURIComponent(pathname || '/')
    router.replace(`/auth/complete?callbackUrl=${cb}`)
  }, [status, session, pathname, router])

  return null
}
