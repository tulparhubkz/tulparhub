'use client'
import { useState } from 'react'
import { Ico } from '@/components/ui/Ico'
import { useT } from '@/lib/i18n'
import { LegalModal, type LegalModalSlug } from '@/components/legal/LegalModal'
import { PhoneInput } from './PhoneInput'
import { DEFAULT_POSITION, type AccountType, type ProfileInput } from '@/lib/auth-signup'

// Two-step signup wizard for /auth/complete. The user is already authenticated
// (Google or email magic link) by the time they get here, so there is no email
// step — step 1 picks the account type, step 2 collects the matching profile,
// then we save. Layout/visuals follow the provided Kaspi-style mockups.

export function SignupWizard({
  onSubmit,
  onSkip,
}: {
  onSubmit: (data: ProfileInput) => Promise<{ error?: string } | void>
  // Optional "skip for now" escape hatch — onboarding is not a hard blocker.
  onSkip?: () => void
}) {
  const t = useT()
  const [step, setStep] = useState<1 | 2>(1)
  const [type, setType] = useState<AccountType>('individual')

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [bin, setBin] = useState('')
  const [company, setCompany] = useState('')
  const [contact, setContact] = useState('')
  const [phone, setPhone] = useState('') // raw national digits
  const [terms, setTerms] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  // Which legal document the terms popup is showing, if any. They open in a
  // modal rather than on /oferta and /privacy because ProfileGate bounces an
  // un-onboarded user straight back here.
  const [legal, setLegal] = useState<LegalModalSlug | null>(null)

  const binOk = /^\d{12}$/.test(bin)

  function validate(): string | null {
    if (phone.length < 10) return t('auth.err.phone')
    if (type === 'individual') {
      if (!firstName.trim() || !lastName.trim()) return t('auth.err.fields')
    } else {
      if (!binOk) return t('auth.err.bin')
      if (!company.trim() || !contact.trim()) return t('auth.err.fields')
    }
    if (!terms) return t('auth.err.terms')
    return null
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const v = validate()
    if (v) {
      setError(v)
      return
    }
    const e164 = `+7${phone}`
    const payload: ProfileInput =
      type === 'individual'
        ? { accountType: 'individual', firstName: firstName.trim(), lastName: lastName.trim(), phone: e164, terms: true }
        : { accountType: 'company', bin: bin.trim(), name: contact.trim(), company: company.trim(), position: DEFAULT_POSITION, phone: e164, terms: true }

    setLoading(true)
    const res = await onSubmit(payload)
    setLoading(false)
    if (res?.error) setError(res.error)
  }

  return (
    <div className="suw">
      <div className="suw-top">
        {step === 2 ? (
          <button type="button" className="suw-back" onClick={() => { setStep(1); setError('') }}>
            <Ico name="arrowLeft" size={18} />
            {t('wiz.back')}
          </button>
        ) : (
          <span />
        )}
        <div className="suw-steps" aria-hidden>
          <span className={step === 1 ? 'on' : 'done'} />
          <span className={step === 2 ? 'on' : ''} />
        </div>
      </div>

      {step === 1 ? (
        <>
          <h1 className="suw-title">{t('wiz.step1.title')}</h1>
          <p className="suw-sub">{t('wiz.step1.sub')}</p>

          <div className="suw-cards">
            <TypeCard
              on={type === 'individual'}
              icon="user"
              title={t('wiz.indiv.title')}
              desc={t('wiz.indiv.desc')}
              chips={[t('wiz.indiv.chip1'), t('wiz.indiv.chip2')]}
              onClick={() => setType('individual')}
            />
            <TypeCard
              on={type === 'company'}
              icon="truck"
              title={t('wiz.comp.title')}
              desc={t('wiz.comp.desc')}
              chips={[t('wiz.comp.chip1'), t('wiz.comp.chip2'), t('wiz.comp.chip3')]}
              badge={t('wiz.comp.badge')}
              onClick={() => setType('company')}
            />
          </div>

          <button type="button" className="suw-cta" onClick={() => setStep(2)}>
            {t('wiz.continue')} <Ico name="arrow" size={18} />
          </button>

          {onSkip && (
            <button type="button" className="suw-skip" onClick={onSkip}>
              {t('wiz.skip')}
            </button>
          )}
        </>
      ) : (
        <form onSubmit={submit}>
          <h1 className="suw-title">{type === 'company' ? t('wiz.step2.comp.title') : t('wiz.step2.indiv.title')}</h1>
          <p className="suw-sub">{type === 'company' ? t('wiz.step2.comp.sub') : t('wiz.step2.indiv.sub')}</p>

          <div className="suw-form">
            {type === 'individual' ? (
              <div className="suw-grid">
                <div className="suw-field">
                  <label htmlFor="w-first">{t('auth.field.firstName')}</label>
                  <input id="w-first" className="suw-input" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder={t('wiz.ph.firstName')} autoComplete="given-name" />
                </div>
                <div className="suw-field">
                  <label htmlFor="w-last">{t('auth.field.lastName')}</label>
                  <input id="w-last" className="suw-input" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder={t('wiz.ph.lastName')} autoComplete="family-name" />
                </div>
              </div>
            ) : (
              <>
                <div className="suw-field">
                  <label htmlFor="w-bin">{t('auth.field.bin')}</label>
                  <div className={'suw-bin-wrap' + (binOk ? ' ok' : '')}>
                    <input id="w-bin" className="suw-input" value={bin} onChange={(e) => setBin(e.target.value.replace(/\D/g, '').slice(0, 12))} inputMode="numeric" placeholder="000000000000" />
                    <span className="suw-bin-check"><Ico name="check" size={18} /></span>
                  </div>
                  {binOk && <div className="suw-bin-hint"><Ico name="check" size={14} />{t('wiz.bin.ok')}</div>}
                </div>
                <div className="suw-field">
                  <label htmlFor="w-company">{t('auth.field.company')}</label>
                  <input id="w-company" className="suw-input" value={company} onChange={(e) => setCompany(e.target.value)} placeholder={t('wiz.ph.company')} autoComplete="organization" />
                </div>
                <div className="suw-field">
                  <label htmlFor="w-contact">{t('auth.field.contactName')}</label>
                  <input id="w-contact" className="suw-input" value={contact} onChange={(e) => setContact(e.target.value)} placeholder={t('wiz.ph.contactName')} autoComplete="name" />
                </div>
              </>
            )}

            <div className="suw-field">
              <label>{t('auth.field.phone')}</label>
              <PhoneInput value={phone} onChange={setPhone} />
            </div>
          </div>

          <label className="suw-terms">
            <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
            <span>
              {t('auth.terms.pre')}
              <TermsLink onClick={() => setLegal('oferta')}>{t('auth.terms.oferta')}</TermsLink>
              {t('auth.terms.and')}
              <TermsLink onClick={() => setLegal('privacy')}>{t('auth.terms.privacy')}</TermsLink>
            </span>
          </label>

          {error && <div className="suw-err">{error}</div>}

          <button type="submit" className="suw-cta" disabled={loading}>
            {loading ? t('wiz.saving') : t('wiz.finish')} {!loading && <Ico name="arrow" size={18} />}
          </button>

          {legal && <LegalModal slug={legal} onClose={() => setLegal(null)} />}
        </form>
      )}
    </div>
  )
}

// A link-styled button inside the terms <label>. The click must not bubble to
// the label, or opening a document would also tick the consent checkbox.
function TermsLink({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="suw-terms-link"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onClick()
      }}
    >
      {children}
    </button>
  )
}

function TypeCard({
  on,
  icon,
  title,
  desc,
  chips,
  badge,
  onClick,
}: {
  on: boolean
  icon: string
  title: string
  desc: string
  chips: string[]
  badge?: string
  onClick: () => void
}) {
  return (
    <button type="button" className={'suw-card' + (on ? ' on' : '')} onClick={onClick} aria-pressed={on}>
      {badge && <span className="suw-card-badge">{badge}</span>}
      <span className="suw-card-ico"><Ico name={icon} size={24} /></span>
      <span className="suw-card-main">
        <span className="suw-card-title">{title}</span>
        <span className="suw-card-desc">{desc}</span>
        <span className="suw-card-chips">
          {chips.map((c) => (
            <span key={c} className="suw-card-chip">{c}</span>
          ))}
        </span>
      </span>
      <span className="suw-card-radio" />
    </button>
  )
}
