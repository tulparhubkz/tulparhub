'use client'
import { useState, useEffect, useRef } from 'react'
import { Link, useRouter, usePathname } from '@/i18n/navigation'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import { Ico } from '@/components/ui/Ico'
import { useCart, useCartCount } from '@/store/cart'
import { useWishlist } from '@/store/wishlist'
import { useGarage } from '@/store/garage'
import { useT, LOCALES, LOCALE_LABELS } from '@/lib/i18n'
import { fmtKZT } from '@/lib/utils'
import { CityModal } from './CityModal'
import { CallbackModal } from './CallbackModal'
import { GaragePanel } from '@/components/garage/GaragePanel'
import { useSession } from 'next-auth/react'

interface SearchResults {
  parts: Array<{ id: string; name: string; oem: string; price: number }>
  systems: Array<{ id: string; label: string; href: string }>
  brands: Array<{ id: string; label: string; href: string }>
}

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()
  const [search, setSearch]       = useState('')
  const [results, setResults]     = useState<SearchResults | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [showCity, setShowCity]     = useState(false)
  const [showGarage, setShowGarage] = useState(false)
  const [showCallback, setShowCallback] = useState(false)
  const [searchTab, setSearchTab]   = useState<'article' | 'vin' | 'model'>('article')
  const { city }                    = useCart()
  const t                           = useT()
  const wishCount                   = useWishlist(s => s.items.length)
  const { vehicles }                = useGarage()
  const cartCount                 = useCartCount()
  const debounceRef               = useRef<ReturnType<typeof setTimeout>>()
  const { data: session }         = useSession()
  const user                      = session?.user

  useEffect(() => {
    const q = search.trim()
    if (q.length < 2) { setResults(null); return }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
        const data = await res.json()
        setResults(data)
      } catch {}
    }, 300)
    return () => clearTimeout(debounceRef.current)
  }, [search])

  const handleSearch = () => {
    if (!search.trim()) return
    setShowResults(false)
    if (searchTab === 'vin') {
      router.push(`/catalog?vin=${encodeURIComponent(search)}`)
    } else {
      router.push(`/catalog?q=${encodeURIComponent(search)}`)
    }
  }

  const hasResults = results && (
    results.parts.length > 0 || results.systems.length > 0 || results.brands.length > 0
  )

  return (
    <>
      <header className="hdr">
        {/* Top bar */}
        <div className="hdr-top">
          <div className="hdr-row container">
            <div className="hdr-meta">
              <button type="button" className="city-btn" onClick={() => setShowCity(true)}>
                <Ico name="pin" size={14} />
                <span>{city}</span>
                <Ico name="chevDown" size={12} />
              </button>
            </div>
            <div className="hdr-actions">
              <div className="lang">
                {LOCALES.map((code) => (
                  <button key={code} type="button" className={locale === code ? 'on' : ''} onClick={() => router.replace(pathname, { locale: code })}>{LOCALE_LABELS[code]}</button>
                ))}
              </div>
              <a href="tel:+77000000000" className="hdr-phone">
                <Ico name="phone" size={13} />
                <span>+7 (700) 000-00-00</span>
              </a>
              <button type="button" className="callback" onClick={() => setShowCallback(true)}>{t('header.callback')}</button>
            </div>
          </div>
        </div>

        {/* Main bar */}
        <div className="hdr-main container">
          <Link href="/" className="logo">
            <Image src="/logo.png" alt="TulparHub" width={120} height={80} style={{ objectFit: 'contain' }} priority />
          </Link>

          <div className="search">
            <div className="search-prefix"><Ico name="search" size={16} /></div>
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setShowResults(true) }}
              onFocus={() => setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={t('search.placeholder')}
            />
            <div className="search-tabs">
              {([['article', 'search.tab.article'], ['vin', 'search.tab.vin'], ['model', 'search.tab.model']] as const).map(([id, key]) => (
                <button key={id} type="button" className={searchTab === id ? 'on' : ''} onClick={() => setSearchTab(id)}>{t(key)}</button>
              ))}
            </div>
            <button type="button" className="search-go" onClick={handleSearch}>{t('search.go')}</button>

            {showResults && hasResults && (
              <div className="search-results">
                {results!.parts.length > 0 && (
                  <div className="sr-group">
                    <div className="sr-head">{t('search.group.parts')}</div>
                    {results!.parts.map((p) => (
                      <button key={p.id} className="sr-row" onMouseDown={() => { setShowResults(false); router.push(`/catalog/${p.id}`) }}>
                        <div className="sr-thumb" style={{ width: 36, height: 36, background: '#f0f2f5', borderRadius: 4, flexShrink: 0 }} />
                        <div className="sr-meta">
                          <div className="sr-name">{p.name}</div>
                          <div className="sr-oem">{p.oem}</div>
                        </div>
                        <div className="sr-price">{fmtKZT(p.price)}</div>
                      </button>
                    ))}
                  </div>
                )}
                {results!.systems.length > 0 && (
                  <div className="sr-group">
                    <div className="sr-head">{t('search.group.categories')}</div>
                    {results!.systems.map((s) => (
                      <button key={s.id} className="sr-row" onMouseDown={() => { setShowResults(false); router.push(s.href) }}>
                        <div className="sr-meta"><div className="sr-name">{s.label}</div></div>
                      </button>
                    ))}
                  </div>
                )}
                {results!.brands.length > 0 && (
                  <div className="sr-group">
                    <div className="sr-head">{t('search.group.brands')}</div>
                    {results!.brands.map((b) => (
                      <button key={b.id} className="sr-row" onMouseDown={() => { setShowResults(false); router.push(b.href) }}>
                        <div className="sr-meta"><div className="sr-name">{b.label}</div></div>
                      </button>
                    ))}
                  </div>
                )}
                <div className="sr-foot">
                  <button onMouseDown={handleSearch}>{t('search.showAll')}</button>
                </div>
              </div>
            )}
          </div>

          <div className="hdr-user">
            <Link href="/wishlist" className="hdr-iconbtn" style={{ textDecoration: 'none', flexDirection: 'column', position: 'relative' }}>
              <Ico name="heart" size={18} />
              <span className="hdr-iconlbl">{t('user.wishlist')}</span>
              {wishCount > 0 && <span className="hdr-iconcount on">{wishCount}</span>}
            </Link>
            <button type="button" className="hdr-iconbtn" onClick={() => setShowGarage(true)} style={{ position: 'relative' }}>
              <Ico name="truck" size={18} />
              <span className="hdr-iconlbl">{t('user.garage')}</span>
              {vehicles.length > 0 && (
                <span className="hdr-iconcount on" style={{ position: 'absolute', top: 2, right: 6 }}>{vehicles.length}</span>
              )}
            </button>
            <Link href="/cart" className="hdr-iconbtn" style={{ textDecoration: 'none', flexDirection: 'column' }}>
              <Ico name="cart" size={18} />
              <span className="hdr-iconlbl">{t('user.cart')}</span>
              {cartCount > 0 && <span className="hdr-iconcount on">{cartCount}</span>}
            </Link>
            {user ? (
              <Link href="/account" className="hdr-iconbtn" style={{ textDecoration: 'none', flexDirection: 'column' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700 }}>
                  {(user.name?.[0] || user.email?.[0] || '?').toUpperCase()}
                </div>
                <span className="hdr-iconlbl" style={{ maxWidth: 60, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name?.split(' ')[0] || t('user.account')}
                </span>
              </Link>
            ) : (
              <Link href="/auth" className="hdr-iconbtn" style={{ textDecoration: 'none', flexDirection: 'column' }}>
                <Ico name="user" size={18} />
                <span className="hdr-iconlbl">{t('user.login')}</span>
              </Link>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="hdr-nav">
          <div className="container hdr-nav-row">
            <Link href="/podbor" className="nav-catalog">
              <Ico name="grid" size={14} />
              <span>{t('nav.catalog')}</span>
            </Link>
            <Link href="/catalog">{t('nav.parts')}</Link>
            <Link href="/rental">{t('nav.rental')}</Link>
            <Link href="/parts-brands">{t('nav.brands')}</Link>
            <Link href="/about">{t('nav.about')}</Link>
            <span className="nav-grow" />
            <Link href="/vin" className="nav-help-btn">{t('nav.help')}</Link>
            <a href="#" className="nav-promo"><Ico name="bolt" size={14} /> {t('nav.promo')}</a>
          </div>
        </nav>
      </header>

      {showCity && <CityModal onClose={() => setShowCity(false)} />}
      {showCallback && <CallbackModal onClose={() => setShowCallback(false)} />}
      {showGarage && <GaragePanel onClose={() => setShowGarage(false)} />}
    </>
  )
}
