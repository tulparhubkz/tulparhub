'use client'
import { Link } from '@/i18n/navigation'
import { usePathname } from '@/i18n/navigation'
import { Ico } from '@/components/ui/Ico'
import { useCartCount } from '@/store/cart'
import { useT } from '@/lib/i18n'

// Mobile-only bottom tab bar (shown ≤600px via CSS). Garage lives in the Меню hub.
export function BottomNav() {
  const pathname = usePathname()
  const cartCount = useCartCount()
  const t = useT()

  // Every route maps to exactly one tab, so the bar always shows where you are:
  // catalog-family pages light Каталог, checkout pages light Корзина, the home
  // page lights Главная, and everything reached from the Меню hub lights Меню.
  const tabFor = (path: string): string => {
    if (path === '/') return '/'
    if (/^\/(catalog|podbor|parts-brands)/.test(path)) return '/catalog'
    if (/^\/(cart|order-success)/.test(path)) return '/cart'
    return '/account'
  }
  const active = (href: string) => tabFor(pathname) === href

  return (
    <nav className="bottomnav" aria-label={t('bottomnav.aria')}>
      <Link href="/" className={`bn-item ${active('/') ? 'on' : ''}`}>
        <Ico name="home" size={22} />
        <span>{t('bottomnav.home')}</span>
      </Link>
      <Link href="/catalog" className={`bn-item ${active('/catalog') ? 'on' : ''}`}>
        <Ico name="grid" size={22} />
        <span>{t('nav.catalog')}</span>
      </Link>
      <Link href="/cart" className={`bn-item ${active('/cart') ? 'on' : ''}`}>
        <span className="bn-icon">
          <Ico name="cart" size={22} />
          {cartCount > 0 && <span className="bn-badge">{cartCount}</span>}
        </span>
        <span>{t('bottomnav.cart')}</span>
      </Link>
      <Link href="/account" className={`bn-item ${active('/account') ? 'on' : ''}`}>
        <Ico name="list" size={22} />
        <span>{t('bottomnav.menu')}</span>
      </Link>
    </nav>
  )
}
