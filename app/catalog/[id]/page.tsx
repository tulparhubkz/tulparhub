'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Ico } from '@/components/ui/Ico'
import { Btn } from '@/components/ui/Btn'
import { Badge } from '@/components/ui/Badge'
import { Chip } from '@/components/ui/Badge'
import { Crumbs } from '@/components/ui/Crumbs'
import { useCart } from '@/store/cart'
import { fmtKZT } from '@/lib/utils'

export default function PDPPage() {
  const { id } = useParams<{ id: string }>()
  const router  = useRouter()
  const [part, setPart]       = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty]         = useState(1)
  const [tab, setTab]         = useState('specs')
  const [b2b, setB2b]         = useState(false)

  const { items, addItem } = useCart()
  const inCart  = items.some((i) => i.id === id)
  const cartQty = items.find((i) => i.id === id)?.qty ?? 0

  useEffect(() => {
    fetch(`/api/parts/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.part_stock) {
          data.stock = Object.fromEntries(data.part_stock.map((s: any) => [s.city, s.qty]))
        }
        setPart(data)
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <main className="pdp"><div className="container" style={{ padding: '4rem 0' }}>Загрузка...</div></main>
  if (!part || part.error) return <main className="pdp"><div className="container" style={{ padding: '4rem 0' }}>Товар не найден</div></main>

  const price    = b2b ? (part.price_b2b || part.price) : part.price
  const stock    = (part.stock as Record<string, number>) ?? {}
  const totalQty = Object.values(stock).reduce((a: number, b: number) => a + b, 0)

  const crumbs = [
    { label: 'Главная', onClick: () => router.push('/') },
    { label: 'Каталог', onClick: () => router.push('/catalog') },
    { label: part.name },
  ]

  return (
    <main className="pdp">
      <div className="container">
        <Crumbs items={crumbs} />

        <div className="pdp-top">
          {/* Gallery */}
          <div className="pdp-gallery">
            <div className="pdp-main-img">
              <div className="pdp-img-badges">
                <Badge tone="oem">{part.type || 'OEM'}</Badge>
                <Badge tone="ok">Гарантия 6 мес</Badge>
              </div>
              <div style={{ background: '#f0f2f5', borderRadius: 12, height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: 14 }}>
                {part.brand}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="pdp-info">
            <div className="pdp-brand">{part.brand} · <span>{part.type || 'OEM'}</span></div>
            <h1 className="pdp-name">{part.name}</h1>

            <div className="pdp-oem-block">
              <div>
                <span>Артикул OEM</span>
                <b className="pdp-oem">{part.oem}</b>
              </div>
              <button className="pdp-copy" onClick={() => navigator.clipboard?.writeText(part.oem)}>
                Скопировать
              </button>
            </div>

            {part.cross?.length > 0 && (
              <div className="pdp-cross">
                <div className="pdp-cross-label">Кросс-номера:</div>
                <div className="pdp-cross-chips">
                  {(part.cross as string[]).slice(0, 6).map((c: string) => <Chip key={c}>{c}</Chip>)}
                </div>
              </div>
            )}

            {part.fits?.length > 0 && (
              <div className="pdp-fits">
                <div className="pdp-fits-label">Подходит на:</div>
                <div className="pdp-fits-chips">
                  {(part.fits as string[]).map((f: string) => <Chip key={f}>{f}</Chip>)}
                </div>
              </div>
            )}

            <div className="pdp-buy">
              <div style={{ marginBottom: 12 }}>
                <div className="cart-mode-switch">
                  <button className={!b2b ? 'on' : ''} onClick={() => setB2b(false)}>Физ. лицо</button>
                  <button className={b2b ? 'on' : ''} onClick={() => setB2b(true)}>Юр. лицо / ИП</button>
                </div>
              </div>

              <div className="pdp-price-block">
                <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--accent)' }}>{fmtKZT(price)}</div>
                {b2b && part.price_b2b && part.price_b2b < part.price && (
                  <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>
                    Розничная: {fmtKZT(part.price)} · Экономия: {fmtKZT(part.price - part.price_b2b)}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '8px 0' }}>
                {totalQty > 0 ? (
                  Object.entries(stock).filter(([, q]) => (q as number) > 0).map(([city, q]) => (
                    <span key={city} style={{ fontSize: 12, background: '#e8f5e9', color: '#2e7d32', padding: '2px 8px', borderRadius: 4 }}>
                      {city}: {q as number} шт
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: 12, background: '#fff3e0', color: '#e65100', padding: '2px 8px', borderRadius: 4 }}>
                    Под заказ · 3–5 дней
                  </span>
                )}
              </div>

              <div className="pdp-qty-row">
                <div className="pdp-qty">
                  <button onClick={() => setQty(Math.max(1, qty - 1))}><Ico name="minus" size={14} /></button>
                  <input value={qty} onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))} />
                  <button onClick={() => setQty(qty + 1)}><Ico name="plus" size={14} /></button>
                </div>
                <Btn
                  variant={inCart ? 'success' : 'primary'}
                  size="lg" icon={inCart ? 'check' : 'cart'} full
                  onClick={() => addItem({ ...part, stock }, qty)}
                >
                  {inCart ? `В корзине (${cartQty})` : 'Добавить в корзину'}
                </Btn>
              </div>

              <div className="pdp-delivery">
                <div className="pdp-del-row">
                  <Ico name="pin" size={14} />
                  <div><b>Самовывоз — сегодня</b><span>Алматы, Райымбека 348А · после 14:00</span></div>
                </div>
                <div className="pdp-del-row">
                  <Ico name="truck" size={14} />
                  <div><b>Доставка по Алматы — завтра</b><span>2 500 ₸ · бесплатно от 30 000 ₸</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Side */}
          <aside className="pdp-side">
            <div className="pdp-side-card">
              <h4>Запросить счёт</h4>
              <p>Сформируем счёт на оплату за 5 минут. Оплата по реквизитам.</p>
              <Btn variant="dark" full icon="pdf">Сформировать счёт</Btn>
            </div>
            <div className="pdp-side-card">
              <h4>Связаться</h4>
              <div className="pdp-side-contact">
                <button><Ico name="phone" size={14} /> +7 (727) 350-22-22</button>
                <button><Ico name="chat" size={14} /> WhatsApp · Telegram</button>
              </div>
            </div>
          </aside>
        </div>

        {/* Tabs */}
        <div className="pdp-tabs">
          {[['specs','Характеристики'],['cross','Кросс-номера'],['compat','Совместимость'],['reviews','Отзывы']].map(([k,l]) => (
            <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>
          ))}
        </div>

        <div className="pdp-tab-body">
          {tab === 'specs' && (
            <div className="pdp-specs">
              <h3>Характеристики</h3>
              <table><tbody>
                <tr><th>Артикул</th><td>{part.oem}</td></tr>
                <tr><th>Бренд</th><td>{part.brand}</td></tr>
                <tr><th>Тип</th><td>{part.type || 'OEM'}</td></tr>
                <tr><th>Гарантия</th><td>6 месяцев</td></tr>
              </tbody></table>
            </div>
          )}
          {tab === 'cross' && (
            <div className="pdp-cross-tab">
              <h3>Кросс-номера</h3>
              {part.cross?.length > 0 ? (
                <table>
                  <thead><tr><th>Артикул</th><th>Бренд</th></tr></thead>
                  <tbody>
                    {(part.cross as string[]).map((c: string) => (
                      <tr key={c}><td><b className="mono">{c}</b></td><td>{part.brand}</td></tr>
                    ))}
                  </tbody>
                </table>
              ) : <p style={{ color: 'var(--ink-3)' }}>Кросс-номера не указаны</p>}
            </div>
          )}
          {tab === 'compat' && (
            <div className="pdp-compat">
              <h3>Совместимая техника</h3>
              {part.fits?.length > 0 ? (
                <div className="compat-grid">
                  {(part.fits as string[]).map((f: string) => (
                    <div key={f} className="compat-row">
                      <Ico name="truck" size={20} />
                      <div className="compat-name">{f}</div>
                      <Link href={`/catalog?q=${encodeURIComponent(f)}`}>Все запчасти →</Link>
                    </div>
                  ))}
                </div>
              ) : <p style={{ color: 'var(--ink-3)' }}>Информация о совместимости уточняется</p>}
            </div>
          )}
          {tab === 'reviews' && (
            <div className="pdp-reviews">
              <h3>Отзывы</h3>
              <p style={{ color: 'var(--ink-3)' }}>Отзывов пока нет. Будьте первым!</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
