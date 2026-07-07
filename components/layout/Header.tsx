'use client'
import { useState, useEffect, useRef, useMemo } from 'react'
import { Link, useRouter, usePathname } from '@/i18n/navigation'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import { Ico } from '@/components/ui/Ico'
import { reachGoal } from '@/lib/analytics'
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
  const [highlight, setHighlight]     = useState(-1)
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
  const abortRef                  = useRef<AbortController>()
  const { data: session }         = useSession()
  const user                      = session?.user

  // Signed in → adopt the account garage (and import any localStorage
  // vehicles into it, #17). Guests never hit the server.
  useEffect(() => {
    if (user?.id) void useGarage.getState().syncWithServer()
  }, [user?.id])

  useEffect(() => {
    const q = search.trim()
    setHighlight(-1)
    if (q.length < 3) { setResults(null); return }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      abortRef.current?.abort()
      const ctrl = new AbortController()
      abortRef.current = ctrl
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: ctrl.signal })
        if (!res.ok) { setResults(null); return }
        const data = await res.json()
        setResults(data)
      } catch {}
    }, 200)
    return () => { clearTimeout(debounceRef.current); abortRef.current?.abort() }
  }, [search])

  const handleSearch = () => {
    if (!search.trim()) return
    reachGoal(
      searchTab === 'vin' ? 'SEARCH_VIN' : searchTab === 'model' ? 'SEARCH_MODEL' : 'SEARCH',
      { q: search.trim() },
    )
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

  // Flattened, ordered list of navigable suggestions (parts → categories → brands)
  // so arrow keys can move a single highlight index across all groups.
  const flatItems = useMemo(
    () =>
      results
        ? [
            ...results.parts.map((p) => `/catalog/${p.id}`),
            ...results.systems.map((s) => s.href),
            ...results.brands.map((b) => b.href),
          ]
        : [],
    [results],
  )

  const go = (href: string) => { setShowResults(false); setHighlight(-1); router.push(href) }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showResults || !hasResults) {
      if (e.key === 'Enter') handleSearch()
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlight((i) => Math.min(i + 1, flatItems.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlight((i) => Math.max(i - 1, -1))
    } else if (e.key === 'Enter') {
      if (highlight >= 0 && flatItems[highlight]) go(flatItems[highlight])
      else handleSearch()
    } else if (e.key === 'Escape') {
      setShowResults(false)
      setHighlight(-1)
    }
  }

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
              onChange={(e) => { setSearch(e.target.value); setResults(null); setHighlight(-1); setShowResults(true) }}
              onFocus={() => setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
              onKeyDown={onKeyDown}
              placeholder={t('search.placeholder')}
              aria-label={t('search.placeholder')}
              role="combobox"
              aria-expanded={!!(showResults && hasResults)}
              aria-controls="search-results"
              aria-autocomplete="list"
              aria-activedescendant={highlight >= 0 ? `sr-opt-${highlight}` : undefined}
            />
            <div className="search-tabs">
              {([['article', 'search.tab.article'], ['vin', 'search.tab.vin'], ['model', 'search.tab.model']] as const).map(([id, key]) => (
                <button key={id} type="button" className={searchTab === id ? 'on' : ''} onClick={() => setSearchTab(id)}>{t(key)}</button>
              ))}
            </div>
            <button type="button" className="search-go" onClick={handleSearch}>{t('search.go')}</button>

            {showResults && hasResults && (
              <div className="search-results" id="search-results" role="listbox">
                {results!.parts.length > 0 && (
                  <div className="sr-group">
                    <div className="sr-head">{t('search.group.parts')}</div>
                    {results!.parts.map((p, i) => {
                      const idx = i
                      return (
                        <button key={p.id} id={`sr-opt-${idx}`} type="button" role="option" tabIndex={-1} aria-selected={highlight === idx} className={`sr-row${highlight === idx ? ' on' : ''}`} onMouseEnter={() => setHighlight(idx)} onMouseDown={() => go(`/catalog/${p.id}`)}>
                          <div className="sr-thumb" style={{ width: 36, height: 36, background: '#f0f2f5', borderRadius: 4, flexShrink: 0 }} />
                          <div className="sr-meta">
                            <div className="sr-name">{p.name}</div>
                            <div className="sr-oem">{p.oem}</div>
                          </div>
                          <div className="sr-price">{fmtKZT(p.price)}</div>
                        </button>
                      )
                    })}
                  </div>
                )}
                {results!.systems.length > 0 && (
                  <div className="sr-group">
                    <div className="sr-head">{t('search.group.categories')}</div>
                    {results!.systems.map((s, i) => {
                      const idx = results!.parts.length + i
                      return (
                        <button key={s.id} id={`sr-opt-${idx}`} type="button" role="option" tabIndex={-1} aria-selected={highlight === idx} className={`sr-row${highlight === idx ? ' on' : ''}`} onMouseEnter={() => setHighlight(idx)} onMouseDown={() => go(s.href)}>
                          <div className="sr-meta"><div className="sr-name">{s.label}</div></div>
                        </button>
                      )
                    })}
                  </div>
                )}
                {results!.brands.length > 0 && (
                  <div className="sr-group">
                    <div className="sr-head">{t('search.group.brands')}</div>
                    {results!.brands.map((b, i) => {
                      const idx = results!.parts.length + results!.systems.length + i
                      return (
                        <button key={b.id} id={`sr-opt-${idx}`} type="button" role="option" tabIndex={-1} aria-selected={highlight === idx} className={`sr-row${highlight === idx ? ' on' : ''}`} onMouseEnter={() => setHighlight(idx)} onMouseDown={() => go(b.href)}>
                          <div className="sr-meta"><div className="sr-name">{b.label}</div></div>
                        </button>
                      )
                    })}
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
