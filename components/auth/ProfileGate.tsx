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
  // The profile page lets a user fill in the same details as the wizard, so it
  // must stay reachable even before onboarding is completed.
  '/account/profile',
  ...LEGAL_SLUGS.map((slug) => `/${slug}`),
])

// localStorage flag set when a user chooses "Пропустить" on the signup wizard.
// Onboarding is optional: once skipped, the gate stops nudging them to
// /auth/complete and they can browse and check out (the checkout form collects
// any missing contact details) or finish their profile later on /account/profile.
export const ONBOARDING_SKIP_KEY = 'th-onboard-skipped'

// Nudge authenticated users who haven't completed their profile (accountType is
// null — e.g. a fresh Google sign-in) to /auth/complete, unless they've chosen
// to skip for now. Email magic-link sign-ups already have their profile applied
// at createUser, so they skip this. Admins (staff) have no физ/юр account type
// and must never be onboarded.
export function ProfileGate() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (status !== 'authenticated') return
    if (session.user.accountType || session.user.role === 'admin') return
    if (ALLOWED.has(pathname)) return
    if (localStorage.getItem(ONBOARDING_SKIP_KEY)) return
    const cb = encodeURIComponent(pathname || '/')
    router.replace(`/auth/complete?callbackUrl=${cb}`)
  }, [status, session, pathname, router])

  return null
}
