'use client'
import { Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useRouter } from '@/i18n/navigation'
import { useT } from '@/lib/i18n'
import { SignupWizard } from '@/components/auth/SignupWizard'
import { ONBOARDING_SKIP_KEY } from '@/components/auth/ProfileGate'
import type { ProfileInput } from '@/lib/auth-signup'

function safeCallback(raw: string | null): string {
  if (!raw) return '/'
  if (raw.startsWith('/') && !raw.startsWith('//')) return raw
  return '/'
}

function CompleteInner() {
  const t = useT()
  const router = useRouter()
  const params = useSearchParams()
  const { data: session, status, update } = useSession()
  const dest = safeCallback(params.get('callbackUrl'))

  // Admins have no физ/юр profile to complete — send them straight through.
  const done = !!session?.user && (!!session.user.accountType || session.user.role === 'admin')

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/auth')
    else if (done) router.replace(dest)
  }, [status, done, dest, router])

  async function handleComplete(data: ProfileInput): Promise<{ error?: string } | void> {
    const res = await fetch('/api/auth/complete', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) return { error: t('auth.err.fields') }
    await update() // refresh session so the ProfileGate stops redirecting
    router.replace(dest)
  }

  function handleSkip() {
    // Remember the choice so ProfileGate stops redirecting; the user can finish
    // their profile later on /account/profile or at checkout.
    localStorage.setItem(ONBOARDING_SKIP_KEY, '1')
    router.replace(dest)
  }

  if (status !== 'authenticated' || done) return null

  return (
    <main className="suw-page">
      <SignupWizard onSubmit={handleComplete} onSkip={handleSkip} />
    </main>
  )
}

export default function CompletePage() {
  return (
    <Suspense>
      <CompleteInner />
    </Suspense>
  )
}
