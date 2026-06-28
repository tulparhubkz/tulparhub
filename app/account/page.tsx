'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Ico } from '@/components/ui/Ico'
import { useCart } from '@/store/cart'
import { useGarage } from '@/store/garage'
import { CityModal } from '@/components/layout/CityModal'
import { GaragePanel } from '@/components/garage/GaragePanel'

// Mobile "menu hub" reached from the bottom bar's Аккаунт tab: profile/sign-in
// plus all secondary sections, city, language and contacts in one place.
const LINKS: Array<{ href: string; label: string; icon: string }> = [
  { href: '/podbor', label: 'Подбор по технике', icon: 'grid' },
  { href: '/vin', label: 'Помощь в подборе', icon: 'spark' },
  { href: '/rental', label: 'Аренда спецтехники', icon: 'truck' },
  { href: '/parts-brands', label: 'Бренды', icon: 'bag' },
  { href: '/wishlist', label: 'Избранное', icon: 'heart' },
  { href: '/about', label: 'О компании', icon: 'info' },
  { href: '/warranty', label: 'Гарантия и возврат', icon: 'check' },
]

export default function AccountPage() {
  const { data: session } = useSession()
  const { city, lang, setLang } = useCart()
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
          <b>{user ? user.name || 'Мой аккаунт' : 'Войдите в аккаунт'}</b>
          <span>{user ? user.email : 'Заказы, избранное и история'}</span>
        </div>
        {user ? (
          <button className="acc-signout" onClick={() => signOut()}>Выйти</button>
        ) : (
          <Link href="/auth" className="btn btn-primary btn-sm">Войти</Link>
        )}
      </section>

      <div className="acc-group-title">Разделы</div>
      <nav className="acc-list">
        <button className="acc-row" onClick={() => setShowGarage(true)}>
          <Ico name="truck" size={18} />
          <span>Мой гараж</span>
          {vehicles.length > 0 && <span className="acc-row-val">{vehicles.length}</span>}
          <Ico name="chevron" size={16} className="acc-row-arr" />
        </button>
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="acc-row">
            <Ico name={l.icon} size={18} />
            <span>{l.label}</span>
            <Ico name="chevron" size={16} className="acc-row-arr" />
          </Link>
        ))}
      </nav>

      <div className="acc-group-title">Настройки</div>
      <div className="acc-list">
        <button className="acc-row" onClick={() => setShowCity(true)}>
          <Ico name="pin" size={18} />
          <span>Город</span>
          <span className="acc-row-val">{city}</span>
          <Ico name="chevron" size={16} className="acc-row-arr" />
        </button>
        <div className="acc-row acc-row-static">
          <Ico name="info" size={18} />
          <span>Язык</span>
          <div className="acc-lang">
            {(['RU', 'KZ', 'EN'] as const).map((l) => (
              <button key={l} className={lang === l ? 'on' : ''} onClick={() => setLang(l)}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="acc-group-title">Контакты</div>
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
