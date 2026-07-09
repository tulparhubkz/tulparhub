'use client'
import { Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useRouter } from '@/i18n/navigation'
import { useT } from '@/lib/i18n'
import { SignupWizard } from '@/components/auth/SignupWizard'
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

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/auth')
    else if (session?.user && session.user.accountType) router.replace(dest)
  }, [status, session, dest, router])

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

  if (status !== 'authenticated' || session.user.accountType) return null

  return (
    <main className="suw-page">
      <SignupWizard onSubmit={handleComplete} />
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
