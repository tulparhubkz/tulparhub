'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from '@/i18n/navigation'
import { Ico } from '@/components/ui/Ico'
import { PhoneInput } from '@/components/auth/PhoneInput'
import { useT } from '@/lib/i18n'
import { DEFAULT_POSITION, type AccountType, type ProfileEditInput } from '@/lib/auth-signup'

// Личный профиль: view and edit the details that prefill the checkout form.
// The user reaches this from the account hub; it works whether or not they
// completed onboarding (a skipped user has accountType null and starts here).

type ProfileData = {
  accountType: AccountType | null
  firstName: string | null
  lastName: string | null
  name: string | null
  phone: string | null
  company: string | null
  bin: string | null
  position: string | null
}

// Stored phone is E.164 (+7XXXXXXXXXX); PhoneInput wants the 10 national digits.
function toNational(phone: string | null): string {
  return (phone ?? '').replace(/\D/g, '').slice(-10)
}

export default function ProfilePage() {
  const t = useT()
  const router = useRouter()
  const { data: session, status, update } = useSession()

  const [loaded, setLoaded] = useState(false)
  const [type, setType] = useState<AccountType>('individual')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [contact, setContact] = useState('') // company contact person
  const [company, setCompany] = useState('')
  const [bin, setBin] = useState('')
  const [phone, setPhone] = useState('') // raw national digits

  const [saving, setSaving] = useState(false)
  const [status2, setStatus2] = useState<'idle' | 'saved' | 'error'>('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/auth?callbackUrl=/account/profile')
  }, [status, router])

  // Load the current profile once authenticated.
  useEffect(() => {
    if (status !== 'authenticated' || loaded) return
    let alive = true
    fetch('/api/account/profile')
      .then((r) => (r.ok ? r.json() : null))
      .then((d: ProfileData | null) => {
        if (!alive || !d) return
        if (d.accountType) setType(d.accountType)
        setFirstName(d.firstName ?? '')
        setLastName(d.lastName ?? '')
        setContact(d.name ?? '')
        setCompany(d.company ?? '')
        setBin(d.bin ?? '')
        setPhone(toNational(d.phone))
      })
      .finally(() => { if (alive) setLoaded(true) })
    return () => { alive = false }
  }, [status, loaded])

  const binOk = /^\d{12}$/.test(bin)

  function validate(): string | null {
    if (phone.length < 10) return t('auth.err.phone')
    if (type === 'individual') {
      if (!firstName.trim() || !lastName.trim()) return t('auth.err.fields')
    } else {
      if (!binOk) return t('auth.err.bin')
      if (!company.trim() || !contact.trim()) return t('auth.err.fields')
    }
    return null
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setStatus2('idle')
    setError('')
    const v = validate()
    if (v) { setError(v); setStatus2('error'); return }

    const e164 = `+7${phone}`
    const payload: ProfileEditInput =
      type === 'individual'
        ? { accountType: 'individual', firstName: firstName.trim(), lastName: lastName.trim(), phone: e164 }
        : { accountType: 'company', bin: bin.trim(), name: contact.trim(), company: company.trim(), position: DEFAULT_POSITION, phone: e164 }

    setSaving(true)
    const res = await fetch('/api/account/profile', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    })
    setSaving(false)
    if (!res.ok) { setError(t('profile.error')); setStatus2('error'); return }
    await update() // refresh session so checkout prefill picks up the changes
    setStatus2('saved')
  }

  if (status !== 'authenticated') return null

  return (
    <main className="acc prof">
      <h1 className="prof-title">{t('profile.title')}</h1>
      <p className="prof-sub">{t('profile.sub')}</p>

      <form onSubmit={save} className="prof-form">
        <div className="prof-field">
          <label>{t('profile.accountType')}</label>
          <div className="prof-seg">
            <button type="button" className={type === 'individual' ? 'on' : ''} onClick={() => setType('individual')}>
              {t('wiz.indiv.title')}
            </button>
            <button type="button" className={type === 'company' ? 'on' : ''} onClick={() => setType('company')}>
              {t('wiz.comp.title')}
            </button>
          </div>
        </div>

        {type === 'individual' ? (
          <div className="prof-grid">
            <div className="prof-field">
              <label htmlFor="p-first">{t('auth.field.firstName')}</label>
              <input id="p-first" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder={t('wiz.ph.firstName')} autoComplete="given-name" />
            </div>
            <div className="prof-field">
              <label htmlFor="p-last">{t('auth.field.lastName')}</label>
              <input id="p-last" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder={t('wiz.ph.lastName')} autoComplete="family-name" />
            </div>
          </div>
        ) : (
          <>
            <div className="prof-field">
              <label htmlFor="p-bin">{t('auth.field.bin')}</label>
              <input id="p-bin" value={bin} onChange={(e) => setBin(e.target.value.replace(/\D/g, '').slice(0, 12))} inputMode="numeric" placeholder="000000000000" />
            </div>
            <div className="prof-field">
              <label htmlFor="p-company">{t('auth.field.company')}</label>
              <input id="p-company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder={t('wiz.ph.company')} autoComplete="organization" />
            </div>
            <div className="prof-field">
              <label htmlFor="p-contact">{t('auth.field.contactName')}</label>
              <input id="p-contact" value={contact} onChange={(e) => setContact(e.target.value)} placeholder={t('wiz.ph.contactName')} autoComplete="name" />
            </div>
          </>
        )}

        <div className="prof-field">
          <label>{t('auth.field.phone')}</label>
          <PhoneInput value={phone} onChange={(v) => { setPhone(v); setStatus2('idle') }} />
        </div>

        {status2 === 'error' && error && <div className="prof-msg err">{error}</div>}
        {status2 === 'saved' && <div className="prof-msg ok"><Ico name="check" size={16} /> {t('profile.saved')}</div>}

        <button type="submit" className="btn btn-primary prof-save" disabled={saving || !loaded}>
          {saving ? t('profile.saving') : t('profile.save')}
        </button>
      </form>
    </main>
  )
}
