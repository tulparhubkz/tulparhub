'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Ico } from '@/components/ui/Ico'
import { Btn } from '@/components/ui/Btn'
import { Badge } from '@/components/ui/Badge'
import { Chip } from '@/components/ui/Badge'
import { Crumbs } from '@/components/ui/Crumbs'
import { Placeholder } from '@/components/ui/Placeholder'
import { Price } from '@/components/ui/Price'
import { Stock } from '@/components/ui/Stock'
import { PartCard } from '@/components/catalog/PartCard'
import { parts, systems } from '@/lib/data'
import { useCart } from '@/store/cart'
import { fmtKZT } from '@/lib/utils'

export default function PDPPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const part = parts.find((p) => p.id === id) ?? parts[0]
  const related = parts.filter((p) => p.id !== part.id).slice(0, 4)

  const [qty, setQty]       = useState(1)
  const [tab, setTab]       = useState('specs')
  const [showVAT, setShowVAT] = useState(false)
  const [thumb, setThumb]   = useState(0)

  const { items, addItem } = useCart()
  const inCart = items.some((i) => i.id === part.id)
  const cartQty = items.find((i) => i.id === part.id)?.qty ?? 0

  const crumbs = [
    { label: 'Главная', onClick: () => router.push('/') },
    { label: 'Каталог', onClick: () => router.push('/catalog') },
    { label: systems.find((s) => s.id === part.category)?.ru ?? 'Категория', onClick: () => router.push(`/catalog?system=${part.category}`) },
    { label: part.name },
  ]

  const tabs = [
    ['specs', 'Характеристики'],
    ['compat', 'Совместимость'],
    ['cross', 'Кросс-номера'],
    ['reviews', `Отзывы (${part.reviews})`],
    ['qa', 'Вопросы и ответы'],
    ['docs', 'Документация'],
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
                <Badge tone={part.type === 'OEM' ? 'oem' : 'aft'}>{part.type}</Badge>
                <Badge tone="ok">Гарантия 6 мес</Badge>
              </div>
              <Placeholder label={`${part.img} · поворот 360°`} ratio="4/3" />
              <div className="pdp-img-tools">
                <button>Видео</button>
                <button>360°</button>
                <button>Чертёж</button>
              </div>
            </div>
            <div className="pdp-thumbs">
              {[1, 2, 3, 4, 5].map((i) => (
                <button key={i} className={`pdp-thumb ${thumb === i - 1 ? 'on' : ''}`} onClick={() => setThumb(i - 1)}>
                  <Placeholder label={`${i}`} ratio="1" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="pdp-info">
            <div className="pdp-brand">{part.brand} · <span>{part.type}</span></div>
            <h1 className="pdp-name">{part.name}</h1>

            <div className="pdp-oem-block">
              <div>
                <span>Артикул OEM</span>
                <b className="pdp-oem">{part.oem}</b>
              </div>
              <button className="pdp-copy" onClick={() => navigator.clipboard?.writeText(part.oem)}>Скопировать</button>
            </div>

            <div className="pdp-rating">
              <span className="pdp-stars"><Ico name="star" size={14} /> {part.rating}</span>
              <span>· {part.reviews} отзывов</span>
              <span>· Заказывали {part.reviews * 4} раз</span>
            </div>

            <div className="pdp-cross">
              <div className="pdp-cross-label">Кросс-номера:</div>
              <div className="pdp-cross-chips">
                {part.cross.map((c) => <Chip key={c}>{c}</Chip>)}
              </div>
            </div>

            <div className="pdp-fits">
              <div className="pdp-fits-label">Подходит на:</div>
              <div className="pdp-fits-chips">
                {part.fits.map((f) => <Chip key={f}>{f}</Chip>)}
              </div>
              <a href="#">Все совместимые модели ({part.fits.length * 3}) →</a>
            </div>

            <div className="pdp-buy">
              <div className="pdp-price-block">
                <Price value={part.price} vat={part.vat} showVAT={showVAT} size="lg" />
                <label className="vat-toggle">
                  <input type="checkbox" checked={showVAT} onChange={(e) => setShowVAT(e.target.checked)} />
                  <span>Цена без НДС</span>
                </label>
              </div>

              <div className="pdp-stock-block">
                <Stock stock={part.stock} />
                <div className="pdp-stock-detail">
                  {Object.entries(part.stock).map(([c, n]) => (
                    <span key={c} className={n > 0 ? 'ok' : 'no'}>{c}: <b>{n > 0 ? `${n} шт` : 'нет'}</b></span>
                  ))}
                </div>
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
                  onClick={() => addItem(part, qty)}
                >
                  {inCart ? `В корзине (${cartQty})` : 'Добавить в корзину'}
                </Btn>
              </div>

              <div className="pdp-secondary">
                <button><Ico name="list" size={14} /> В список запроса</button>
                <button><Ico name="pdf" size={14} /> Скачать счёт-фактуру (PDF)</button>
                <button><Ico name="chat" size={14} /> Опт от 10 шт — запросить цену</button>
              </div>

              <div className="pdp-delivery">
                <div className="pdp-del-row">
                  <Ico name="pin" size={14} />
                  <div><b>Самовывоз — сегодня</b><span>ул. Райымбека 348А, Алматы · после 14:00</span></div>
                </div>
                <div className="pdp-del-row">
                  <Ico name="truck" size={14} />
                  <div><b>Доставка по Алматы — завтра</b><span>2 500 ₸ · бесплатно от 30 000 ₸</span></div>
                </div>
                <div className="pdp-del-row">
                  <Ico name="bolt" size={14} />
                  <div><b>Курьером в регион — 2–4 дня</b><span>СДЭК · ПЭК · Энергия — расчёт автоматически</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Side */}
          <aside className="pdp-side">
            <div className="pdp-side-card pdp-side-trust">
              <Ico name="info" size={14} />
              <div>
                <b>OEM с гарантией</b>
                <span>Поставщик подтверждён заводом. Возврат 14 дней, гарантия 6 месяцев.</span>
              </div>
            </div>
            <div className="pdp-side-card">
              <h4>Запросить счёт для оплаты</h4>
              <p>Сформируем счёт на оплату в течение 5 минут. Оплата по реквизитам, отгрузка после поступления.</p>
              <Btn variant="dark" full icon="pdf">Сформировать счёт</Btn>
              <a href="#" className="pdp-side-link">или загрузить договор поставки →</a>
            </div>
            <div className="pdp-side-card">
              <h4>Связаться</h4>
              <div className="pdp-side-contact">
                <button><Ico name="phone" size={14} /> +7 (727) 350-22-22</button>
                <button><Ico name="chat" size={14} /> WhatsApp · Telegram</button>
              </div>
              <p className="pdp-side-sla">Менеджер по парку KAMAZ: <b>Айбек Тулегенов</b> · ответ в течение 12 мин</p>
            </div>
          </aside>
        </div>

        {/* Tabs */}
        <div className="pdp-tabs">
          {tabs.map(([id, label]) => (
            <button key={id} className={tab === id ? 'on' : ''} onClick={() => setTab(id)}>{label}</button>
          ))}
        </div>

        <div className="pdp-tab-body">
          {tab === 'specs' && (
            <div className="pdp-specs">
              <h3>Технические характеристики</h3>
              <table><tbody>
                {Object.entries(part.specs).map(([k, v]) => (
                  <tr key={k}><th>{k}</th><td>{v}</td></tr>
                ))}
                <tr><th>Гарантия</th><td>6 месяцев / 60 000 км</td></tr>
                <tr><th>Страна производства</th><td>{part.type === 'OEM' ? 'Россия' : 'Германия'}</td></tr>
                <tr><th>Срок поставки под заказ</th><td>3–5 рабочих дней</td></tr>
              </tbody></table>
            </div>
          )}
          {tab === 'compat' && (
            <div className="pdp-compat">
              <h3>Список совместимой техники</h3>
              <div className="compat-grid">
                {[...part.fits.map((f) => ({ name: f, years: '2015–2024', engine: 'КАМАЗ 740.30' })),
                  { name: 'KAMAZ 6522', years: '2017–2024', engine: 'КАМАЗ 740.62' }
                ].map((v, i) => (
                  <div key={i} className="compat-row">
                    <Ico name="truck" size={20} />
                    <div className="compat-name">{v.name}</div>
                    <div className="compat-years">{v.years}</div>
                    <div className="compat-engine">{v.engine}</div>
                    <button>Перейти →</button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab === 'cross' && (
            <div className="pdp-cross-tab">
              <h3>Кросс-номера и аналоги</h3>
              <table>
                <thead><tr><th>Производитель</th><th>Артикул</th><th>Тип</th><th>Цена</th><th /></tr></thead>
                <tbody>
                  {part.cross.map((c, i) => (
                    <tr key={c}>
                      <td>{['Bosch', 'MANN-FILTER', 'Sakura', 'Donaldson'][i % 4]}</td>
                      <td><b className="mono">{c}</b></td>
                      <td>{i === 0 ? 'OEM' : 'Аналог'}</td>
                      <td>{fmtKZT(part.price - i * 4000)}</td>
                      <td><button className="link">К товару →</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {tab === 'reviews' && (
            <div className="pdp-reviews">
              <h3>Отзывы покупателей</h3>
              {[
                { name: 'Ержан К.', co: 'ТОО «АлматыСпецТранс»', rating: 5, text: 'Брали 12 штук на парк КАМАЗ — отгрузка день в день, документы по 1С пришли автоматически. Турбина стоит уже 4 месяца, нареканий нет.' },
                { name: 'Мехмат СТО', co: 'СТО, Шымкент', rating: 4, text: 'Хороший аналог за свои деньги. Один экземпляр пришёл с дефектом резьбы — заменили без вопросов за 3 дня.' },
                { name: 'Сергей В.', co: 'ИП, Астана', rating: 5, text: 'Цена ниже рынка на 8%, гарантия настоящая. Менеджер сам подобрал по VIN.' },
              ].map((r, i) => (
                <div key={i} className="rev-card">
                  <div className="rev-head">
                    <div className="rev-avatar">{r.name[0]}</div>
                    <div>
                      <div className="rev-name">{r.name} <span>· {r.co}</span></div>
                      <div className="rev-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)} · подтверждённая покупка</div>
                    </div>
                  </div>
                  <p>{r.text}</p>
                </div>
              ))}
            </div>
          )}
          {tab === 'qa' && (
            <div className="pdp-qa">
              <h3>Вопросы и ответы</h3>
              <div className="qa-card">
                <b>Q: Подойдёт ли эта турбина на КАМАЗ 65115 после 2020 г.?</b>
                <p>A: Да, для модификаций с двигателем 740.62/740.63 подходит без доработок.</p>
              </div>
              <div className="qa-card">
                <b>Q: Возможна ли отгрузка с НДС в Узбекистан?</b>
                <p>A: Да, отгружаем по контракту с возвратом НДС. Срок — 4 дня от Алматы до Ташкента.</p>
              </div>
              <button className="qa-ask">Задать вопрос →</button>
            </div>
          )}
          {tab === 'docs' && (
            <div className="pdp-docs">
              <h3>Документация</h3>
              <div className="docs-grid">
                {['Сертификат соответствия', 'Паспорт изделия', 'Каталожный лист', 'Инструкция по установке', 'Гарантийный талон'].map((d) => (
                  <button key={d} className="doc-card">
                    <Ico name="pdf" size={20} />
                    <span>{d}</span>
                    <span className="doc-size">PDF · 280 КБ</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <section className="pdp-related">
          <h3>С этим товаром берут</h3>
          <div className="part-grid">
            {related.map((p) => <PartCard key={p.id} part={p} />)}
          </div>
        </section>
      </div>
    </main>
  )
}
