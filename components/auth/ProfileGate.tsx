'use client'
import { useEffect } from 'react'
import { usePathname, useRouter } from '@/i18n/navigation'
import { useSession } from 'next-auth/react'
import { LEGAL_SLUGS } from '@/lib/legal/types'

// Pages an un-onboarded user may still open. The legal documents are here so
// the consent checkbox on the wizard is verifiable, and /account so they can
// sign out or switch language without first completing a profile. Imported
// from lib/legal/types rather than lib/legal so the documents themselves don't
// end up in every page's bundle (this gate mounts in the root layout).
const ALLOWED = new Set<string>([
  '/auth',
  '/auth/complete',
  '/account',
  ...LEGAL_SLUGS.map((slug) => `/${slug}`),
])

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
    if (ALLOWED.has(pathname)) return
    const cb = encodeURIComponent(pathname || '/')
    router.replace(`/auth/complete?callbackUrl=${cb}`)
  }, [status, session, pathname, router])

  return null
}
