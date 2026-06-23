'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Ico } from '@/components/ui/Ico'
import { Badge } from '@/components/ui/Badge'
import { SysGlyph } from '@/components/ui/SysGlyph'
import { PartCard } from '@/components/catalog/PartCard'
import { systems, brands } from '@/lib/data'
import { useCart } from '@/store/cart'

const RENTAL_SLIDES = [
  {
    label: 'Экскаватор CAT 320',
    sub: 'Гусеничный · 20 т · 2022 г.',
    img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=640&q=80&auto=format&fit=crop',
    prices: [['85 000 ₸', 'смена 8 ч'], ['110 000 ₸', 'сутки'], ['2.1 М ₸', 'месяц']],
  },
  {
    label: 'Автокран КС-55713 · 25 т',
    sub: 'Галичанин · стрела 31 м · 2020 г.',
    img: 'https://images.unsplash.com/photo-1581094480560-01f3d57c5949?w=640&q=80&auto=format&fit=crop',
    prices: [['95 000 ₸', 'смена 8 ч'], ['130 000 ₸', 'сутки'], ['2.5 М ₸', 'месяц']],
  },
  {
    label: 'Погрузчик SDLG L956',
    sub: 'Фронтальный · ковш 3 м³ · 2021 г.',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=640&q=80&auto=format&fit=crop',
    prices: [['65 000 ₸', 'смена 8 ч'], ['80 000 ₸', 'сутки'], ['1.5 М ₸', 'месяц']],
  },
  {
    label: 'Самосвал Shacman F3000 8×4',
    sub: '30 т · 2022 г. · Алматы/Астана',
    img: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=640&q=80&auto=format&fit=crop',
    prices: [['55 000 ₸', 'смена 8 ч'], ['70 000 ₸', 'сутки'], ['1.3 М ₸', 'месяц']],
  },
  {
    label: 'Бульдозер Komatsu D65',
    sub: 'Гусеничный · отвал 3.7 м · 2021 г.',
    img: 'https://images.unsplash.com/photo-1517089596392-fb9a9033e05b?w=640&q=80&auto=format&fit=crop',
    prices: [['75 000 ₸', 'смена 8 ч'], ['95 000 ₸', 'сутки'], ['1.8 М ₸', 'месяц']],
  },
]

