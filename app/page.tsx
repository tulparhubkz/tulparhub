import Link from 'next/link'
import { Ico } from '@/components/ui/Ico'
import { Btn } from '@/components/ui/Btn'
import { Badge } from '@/components/ui/Badge'
import { Placeholder } from '@/components/ui/Placeholder'
import { SysGlyph } from '@/components/ui/SysGlyph'
import { VehicleSelector } from '@/components/ui/VehicleSelector'
import { PartCard } from '@/components/catalog/PartCard'
import { equipmentTypes, systems, parts, brands } from '@/lib/data'

function EquipIcon({ kind, size = 56 }: { kind: string; size?: number }) {
  const nameMap: Record<string, string> = {
    truck: 'truck', excavator: 'excavator', loader: 'loader', dozer: 'dozer',
    crane: 'crane', mixer: 'mixer', dump: 'dump', grader: 'grader', roller: 'roller',
  }
  return (
    <div style={{ width: size, height: size, display: 'grid', placeItems: 'center', color: 'var(--ink)' }}>
      <Ico name={nameMap[kind] ?? 'truck'} size={size} stroke={1.2} />
    </div>
  )
}

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
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
              84&nbsp;000 артикулов на складах в Алматы, Астане и Ташкенте. KAMAZ, CAT, Komatsu, Shacman, MAZ. OEM и аналоги — с гарантией от 6 месяцев.
            </p>
            <div className="hero-stats">
              <div><b>3 ч.</b><span>средняя отгрузка<br />со склада Алматы</span></div>
              <div><b>1С</b><span>автоматический<br />обмен счетами</span></div>
              <div><b>24/7</b><span>срочные<br />заявки</span></div>
            </div>
            <div className="hero-cta">
              <Link href="/podbor">
                <Btn variant="dark" size="lg" iconRight="arrow">Перейти в каталог</Btn>
              </Link>
              <Link href="/rental">
                <Btn variant="ghost" size="lg" icon="cal">Аренда спецтехники</Btn>
              </Link>
            </div>
          </div>

          <div className="hero-selector">
            <div className="hs-tag">
              <Ico name="car" size={14} />
              <span>Подбор по технике</span>
              <span className="hs-tag-fast">быстрее</span>
            </div>
            <VehicleSelector compact />
            <div className="hs-alt">
              <div className="hs-alt-row">
                <span className="hs-alt-icon"><Ico name="vin" size={14} /></span>
                <input placeholder="VIN-номер: XTC65115…" />
                <button type="button">Расшифровать</button>
              </div>
              <div className="hs-alt-row">
                <span className="hs-alt-icon"><Ico name="barcode" size={14} /></span>
                <input placeholder="OEM-номер: 740.1118010-02" />
                <button type="button">Найти</button>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-marquee">
          <div className="container hm-row">
            {[
              'Гарантия 6 мес. на OEM',
              'Возврат 14 дней',
              'Безнал · Kaspi QR · рассрочка 0-0-12',
              'Счёт-фактура за 5 минут',
              'Прямая интеграция с 1С: Бухгалтерия',
            ].map((text) => (
              <span key={text} className="hm-item">
                <Ico name="check" size={12} /> {text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Type tiles */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 className="section-title">Что подбираем</h2>
              <p className="section-sub">Каталог покрывает 9 классов техники — от тягачей до дорожных катков.</p>
            </div>
            <Link href="/podbor" className="section-more">Все типы техники <Ico name="arrow" size={14} /></Link>
          </div>
          <div className="type-tiles">
            {equipmentTypes.map((t) => (
              <Link key={t.id} href={`/podbor?type=${t.id}`} className="type-tile" style={{ textDecoration: 'none' }}>
                <div className="type-tile-icon"><EquipIcon kind={t.id} size={48} /></div>
                <div className="type-tile-meta">
                  <div className="type-tile-name">{t.ru}</div>
                  <div className="type-tile-count">{t.count.toLocaleString('ru-RU')} артикулов</div>
                </div>
                <div className="type-tile-arrow"><Ico name="chevron" size={14} /></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular categories */}
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

      {/* Featured parts */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 className="section-title">Часто заказывают на этой неделе</h2>
              <p className="section-sub">По данным заказов парков КАМАЗ, MAZ, Shacman в Алматы и Астане.</p>
            </div>
            <Link href="/catalog" className="section-more">Все хиты продаж <Ico name="arrow" size={14} /></Link>
          </div>
          <div className="part-grid">
            {parts.slice(0, 4).map((p) => <PartCard key={p.id} part={p} />)}
          </div>
        </div>
      </section>

      {/* Rental CTA */}
      <section className="section rental-cta">
        <div className="container rcta-grid">
          <div className="rcta-copy">
            <div className="rcta-eyebrow"><span className="eyebrow-dot" /> Аренда спецтехники</div>
            <h2 className="rcta-title">Техника на ваш объект — за 4 часа</h2>
            <p className="rcta-sub">Экскаваторы, погрузчики, самосвалы, краны и катки с оператором или без. Прозрачные тарифы за смену, день, неделю, месяц.</p>
            <ul className="rcta-list">
              <li><Ico name="check" size={14} /> Доставка тралом в черте города — бесплатно</li>
              <li><Ico name="check" size={14} /> Договор и закрывающие документы по 1С</li>
              <li><Ico name="check" size={14} /> Парк 240+ единиц — Алматы, Астана, Шымкент</li>
            </ul>
            <div className="rcta-actions">
              <Link href="/rental">
                <Btn variant="primary" size="lg" iconRight="arrow">Подобрать технику</Btn>
              </Link>
              <Btn variant="ghost" size="lg" icon="phone">+7 (727) 350-22-22</Btn>
            </div>
          </div>
          <div className="rcta-vis">
            <div className="rcta-card">
              <div className="rcta-chip">240+ единиц онлайн</div>
              <Placeholder label="excavator on site" ratio="5/4" tone="dark" />
              <div className="rcta-card-row">
                <div><div className="rcta-num">75 000 ₸</div><div className="rcta-lbl">смена 8 ч</div></div>
                <div><div className="rcta-num">95 000 ₸</div><div className="rcta-lbl">сутки</div></div>
                <div><div className="rcta-num">1.8 М ₸</div><div className="rcta-lbl">месяц</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 className="section-title">Работаем с производителями</h2>
              <p className="section-sub">Прямые поставки от заводов и официальных дистрибьюторов.</p>
            </div>
          </div>
          <div className="brands">
            {brands.map((b) => (
              <div key={b.id} className="brand-card">
                <div className="brand-name">{b.name}</div>
                <div className="brand-meta">
                  <span className="brand-country">{b.country}</span>
                  <span className="brand-count">{b.models} моделей</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Knowledge base */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 className="section-title">База знаний</h2>
              <p className="section-sub">Технические разборы для механиков и снабженцев. Без воды.</p>
            </div>
            <a href="#" className="section-more">Все статьи <Ico name="arrow" size={14} /></a>
          </div>
          <div className="kb-grid">
            {[
              { tag: 'Двигатель', title: 'Как выбрать турбокомпрессор для КАМАЗ 740: ТКР-7Н vs ТКР-9', read: '6 мин' },
              { tag: 'Гидравлика', title: 'Замена РВД на CAT 320: какие фитинги подходят и где экономить', read: '8 мин' },
              { tag: 'Снабжение', title: 'Безналичная закупка через тендер: пакет документов и сроки', read: '4 мин' },
            ].map((a, i) => (
              <a key={i} href="#" className="kb-card">
                <div className="kb-tag">{a.tag}</div>
                <div className="kb-title">{a.title}</div>
                <div className="kb-meta"><span>{a.read} чтения</span><Ico name="arrow" size={14} /></div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
