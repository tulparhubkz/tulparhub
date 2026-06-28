'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Ico } from '@/components/ui/Ico'
import { useCartCount } from '@/store/cart'
import { useGarage } from '@/store/garage'
import { GaragePanel } from '@/components/garage/GaragePanel'

// Mobile-only bottom tab bar (shown ≤600px via CSS). Restores access to the
// primary actions that are hidden from the header on phones.
export function BottomNav() {
  const pathname = usePathname()
  const cartCount = useCartCount()
  const vehicles = useGarage((s) => s.vehicles)
  const [showGarage, setShowGarage] = useState(false)

  const active = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <>
      <nav className="bottomnav" aria-label="Основная навигация">
        <Link href="/" className={`bn-item ${active('/') ? 'on' : ''}`}>
          <Ico name="home" size={22} />
          <span>Главная</span>
        </Link>
        <Link href="/catalog" className={`bn-item ${active('/catalog') ? 'on' : ''}`}>
          <Ico name="grid" size={22} />
          <span>Каталог</span>
        </Link>
        <Link href="/cart" className={`bn-item ${active('/cart') ? 'on' : ''}`}>
          <span className="bn-icon">
            <Ico name="cart" size={22} />
            {cartCount > 0 && <span className="bn-badge">{cartCount}</span>}
          </span>
          <span>Корзина</span>
        </Link>
        <button type="button" className="bn-item" onClick={() => setShowGarage(true)}>
          <span className="bn-icon">
            <Ico name="truck" size={22} />
            {vehicles.length > 0 && <span className="bn-badge">{vehicles.length}</span>}
          </span>
          <span>Гараж</span>
        </button>
        <Link href="/auth" className={`bn-item ${active('/auth') ? 'on' : ''}`}>
          <Ico name="user" size={22} />
          <span>Аккаунт</span>
        </Link>
      </nav>
      {showGarage && <GaragePanel onClose={() => setShowGarage(false)} />}
    </>
  )
}
