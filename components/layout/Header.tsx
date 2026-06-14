'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Ico } from '@/components/ui/Ico'
import { Placeholder } from '@/components/ui/Placeholder'
import { useCart, useCartCount } from '@/store/cart'
import { parts } from '@/lib/data'
import { fmtKZT } from '@/lib/utils'
import { CityModal } from './CityModal'

export function Header() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [showCity, setShowCity] = useState(false)
  const [searchTab, setSearchTab] = useState<'Артикул' | 'VIN' | 'Модель'>('Артикул')
  const { city, lang, setLang } = useCart()
  const cartCount = useCartCount()

  const matches = useMemo(() => {
    if (!search.trim()) return null
    const q = search.toLowerCase()
    const partHits = parts.filter((p) =>
      p.oem.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.cross.some((c) => c.toLowerCase().includes(q))
    ).slice(0, 5)
    return { partHits }
  }, [search])

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
              <span className="hdr-sep">·</span>
              <span className="hdr-link">Доставка по Казахстану и СНГ</span>
              <span className="hdr-sep">·</span>
              <a href="#" className="hdr-link">Оптовикам</a>
              <a href="#" className="hdr-link">Для СТО</a>
              <a href="#" className="hdr-link">1С-интеграция</a>
            </div>
            <div className="hdr-actions">
              <div className="lang">
                {(['RU', 'KZ', 'EN'] as const).map((l) => (
                  <button key={l} type="button" className={lang === l ? 'on' : ''} onClick={() => setLang(l)}>{l}</button>
                ))}
              </div>
              <span className="hdr-sep">·</span>
              <a href="tel:+77000000000" className="hdr-link">
                <Ico name="phone" size={13} /> +7 (700) 000-00-00
              </a>
              <button type="button" className="callback">Заказать звонок</button>
            </div>
          </div>
        </div>

        {/* Main bar */}
        <div className="hdr-main container">
          <Link href="/" className="logo">
            <span className="logo-text">TULPAR<span>HUB</span></span>
          </Link>

          <div className="search">
            <div className="search-prefix"><Ico name="search" size={16} /></div>
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setShowResults(true) }}
              onFocus={() => setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 180)}
              placeholder="OEM-номер, VIN, модель техники..."
            />
            <div className="search-tabs">
              {(['Артикул', 'VIN', 'Модель'] as const).map((t) => (
                <button key={t} type="button" className={searchTab === t ? 'on' : ''} onClick={() => setSearchTab(t)}>{t}</button>
              ))}
            </div>
            <button
              type="button"
              className="search-go"
              onClick={() => { if (search.trim()) router.push(`/catalog?q=${encodeURIComponent(search)}`) }}
            >
              Найти
            </button>

            {showResults && matches && matches.partHits.length > 0 && (
              <div className="search-results">
                <div className="sr-group">
                  <div className="sr-head">ЗАПЧАСТИ</div>
                  {matches.partHits.map((p) => (
                    <button key={p.id} className="sr-row" onMouseDown={() => router.push(`/catalog/${p.id}`)}>
                      <div className="sr-thumb"><Placeholder label={p.img} ratio="1" /></div>
                      <div className="sr-meta">
                        <div className="sr-name">{p.name}</div>
                        <div className="sr-oem">{p.oem} · {p.brand}</div>
                      </div>
                      <div className="sr-price">{fmtKZT(p.price)}</div>
                    </button>
                  ))}
                </div>
                <div className="sr-foot">
                  <span>Нажмите Enter для поиска</span>
                </div>
              </div>
            )}
          </div>

          <div className="hdr-user">
            <button type="button" className="hdr-iconbtn">
              <Ico name="heart" size={18} />
              <span className="hdr-iconlbl">Избранное</span>
            </button>
            <button type="button" className="hdr-iconbtn">
              <Ico name="list" size={18} />
              <span className="hdr-iconlbl">Запросы</span>
            </button>
            <Link href="/cart" className="hdr-iconbtn" style={{ textDecoration: 'none', flexDirection: 'column' }}>
              <Ico name="cart" size={18} />
              <span className="hdr-iconlbl">Корзина</span>
              {cartCount > 0 && <span className="hdr-iconcount on">{cartCount}</span>}
            </Link>
            <button type="button" className="hdr-iconbtn">
              <Ico name="user" size={18} />
              <span className="hdr-iconlbl">Войти</span>
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="hdr-nav">
          <div className="container hdr-nav-row">
            <Link href="/podbor" className="nav-catalog">
              <Ico name="grid" size={14} />
              <span>Каталог</span>
            </Link>
            <Link href="/catalog">Запчасти</Link>
            <Link href="/rental">Аренда техники</Link>
            <a href="#">Бренды</a>
            <a href="#">Оптовикам</a>
            <a href="#">Доставка</a>
            <a href="#">О компании</a>
            <a href="#">Контакты</a>
            <span className="nav-grow" />
            <a href="#" className="nav-promo"><Ico name="bolt" size={14} /> Акция KAMAZ, HOWO, Shacman</a>
          </div>
        </nav>
      </header>

      {showCity && <CityModal onClose={() => setShowCity(false)} />}
    </>
  )
}
