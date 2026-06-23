'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Ico } from '@/components/ui/Ico'
import { Btn } from '@/components/ui/Btn'
import { Crumbs } from '@/components/ui/Crumbs'
import { Placeholder } from '@/components/ui/Placeholder'
import { ToastHost, type ToastItem } from '@/components/ui/Toast'
import { useCart } from '@/store/cart'
import { fmtKZT } from '@/lib/utils'
import { submitOrder } from '@/app/actions'

export default function CartPage() {
  const router = useRouter()
  const { items, setQty, clearCart } = useCart()
  const [b2b, setB2b]         = useState(true)
  const [pay, setPay]         = useState('invoice')
  const [delivery, setDelivery] = useState('courier')
  const [toasts, setToasts]   = useState<ToastItem[]>([])
  const [submitting, setSubmitting] = useState(false)
  const nameRef  = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const companyRef = useRef<HTMLInputElement>(null)
  const binRef   = useRef<HTMLInputElement>(null)

  const addToast = (msg: string, icon: 'check' | 'info' = 'check') =>
    setToasts((t) => [...t, { id: Date.now(), msg, icon }])

  const handleCheckout = async () => {
    if (submitting) return
    const name  = nameRef.current?.value?.trim()
    const phone = phoneRef.current?.value?.trim()
    if (!name)  { addToast('Введите имя', 'info'); return }
    if (!phone) { addToast('Введите телефон', 'info'); return }
    setSubmitting(true)
    try {
      const result = await submitOrder({
        kind:     'order',
        name,
        phone,
        payment:  pay,
        delivery,
        company:  companyRef.current?.value,
        bin:      binRef.current?.value,
        items:    items.map(({ id, oem, name, qty, price }) => ({ id, oem, name, qty, price })),
      })
      if (result.ok) {
        clearCart()
        const q = new URLSearchParams({ num: result.invoiceNumber ?? '', phone, pay })
        router.push(`/order-success?${q}`)
      } else {
        addToast(result.message, 'info')
      }
    } catch {
      addToast('Ошибка соединения. Попробуйте ещё раз.', 'info')
    } finally {
      setSubmitting(false)
    }
  }

  const crumbs = [
    { label: 'Главная', onClick: () => router.push('/') },
    { label: 'Корзина' },
  ]

  const subtotal = items.reduce((a, c) => a + c.price * c.qty, 0)
  const vat = Math.round(subtotal * 12 / 112)
  const deliveryCost = delivery === 'pickup' ? 0 : subtotal >= 30000 ? 0 : 2500
  const discount = Math.round(subtotal * 0.03)
  const total = subtotal + deliveryCost - discount

  if (items.length === 0) {
    return (
      <main className="cart-empty">
        <div className="container">
          <Crumbs items={crumbs} />
          <div className="empty-state">
            <Ico name="cart" size={56} stroke={1} />
            <h2>Корзина пуста</h2>
            <p>Перейдите в каталог и подберите запчасти под свою технику.</p>
            <Link href="/podbor">
              <Btn variant="primary" size="lg" iconRight="arrow">Перейти в каталог</Btn>
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
            <h1>Оформление заказа</h1>
            <p>{items.length} {items.length < 5 ? 'позиции' : 'позиций'} в корзине · {items.reduce((a, c) => a + c.qty, 0)} шт</p>
          </div>
          <div className="cart-mode">
            <span className="cart-mode-lbl">Я покупаю как:</span>
            <div className="cart-mode-switch">
              <button className={!b2b ? 'on' : ''} onClick={() => setB2b(false)}>Физ. лицо</button>
              <button className={b2b ? 'on' : ''} onClick={() => setB2b(true)}>Юр. лицо / ИП</button>
            </div>
          </div>
        </header>

        <div className="cart-layout">
          <div className="cart-main">
            {/* Items */}
            <div className="cart-section">
              <div className="cart-section-head">
                <h3>1. Товары</h3>
                <button className="link" onClick={() => addToast('Корзина сохранена')}>Сохранить корзину</button>
              </div>
              <div className="cart-items">
                {items.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="ci-thumb"><Placeholder label={item.img} ratio="1" /></div>
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
                      <b>{fmtKZT(item.price * item.qty)}</b>
                      <span>{fmtKZT(item.price)} / шт</span>
                    </div>
                    <button className="ci-remove" onClick={() => setQty(item.id, 0)}><Ico name="close" size={14} /></button>
                  </div>
                ))}
              </div>
              <div className="cart-upsell">
                <Ico name="info" size={14} />
                <span>До бесплатной доставки осталось <b>{Math.max(0, 30000 - subtotal).toLocaleString('ru-RU')} ₸</b>. Часто докладывают: ремкомплект, фильтры, ремни.</span>
              </div>
            </div>

            {/* Delivery */}
            <div className="cart-section">
              <h3>2. Доставка</h3>
              <div className="cart-options">
                {[
                  { id: 'pickup',  icon: 'pin',   label: 'Самовывоз — Алматы, Райымбека 348А', sub: 'Сегодня после 14:00', price: 0 },
                  { id: 'courier', icon: 'truck',  label: 'Курьер по Алматы', sub: 'Завтра 09:00–18:00 · окно 2 часа', price: subtotal >= 30000 ? 0 : 2500 },
                  { id: 'sdek',    icon: 'bolt',   label: 'СДЭК в регионы Казахстана', sub: '2–4 дня · расчёт автоматически', price: 4800 },
                  { id: 'freight', icon: 'bag',    label: 'Грузовая доставка (для тяжёлых партий)', sub: 'ПЭК / Энергия · от 3 дней', price: null },
                ].map((o) => (
                  <label key={o.id} className={`cart-opt ${delivery === o.id ? 'on' : ''}`}>
                    <input type="radio" checked={delivery === o.id} onChange={() => setDelivery(o.id)} />
                    <Ico name={o.icon} size={18} />
                    <div className="cart-opt-meta">
                      <b>{o.label}</b>
                      <span>{o.sub}</span>
                    </div>
                    <div className="cart-opt-price">
                      {o.price === 0 ? 'Бесплатно' : o.price === null ? 'По расчёту' : fmtKZT(o.price)}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Payment */}
            <div className="cart-section">
              <h3>3. Оплата</h3>
              <div className="cart-pay-grid">
                {[
                  { id: 'invoice',  label: 'Безналичный расчёт',      sub: 'Счёт на оплату · отгрузка по приходу средств', tag: b2b ? 'Рекомендуем для юр. лиц' : null },
                  { id: 'kaspi-qr', label: 'Kaspi QR',                sub: 'Оплата картой Kaspi · моментально', tag: 'Популярно' },
                  { id: 'kaspi-rs', label: 'Kaspi рассрочка 0-0-12',  sub: '12 месяцев · без переплаты', tag: null },
                  { id: 'card',     label: 'Карта Visa / Mastercard', sub: 'Halyk, Forte, Kaspi Gold', tag: null },
                  { id: 'cod',      label: 'Наложенный платёж',       sub: 'Оплата при получении', tag: null },
                  { id: 'usd',      label: 'USD wire (для контрактов)',sub: 'SWIFT · до 5 рабочих дней', tag: null },
                ].map((o) => (
                  <label key={o.id} className={`pay-card ${pay === o.id ? 'on' : ''}`}>
                    <input type="radio" checked={pay === o.id} onChange={() => setPay(o.id)} />
                    <div className="pay-card-meta"><b>{o.label}</b><span>{o.sub}</span></div>
                    {o.tag && <div className="pay-tag">{o.tag}</div>}
                  </label>
                ))}
              </div>
            </div>

            {/* Contact — always shown */}
            {!b2b && (
              <div className="cart-section">
                <h3>4. Контактные данные</h3>
                <div className="b2b-grid">
                  <div className="b2b-row"><label>Имя *</label><input ref={nameRef} placeholder="Айбек Тулегенов" /></div>
                  <div className="b2b-row"><label>Телефон *</label><input ref={phoneRef} placeholder="+7 (700) 000-00-00" /></div>
                </div>
              </div>
            )}

            {/* B2B */}
            {b2b && (
              <div className="cart-section cart-b2b">
                <h3>4. Реквизиты компании</h3>
                <div className="b2b-grid">
                  <div className="b2b-row"><label>Контактное лицо *</label><input ref={nameRef} placeholder="Айбек Тулегенов" /></div>
                  <div className="b2b-row"><label>Телефон *</label><input ref={phoneRef} placeholder="+7 (700) 000-00-00" /></div>
                  <div className="b2b-row"><label>Название юр. лица</label><input ref={companyRef} defaultValue="ТОО «АлматыСпецТранс»" /></div>
                  <div className="b2b-row"><label>БИН / ИИН</label><input ref={binRef} defaultValue="200140012345" /></div>
                  <div className="b2b-row"><label>ИИК</label><input defaultValue="KZ496010131000123456" /></div>
                  <div className="b2b-row"><label>Банк</label><input defaultValue="АО «Народный Банк Казахстана»" /></div>
                  <div className="b2b-row b2b-row-full"><label>Юридический адрес</label><input defaultValue="г. Алматы, ул. Толе би 286/4, оф. 12" /></div>
                  <div className="b2b-row b2b-row-full">
                    <label>Договор поставки</label>
                    <div className="b2b-upload">
                      <button>+ Загрузить PDF</button>
                      <span>или работаем по разовой оферте — счёт-фактура в течение 5 мин.</span>
                    </div>
                  </div>
                </div>
                <div className="b2b-checks">
                  <label className="filt-toggle"><input type="checkbox" defaultChecked /><span>Электронные счёт-фактуры (ЭСФ) — отправить через 1С</span></label>
                  <label className="filt-toggle"><input type="checkbox" /><span>Закрепить менеджера за компанией</span></label>
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <aside className="cart-side">
            <div className="cart-summary">
              <h3>Итого</h3>
              <div className="sum-row"><span>Товары · {items.reduce((a, c) => a + c.qty, 0)} шт</span><b>{fmtKZT(subtotal)}</b></div>
              <div className="sum-row sum-sub"><span>в том числе НДС 12%</span><b>{fmtKZT(vat)}</b></div>
              <div className="sum-row"><span>Доставка</span><b>{deliveryCost === 0 ? 'Бесплатно' : fmtKZT(deliveryCost)}</b></div>
              <div className="sum-row sum-sub"><span>Скидка постоянного клиента 3%</span><b>−{fmtKZT(discount)}</b></div>
              <div className="sum-grand"><span>К оплате</span><b>{fmtKZT(total)}</b></div>
              <Btn
                variant="primary" size="lg" full iconRight="arrow"
                onClick={handleCheckout}
                disabled={submitting}
              >
                {submitting ? 'Отправка...' : pay === 'invoice' ? 'Сформировать счёт' : 'Оплатить заказ'}
              </Btn>
              <button className="cart-pdf"><Ico name="pdf" size={14} /> Скачать счёт-фактуру (PDF)</button>
              <ul className="cart-trust">
                <li><Ico name="check" size={12} /> Гарантия 6 мес. на OEM</li>
                <li><Ico name="check" size={12} /> Возврат 14 дней без вопросов</li>
                <li><Ico name="check" size={12} /> Закрывающие документы в 1С</li>
              </ul>
            </div>
            <div className="cart-promo">
              <Ico name="bolt" size={14} />
              <div>
                <b>Промокод</b>
                <span>Есть код от менеджера? Введите ниже.</span>
                <div className="promo-row">
                  <input placeholder="PARK15" />
                  <button>Применить</button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <ToastHost toasts={toasts} onClear={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />
    </main>
  )
}