function RentalSlideshow() {
  const [cur, setCur] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCur(i => (i + 1) % RENTAL_SLIDES.length), 3500)
    return () => clearInterval(t)
  }, [])

  const slide = RENTAL_SLIDES[cur]

  return (
    <div style={{
      borderRadius: 16,
      overflow: 'hidden',
      background: 'var(--surf)',
      border: '1.5px solid var(--line)',
      boxShadow: 'var(--shadow-sm)',
    }}>
      {/* Chip */}
      <div style={{ background: 'var(--surf-2)', fontSize: 11, fontWeight: 600, color: 'var(--ink-2)', padding: '6px 14px', borderBottom: '1px solid var(--line)' }}>
        Парк 240+ единиц онлайн
      </div>

      {/* Photo */}
      <div style={{ position: 'relative', height: 220, overflow: 'hidden', background: '#111' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={slide.img}
          src={slide.img}
          alt={slide.label}
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'opacity .4s ease',
          }}
        />
        {/* Dark gradient overlay for text readability */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,.65) 0%, rgba(0,0,0,.1) 50%, transparent 100%)',
        }} />
        {/* Label on photo */}
        <div style={{ position: 'absolute', bottom: 12, left: 14, right: 14 }}>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 15, lineHeight: 1.25, textShadow: '0 1px 4px rgba(0,0,0,.5)' }}>{slide.label}</div>
          <div style={{ color: 'rgba(255,255,255,.75)', fontSize: 11, marginTop: 3 }}>{slide.sub}</div>
        </div>
        {/* Dots */}
        <div style={{ position: 'absolute', bottom: 10, right: 14, display: 'flex', gap: 5 }}>
          {RENTAL_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCur(i)}
              style={{
                width: i === cur ? 18 : 6, height: 6,
                borderRadius: 3,
                background: i === cur ? '#fff' : 'rgba(255,255,255,.45)',
                border: 'none', cursor: 'pointer',
                transition: 'all .3s', padding: 0,
              }}
            />
          ))}
        </div>
      </div>

      {/* Price row */}
      <div style={{ display: 'flex', borderTop: '1px solid var(--line)' }}>
        {slide.prices.map(([num, lbl]) => (
          <div key={lbl} style={{ flex: 1, padding: '12px 16px', borderRight: '1px solid var(--line)' }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent-deep)' }}>{num}</div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>{lbl}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const TRUCK_EMOJI: Record<string, string> = {
  tractor: '🚛', dump: '🚚', flatbed: '🚛', trailer: '🚌', delivery: '🚐', special: '🏗️',
}

function TruckTypeIcon({ kind, size = 48 }: { kind: string; size?: number }) {
  return (
    <div style={{ width: size, height: size, display: 'grid', placeItems: 'center', fontSize: size * 0.6 }}>
      {TRUCK_EMOJI[kind] ?? '🚛'}
    </div>
  )
}

export default function HomePage() {
  const router = useRouter()
  const [vinInput, setVinInput] = useState('')
  const [oemInput, setOemInput] = useState('')
  const [parts, setParts] = useState<any[]>([])
  const { addItem } = useCart()

  useEffect(() => {
    fetch('/api/parts?page=1&sort=popular')
      .then(r => r.json())
      .then(d => {
        const items = (d.items || []).map((p: any) => ({
          ...p,
          stock: p.part_stock
            ? Object.fromEntries(p.part_stock.map((s: any) => [s.city, s.qty]))
            : {},
        }))
        setParts(items.slice(0, 4))
      })
      .catch(() => {})
  }, [])

  return (
    <main>
      <style>{`
        /* ── Marquee strip ── */
        .hm-item { color: rgba(255,255,255,.9) !important; font-size: 13px !important; }

        /* ── Brands grid ── */
        .brands-new {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 12px;
        }
        .brand-new-card {
          background: var(--surf);
          border: 1.5px solid var(--line);
          border-radius: var(--radius-lg);
          padding: 18px 14px;
          text-align: center;
          text-decoration: none;
          transition: .15s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .brand-new-card:hover { border-color: var(--accent); box-shadow: var(--shadow-md); transform: translateY(-2px); }
        .brand-new-logo {
          width: 52px; height: 52px;
          border-radius: 10px;
          background: var(--surf-2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 800;
          color: var(--ink-2);
          letter-spacing: -.02em;
          font-family: var(--font-jetbrains), monospace;
        }
        .brand-new-name { font-size: 13px; font-weight: 700; color: var(--ink); }
        .brand-new-country { font-size: 11px; color: var(--ink-3); }

        /* ── Featured parts ── */
        .featured-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        @media (max-width: 1100px) { .featured-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 600px)  { .featured-grid { grid-template-columns: 1fr; } }
        @media (max-width: 1000px) { .brands-new { grid-template-columns: repeat(4, 1fr); } }
      `}</style>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="hero-eyebrow">
              <span className="eyebrow-dot" />
              <span>Запчасти для грузовиков и спецтехники · Аренда</span>
            </div>
            <h1 className="hero-title">
              Любая запчасть — за <em>сутки</em><br />
              Любая техника — на <em>смену</em>
            </h1>
            <p className="hero-sub">
              20 000+ артикулов на складе в Алматы. KAMAZ, Volvo, Scania, MAN, HOWO, Shacman, MAZ.
              OEM и аналоги — с гарантией 12 месяцев.
            </p>
            <div className="hero-stats">
              <div><b>12 мес.</b><span>гарантия<br />на все товары</span></div>
              <div><b>24/7</b><span>приём<br />заявок</span></div>
              <div><b>300+</b><span>брендов<br />в каталоге</span></div>
            </div>
            <div className="hero-cta">
              <Link href="/catalog">
                <button style={{
                  background: 'var(--accent)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 15,
                  padding: '13px 28px',
                  borderRadius: 9,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  Перейти в каталог →
                </button>
              </Link>
              <Link href="/rental">
                <button style={{
                  background: 'var(--surf)',
                  color: 'var(--ink)',
                  fontWeight: 700,
                  fontSize: 15,
                  padding: '13px 28px',
                  borderRadius: 9,
                  border: '1.5px solid var(--line-2)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  Аренда спецтехники
                </button>
              </Link>
            </div>
          </div>

          <div className="hero-selector">
            <div className="hs-tag">
              <Ico name="car" size={14} />
              <span>Подбор по технике</span>
              <span className="hs-tag-fast">быстрее</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '4px 0' }}>
              {brands.slice(0, 6).map(b => (
                <Link key={b.id} href={`/catalog?brand=${b.id}`} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: 'var(--surf-2)',
                  borderRadius: 9,
                  textDecoration: 'none',
                  color: 'var(--ink)',
                  fontSize: 14,
                  fontWeight: 500,
                  transition: '.15s',
                }}>
                  <span>{b.name}</span>
                  <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>{(b.parts ?? 0).toLocaleString('ru')} запч.</span>
                </Link>
              ))}
            </div>
            <div className="hs-alt">
              <div className="hs-alt-row">
                <span className="hs-alt-icon"><Ico name="vin" size={14} /></span>
                <input
                  placeholder="VIN-номер: XTC65115…"
                  value={vinInput}
                  onChange={e => setVinInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && vinInput && router.push(`/catalog?vin=${encodeURIComponent(vinInput)}`)}
                />
                <button type="button" onClick={() => vinInput && router.push(`/catalog?vin=${encodeURIComponent(vinInput)}`)}>
                  Расшифровать
                </button>
              </div>
              <div className="hs-alt-row">
                <span className="hs-alt-icon"><Ico name="barcode" size={14} /></span>
                <input
                  placeholder="OEM-номер: 740.1118010-02"
                  value={oemInput}
                  onChange={e => setOemInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && oemInput && router.push(`/catalog?q=${encodeURIComponent(oemInput)}`)}
                />
                <button type="button" onClick={() => oemInput && router.push(`/catalog?q=${encodeURIComponent(oemInput)}`)}>
                  Найти
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Trust strip */}
        <div className="hero-marquee">
          <div className="container hm-row">
            {[
              'Гарантия 12 месяцев на все товары',
              'Возврат в течение 14 дней',
              'Оплата: Kaspi · безнал · наличные',
              'Доставка по всему Казахстану',
              'Самовывоз в Алматы',
            ].map((text) => (
              <span key={text} className="hm-item">
                <Ico name="check" size={12} /> {text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Марки грузовиков ── */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 className="section-title">Марки грузовиков</h2>
              <p className="section-sub">Запчасти по маркам — только реальное наличие, проверенные данные.</p>
            </div>
            <Link href="/catalog" className="section-more">Весь каталог <Ico name="arrow" size={14} /></Link>
          </div>
          <div className="type-tiles">
            {brands.map((b) => (
              <Link key={b.id} href={`/catalog?brand=${b.id}`} className="type-tile" style={{ textDecoration: 'none' }}>
                <div className="type-tile-icon" style={{ width: 48, height: 48, borderRadius: 10, background: 'var(--surf-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, color: 'var(--ink)', flexShrink: 0, border: '1.5px solid var(--line)' }}>
                  {b.name.slice(0, 3).toUpperCase()}
                </div>
                <div className="type-tile-meta">
                  <div className="type-tile-name">{b.name}</div>
                  <div className="type-tile-count">{(b.parts ?? 0).toLocaleString('ru-RU')} запч. · {b.country}</div>
                </div>
                <div className="type-tile-arrow"><Ico name="chevron" size={14} /></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Популярные категории ── */}
      <section className="section section-tint">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 className="section-title">Популярные категории</h2>
              <p className="section-sub">Запросы с высокой частотой за последние 30 дней.</p>
            </div>
            <Link href="/catalog" className="section-more">К полному каталогу <Ico name="arrow" size={14} /></Link>
          </div>
          <div className="cat-grid">
            {systems.slice(0, 8).map((s) => (
              <Link key={s.id} href={`/catalog?system=${s.id}`} className="cat-card" style={{ textDecoration: 'none' }}>
                <SysGlyph id={s.id} size={48} />
                <div className="cat-name">{s.ru}</div>
                <div className="cat-count">{s.count} артикулов</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Часто заказывают ── */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 className="section-title">Часто заказывают на этой неделе</h2>
              <p className="section-sub">По данным заказов парков КАМАЗ, MAZ, Shacman в Алматы и Астане.</p>
            </div>
            <Link href="/catalog" className="section-more">Все хиты продаж <Ico name="arrow" size={14} /></Link>
          </div>
          {parts.length > 0 ? (
            <div className="featured-grid">
              {parts.map(p => <PartCard key={p.id} part={p} />)}
            </div>
          ) : (
            <div className="featured-grid">
              {[1,2,3,4].map(i => (
                <div key={i} style={{
                  background: 'var(--surf)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--radius-lg)',
                  height: 320,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--ink-3)',
                  fontSize: 13,
                }}>
                  Загрузка...
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Аренда CTA ── */}
      <section className="section rental-cta">
        <div className="container rcta-grid">
          <div className="rcta-copy">
            <div className="rcta-eyebrow"><span className="eyebrow-dot" /> Аренда спецтехники</div>
            <h2 className="rcta-title">Техника на ваш объект — за 4 часа</h2>
            <p className="rcta-sub">
              Экскаваторы, погрузчики, самосвалы, краны и катки с оператором или без.
              Прозрачные тарифы за смену, день, неделю, месяц.
            </p>
            <ul className="rcta-list">
              <li><Ico name="check" size={14} /> Доставка тралом в черте города — бесплатно</li>
              <li><Ico name="check" size={14} /> Договор и закрывающие документы</li>
              <li><Ico name="check" size={14} /> Парк 240+ единиц — Алматы, Астана, Шымкент</li>
            </ul>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/rental">
                <button style={{
                  background: 'var(--accent)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 15,
                  padding: '13px 28px',
                  borderRadius: 9,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  Подобрать технику →
                </button>
              </Link>
              <a href="tel:+77000000000">
                <button style={{
                  background: 'var(--surf)',
                  color: 'var(--ink)',
                  fontWeight: 700,
                  fontSize: 15,
                  padding: '13px 24px',
                  borderRadius: 9,
                  border: '1.5px solid var(--line-2)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  📞 +7 (700) 000-00-00
                </button>
              </a>
            </div>
          </div>
          <div className="rcta-vis">
            <RentalSlideshow />
          </div>
        </div>
      </section>

    </main>
  )
}
