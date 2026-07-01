'use client'
import { useState } from 'react'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { useLocale } from 'next-intl'
import { useSession, signOut } from 'next-auth/react'
import { Ico } from '@/components/ui/Ico'
import { useCart } from '@/store/cart'
import { useGarage } from '@/store/garage'
import { useT, LOCALES, LOCALE_LABELS, type TranslationKey } from '@/lib/i18n'
import { CityModal } from '@/components/layout/CityModal'
import { GaragePanel } from '@/components/garage/GaragePanel'

// Mobile "menu hub" reached from the bottom bar's Аккаунт tab: profile/sign-in
// plus all secondary sections, city, language and contacts in one place.
const LINKS: Array<{ href: string; labelKey: TranslationKey; icon: string }> = [
  { href: '/podbor', labelKey: 'account.link.podbor', icon: 'grid' },
  { href: '/vin', labelKey: 'account.link.vin', icon: 'spark' },
  { href: '/rental', labelKey: 'account.link.rental', icon: 'truck' },
  { href: '/parts-brands', labelKey: 'account.link.brands', icon: 'bag' },
  { href: '/wishlist', labelKey: 'account.link.wishlist', icon: 'heart' },
  { href: '/about', labelKey: 'account.link.about', icon: 'info' },
  { href: '/warranty', labelKey: 'account.link.warranty', icon: 'check' },
]

export default function AccountPage() {
  const { data: session } = useSession()
  const { city } = useCart()
  const t = useT()
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const vehicles = useGarage((s) => s.vehicles)
  const [showCity, setShowCity] = useState(false)
  const [showGarage, setShowGarage] = useState(false)
  const user = session?.user

  return (
    <main className="acc">
      <section className="acc-profile">
        <div className="acc-avatar">
          {user ? (user.name?.[0] || user.email?.[0] || '?').toUpperCase() : <Ico name="user" size={22} />}
        </div>
        <div className="acc-profile-meta">
          <b>{user ? user.name || t('account.profile.userTitle') : t('account.profile.guestTitle')}</b>
          <span>{user ? user.email : t('account.profile.guestSub')}</span>
        </div>
        {user ? (
          <button className="acc-signout" onClick={() => signOut()}>{t('account.signout')}</button>
        ) : (
          <Link href="/auth" className="btn btn-primary btn-sm">{t('account.login')}</Link>
        )}
      </section>

      <div className="acc-group-title">{t('account.group.sections')}</div>
      <nav className="acc-list">
        <button className="acc-row" onClick={() => setShowGarage(true)}>
          <Ico name="truck" size={18} />
          <span>{t('account.myGarage')}</span>
          {vehicles.length > 0 && <span className="acc-row-val">{vehicles.length}</span>}
          <Ico name="chevron" size={16} className="acc-row-arr" />
        </button>
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="acc-row">
            <Ico name={l.icon} size={18} />
            <span>{t(l.labelKey)}</span>
            <Ico name="chevron" size={16} className="acc-row-arr" />
          </Link>
        ))}
      </nav>

      <div className="acc-group-title">{t('account.group.settings')}</div>
      <div className="acc-list">
        <button className="acc-row" onClick={() => setShowCity(true)}>
          <Ico name="pin" size={18} />
          <span>{t('account.city')}</span>
          <span className="acc-row-val">{city}</span>
          <Ico name="chevron" size={16} className="acc-row-arr" />
        </button>
        <div className="acc-row acc-row-static">
          <Ico name="info" size={18} />
          <span>{t('account.language')}</span>
          <div className="acc-lang">
            {LOCALES.map((code) => (
              <button key={code} className={locale === code ? 'on' : ''} onClick={() => router.replace(pathname, { locale: code })}>
                {LOCALE_LABELS[code]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="acc-group-title">{t('account.group.contacts')}</div>
      <div className="acc-list">
        <a className="acc-row" href="tel:+77000000000">
          <Ico name="phone" size={18} />
          <span>+7 (700) 000-00-00</span>
        </a>
        <a className="acc-row" href="mailto:info@tulparhub.kz">
          <Ico name="chat" size={18} />
          <span>info@tulparhub.kz</span>
        </a>
      </div>

      {showCity && <CityModal onClose={() => setShowCity(false)} />}
      {showGarage && <GaragePanel onClose={() => setShowGarage(false)} />}
    </main>
  )
}
