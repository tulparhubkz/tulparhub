'use client'
import { useState, useRef } from 'react'
import { useRouter } from '@/i18n/navigation'
import { Link } from '@/i18n/navigation'
import { Ico } from '@/components/ui/Ico'
import { Btn } from '@/components/ui/Btn'
import { Crumbs } from '@/components/ui/Crumbs'
import { Placeholder } from '@/components/ui/Placeholder'
import { ToastHost, type ToastItem } from '@/components/ui/Toast'
import { useCart } from '@/store/cart'
import { fmtKZT } from '@/lib/utils'
import { useT } from '@/lib/i18n'
import { isValidPhone, isValidEmail, formatPhoneInput } from '@/lib/validation'
import { submitOrder } from '@/app/actions'

export default function CartPage() {
  const router = useRouter()
  const t = useT()
  const { items, setQty, clearCart, city } = useCart()
  const [b2b, setB2b]         = useState(true)
  const [pay, setPay]         = useState('invoice')
  const [delivery, setDelivery] = useState('courier')
  const [toasts, setToasts]   = useState<ToastItem[]>([])
  const [submitting, setSubmitting] = useState(false)
  const nameRef  = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const companyRef = useRef<HTMLInputElement>(null)
  const binRef   = useRef<HTMLInputElement>(null)
  const esfRef   = useRef<HTMLInputElement>(null)
  const mgrRef   = useRef<HTMLInputElement>(null)

  const addToast = (msg: string, icon: 'check' | 'info' = 'check') =>
    setToasts((t) => [...t, { id: Date.now(), msg, icon }])

  // ЮЛ buyers see the wholesale price where the feed has one. The server
  // re-prices with the same rule and additionally checks the session role.
  const unitPrice = (i: { price: number; price_b2b?: number | null }) =>
    b2b && i.price_b2b ? i.price_b2b : i.price

  const handleCheckout = async () => {
    if (submitting) return
    const name  = nameRef.current?.value?.trim()
    const phone = phoneRef.current?.value?.trim()
    const email = emailRef.current?.value?.trim()
    if (!name)  { addToast(t('cart.toast.enterName'), 'info'); return }
    if (!phone) { addToast(t('cart.toast.enterPhone'), 'info'); return }
    if (!isValidPhone(phone)) { addToast(t('cart.toast.badPhone'), 'info'); return }
    if (email && !isValidEmail(email)) { addToast(t('cart.toast.badEmail'), 'info'); return }
    setSubmitting(true)
    // B2B service flags travel in the order comment so ops sees them.
    const notes = [
      b2b && esfRef.current?.checked ? 'ЭСФ через 1С' : null,
      b2b && mgrRef.current?.checked ? 'Нужен персональный менеджер' : null,
    ].filter(Boolean).join(' · ')
    try {
      const result = await submitOrder({
        kind:     'order',
        b2b,
        name,
        phone,
        email,
        city,
        payment:  pay,
        delivery,
        company:  companyRef.current?.value,
        bin:      binRef.current?.value,
        comment:  notes || undefined,
        items:    items.map((i) => ({ id: i.id, oem: i.oem ?? '', name: i.name, qty: i.qty, price: unitPrice(i) })),
      })
      if (result.ok) {
        clearCart()
        // The order UUID doubles as the invoice link — keep it out of the URL
        // (browser history / referrers) and hand it over via sessionStorage (#67).
        if (result.orderId) sessionStorage.setItem('th-last-order', result.orderId)
        const q = new URLSearchParams({ num: result.invoiceNumber ?? '', phone, pay, total: String(result.total ?? '') })
        router.push(`/order-success?${q}`)
      } else {
        addToast(t(result.message, result.params), 'info')
      }
    } catch {
      addToast(t('cart.toast.connError'), 'info')
    } finally {
      setSubmitting(false)
    }
  }

  const crumbs = [
    { label: t('common.home'), onClick: () => router.push('/') },
    { label: t('cart.crumb') },
  ]

  const subtotal = items.reduce((a, c) => a + unitPrice(c) * c.qty, 0)
  const vat = Math.round(subtotal * 12 / 112)
  const deliveryCost = delivery === 'pickup' ? 0 : subtotal >= 30000 ? 0 : 2500
  const total = subtotal + deliveryCost

  if (items.length === 0) {
    return (
      <main className="cart-empty">
        <div className="container">
          <Crumbs items={crumbs} />
          <div className="empty-state">
            <Ico name="cart" size={56} stroke={1} />
            <h2>{t('cart.empty.title')}</h2>
            <p>{t('cart.empty.text')}</p>
            <Link href="/podbor">
              <Btn variant="primary" size="lg" iconRight="arrow">{t('common.toCatalog')}</Btn>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="cart">
      <div className="container">
        <Crumbs items={crumbs} />

        <header className="cart-head">
          <div>
            <h1>{t('cart.head.title')}</h1>
            <p>{items.length} {items.length < 5 ? t('cart.itemsFew') : t('cart.itemsMany')} {t('cart.inCart')} · {items.reduce((a, c) => a + c.qty, 0)} {t('cart.pcs')}</p>
          </div>
          <div className="cart-mode">
            <span className="cart-mode-lbl">{t('cart.buyingAs')}</span>
            <div className="cart-mode-switch">
              <button className={!b2b ? 'on' : ''} onClick={() => setB2b(false)}>{t('cart.individual')}</button>
              <button className={b2b ? 'on' : ''} onClick={() => setB2b(true)}>{t('cart.legal')}</button>
            </div>
          </div>
        </header>

        <div className="cart-layout">
          <div className="cart-main">
            {/* Items */}
            <div className="cart-section">
              <div className="cart-section-head">
                <h3>1. {t('cart.sec.items')}</h3>
              </div>
              <div className="cart-items">
                {items.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="ci-thumb"><Placeholder label={item.img ?? undefined} ratio="1" /></div>
                    <div className="ci-meta">
                      <div className="ci-oem">{item.oem}</div>
                      <div className="ci-name">{item.name}</div>
                      <div className="ci-fits">{item.brand} · {item.type}</div>
                      <div className="ci-stock"><span className="stock-dot ok" /> {item.eta}</div>
                    </div>
                    <div className="ci-qty">
                      <button onClick={() => setQty(item.id, Math.max(0, item.qty - 1))}><Ico name="minus" size={12} /></button>
                      <input value={item.qty} readOnly />
                      <button onClick={() => setQty(item.id, item.qty + 1)}><Ico name="plus" size={12} /></button>
                    </div>
                    <div className="ci-price">
                      <b>{fmtKZT(unitPrice(item) * item.qty)}</b>
                      <span>{fmtKZT(unitPrice(item))} {t('cart.perPc')}</span>
                    </div>
                    <button className="ci-remove" onClick={() => setQty(item.id, 0)}><Ico name="close" size={14} /></button>
                  </div>
                ))}
              </div>
              <div className="cart-upsell">
                <Ico name="info" size={14} />
                <span>{t('cart.upsell.pre')}<b>{Math.max(0, 30000 - subtotal).toLocaleString('ru-RU')} ₸</b>{t('cart.upsell.post')}</span>
              </div>
            </div>

            {/* Delivery */}
            <div className="cart-section">
              <h3>2. {t('cart.sec.delivery')}</h3>
              <div className="cart-options">
                {([
                  { id: 'pickup',  icon: 'pin',   label: 'cart.del.pickup.label', sub: 'cart.del.pickup.sub', price: 0 },
                  { id: 'courier', icon: 'truck',  label: 'cart.del.courier.label', sub: 'cart.del.courier.sub', price: subtotal >= 30000 ? 0 : 2500 },
                  { id: 'sdek',    icon: 'bolt',   label: 'cart.del.sdek.label', sub: 'cart.del.sdek.sub', price: 4800 },
                  { id: 'freight', icon: 'bag',    label: 'cart.del.freight.label', sub: 'cart.del.freight.sub', price: null },
                ] as const).map((o) => (
                  <label key={o.id} className={`cart-opt ${delivery === o.id ? 'on' : ''}`}>
                    <input type="radio" checked={delivery === o.id} onChange={() => setDelivery(o.id)} />
                    <Ico name={o.icon} size={18} />
                    <div className="cart-opt-meta">
                      <b>{t(o.label)}</b>
                      <span>{t(o.sub)}</span>
                    </div>
                    <div className="cart-opt-price">
                      {o.price === 0 ? t('cart.free') : o.price === null ? t('cart.byCalc') : fmtKZT(o.price)}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Payment */}
            <div className="cart-section">
              <h3>3. {t('cart.sec.payment')}</h3>
              <div className="cart-pay-grid">
                {([
                  { id: 'invoice',  label: 'cart.pay.invoice.label', sub: 'cart.pay.invoice.sub', tag: b2b ? 'cart.pay.invoice.tag' : null },
                  { id: 'kaspi-qr', label: 'cart.pay.kaspiqr.label', sub: 'cart.pay.kaspiqr.sub', tag: 'cart.pay.kaspiqr.tag' },
                  { id: 'kaspi-rs', label: 'cart.pay.kaspirs.label', sub: 'cart.pay.kaspirs.sub', tag: null },
                  { id: 'card',     label: 'cart.pay.card.label', sub: 'cart.pay.card.sub', tag: null },
                  { id: 'cod',      label: 'cart.pay.cod.label', sub: 'cart.pay.cod.sub', tag: null },
                  { id: 'usd',      label: 'cart.pay.usd.label', sub: 'cart.pay.usd.sub', tag: null },
                ] as const).map((o) => (
                  <label key={o.id} className={`pay-card ${pay === o.id ? 'on' : ''}`}>
                    <input type="radio" checked={pay === o.id} onChange={() => setPay(o.id)} />
                    <div className="pay-card-meta"><b>{t(o.label)}</b><span>{t(o.sub)}</span></div>
                    {o.tag && <div className="pay-tag">{t(o.tag)}</div>}
                  </label>
                ))}
              </div>
            </div>

            {/* Contact — always shown */}
            {!b2b && (
              <div className="cart-section">
                <h3>4. {t('cart.sec.contact')}</h3>
                <div className="b2b-grid">
                  <div className="b2b-row"><label>{t('cart.name')}</label><input ref={nameRef} placeholder={t('cart.namePlaceholder')} /></div>
                  <div className="b2b-row"><label>{t('cart.phone')}</label><input ref={phoneRef} type="tel" placeholder="+7 (700) 000-00-00" onChange={(e) => { e.target.value = formatPhoneInput(e.target.value) }} /></div>
                  <div className="b2b-row"><label>{t('cart.email')}</label><input ref={emailRef} type="email" placeholder="mail@example.com" title={t('cart.emailNote')} /></div>
                </div>
              </div>
            )}

            {/* B2B */}
            {b2b && (
              <div className="cart-section cart-b2b">
                <h3>4. {t('cart.sec.company')}</h3>
                <div className="b2b-grid">
                  <div className="b2b-row"><label>{t('cart.contactPerson')}</label><input ref={nameRef} placeholder={t('cart.namePlaceholder')} /></div>
                  <div className="b2b-row"><label>{t('cart.phone')}</label><input ref={phoneRef} type="tel" placeholder="+7 (700) 000-00-00" onChange={(e) => { e.target.value = formatPhoneInput(e.target.value) }} /></div>
                  <div className="b2b-row"><label>{t('cart.email')}</label><input ref={emailRef} type="email" placeholder="mail@example.com" title={t('cart.emailNote')} /></div>
                  <div className="b2b-row"><label>{t('cart.companyName')}</label><input ref={companyRef} placeholder="ТОО «Компания»" /></div>
                  <div className="b2b-row"><label>{t('cart.bin')}</label><input ref={binRef} placeholder="000000000000" inputMode="numeric" /></div>
                </div>
                <div className="b2b-checks">
                  <label className="filt-toggle"><input ref={esfRef} type="checkbox" defaultChecked /><span>{t('cart.esf')}</span></label>
                  <label className="filt-toggle"><input ref={mgrRef} type="checkbox" /><span>{t('cart.assignManager')}</span></label>
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <aside className="cart-side">
            <div className="cart-summary">
              <h3>{t('cart.summary.title')}</h3>
              <div className="sum-row"><span>{t('cart.sum.goods')} · {items.reduce((a, c) => a + c.qty, 0)} {t('cart.pcs')}</span><b>{fmtKZT(subtotal)}</b></div>
              <div className="sum-row sum-sub"><span>{t('cart.sum.vat')}</span><b>{fmtKZT(vat)}</b></div>
              <div className="sum-row"><span>{t('cart.sum.delivery')}</span><b>{deliveryCost === 0 ? t('cart.free') : fmtKZT(deliveryCost)}</b></div>
              <div className="sum-grand"><span>{t('cart.sum.grand')}</span><b>{fmtKZT(total)}</b></div>
              <Btn
                variant="primary" size="lg" full iconRight="arrow"
                onClick={handleCheckout}
                disabled={submitting}
              >
                {submitting ? t('cart.submitting') : pay === 'invoice' ? t('cart.makeInvoice') : t('cart.payOrder')}
              </Btn>
              <ul className="cart-trust">
                <li><Ico name="check" size={12} /> {t('cart.trust1')}</li>
                <li><Ico name="check" size={12} /> {t('cart.trust2')}</li>
                <li><Ico name="check" size={12} /> {t('cart.trust3')}</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
      <ToastHost toasts={toasts} onClear={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />
    </main>
  )
}
