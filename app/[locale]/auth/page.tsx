'use client'
import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useLocale } from 'next-intl'
import { signIn } from 'next-auth/react'
import { useT } from '@/lib/i18n'

// Honor ?callbackUrl= (e.g. the order-success claim flow, #48) but only for
// same-origin targets — never become an open redirect. Defaults to the current
// /{locale} home so both the post-login landing and the magic-link email keep
// the user's language.
function safeCallback(raw: string | null, fallback: string): string {
  if (!raw) return fallback
  if (raw.startsWith('/') && !raw.startsWith('//')) return raw
  try {
    const u = new URL(raw)
    if (u.origin === window.location.origin) return u.pathname + u.search
  } catch {
    /* not a URL — fall through */
  }
  return fallback
}

function AuthInner() {
  const t = useT()
  const params = useSearchParams()
  const locale = useLocale()
  const callbackUrl = safeCallback(params.get('callbackUrl'), `/${locale}`)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await signIn('nodemailer', { email, redirect: false, callbackUrl })
    setLoading(false)
    if (res?.error) {
      setError(t('auth.error'))
    } else {
      setSent(true)
    }
  }

  return (
    <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surf-2)', padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 420, background: 'var(--surf)', borderRadius: 16, boxShadow: 'var(--shadow-md)', overflow: 'hidden' }}>
        {/* Logo header */}
        <div style={{ background: 'var(--accent)', padding: '24px 32px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="rgba(255,255,255,0.2)" />
            <path d="M6 22 L16 8 L26 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="16" cy="22" r="3" fill="white" />
          </svg>
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 18, letterSpacing: '-0.5px' }}>TULPAR HUB</div>
            <div style={{ color: 'rgba(255,255,255,.7)', fontSize: 12 }}>{t('auth.tagline')}</div>
          </div>
        </div>

        <div style={{ padding: 32 }}>
          {sent ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{t('auth.sent.title')}</h2>
              <p style={{ color: 'var(--ink-2)', fontSize: 14, lineHeight: 1.6 }}>
                {t('auth.sent.pre')}<b>{email}</b>{t('auth.sent.post')}
              </p>
            </div>
          ) : (
            <>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{t('auth.title')}</h2>
              <p style={{ color: 'var(--ink-2)', fontSize: 14, marginBottom: 24 }}>{t('auth.sub')}</p>

              {/* Google */}
              <button type="button" onClick={() => signIn('google', { callbackUrl })}
                style={{ width: '100%', padding: '12px 0', border: '1.5px solid var(--line-2)', borderRadius: 10, background: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', color: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
                <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"/><path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.34A9 9 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.94H.96a9 9 0 0 0 0 8.12l3.01-2.34z"/><path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 .96 4.94l3.01 2.34C4.68 5.16 6.66 3.58 9 3.58z"/></svg>
                {t('auth.google')}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0 20px', color: 'var(--ink-3)', fontSize: 12 }}>
                <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />{t('auth.or')}<span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
              </div>

              {/* Email magic link */}
              <form onSubmit={handleEmail}>
                <label style={{ display: 'block', marginBottom: 16 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-2)', display: 'block', marginBottom: 6 }}>{t('auth.emailLabel')}</span>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="example@mail.com"
                    style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--line-2)', borderRadius: 10, fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
                </label>

                {error && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px', color: '#dc2626', fontSize: 13, marginBottom: 16 }}>
                    {error}
                  </div>
                )}

                <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', opacity: loading ? 0.7 : 1 }}>
                  {loading ? t('auth.loading') : t('auth.submit')}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  )
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthInner />
    </Suspense>
  )
}
