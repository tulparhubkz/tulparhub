'use client'
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useLocale } from 'next-intl'
import { setVisitParams, setUserID, userParams } from '@/lib/analytics'

// Feeds Metrica the session dimensions: locale + authorized flag on every
// visit, and (for logged-in users) the account id and role. The effect re-runs
// when the session resolves (status: loading -> authenticated/unauthenticated),
// by which point the Metrica tag has loaded, so the calls land.
export function MetricaIdentity() {
  const { data: session, status } = useSession()
  const locale = useLocale()

  useEffect(() => {
    if (status === 'loading') return
    const authorized = status === 'authenticated'
    setVisitParams({ locale, authorized: authorized ? 1 : 0 })
    if (authorized && session?.user?.id) {
      setUserID(session.user.id)
      userParams({ role: session.user.role ?? 'retail' })
    }
  }, [status, session?.user?.id, session?.user?.role, locale])

  return null
}
