'use client'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <>
      <style>{`
        .ab-hero {
          background: var(--surf-2);
          color: var(--ink);
          padding: 60px 0;
          margin-bottom: 56px;
          border-bottom: 1px solid var(--line);
        }
        .ab-hero-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 48px;
          align-items: center;
        }
        .ab-hero h1 {
          font-size: 38px;
          font-weight: 800;
          margin-bottom: 18px;
          line-height: 1.15;
        }
        .ab-hero h1 span { color: var(--accent); }
        .ab-hero p {
          font-size: 16px;
          line-height: 1.7;
          color: var(--ink-2);
          margin-bottom: 12px;
        }
        .ab-hero ul {
          list-style: none;
          padding: 0;
          margin: 18px 0 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .ab-hero ul li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 15px;
          color: var(--ink-2);
          line-height: 1.5;
        }
        .ab-hero ul li::before {
          content: '';
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--accent);
          flex-shrink: 0;
          margin-top: 7px;
        }
        .ab-truck-img {
          background: var(--surf);
          border: 1.5px solid var(--line);
          border-radius: 18px;
          height: 280px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 120px;
        }
        .ab-page { max-width: 1200px; margin: 0 auto; padding: 0 20px 80px; }

        .ab-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 56px;
        }
        .ab-stat {
          background: var(--surf);
          border: 1px solid var(--line);
          border-radius: var(--radius-lg);
          padding: 28px 24px;
          text-align: center;
        }
        .ab-stat-num {
          font-size: 36px;
          font-weight: 800;
          color: var(--accent);
          letter-spacing: -.02em;
          line-height: 1;
          margin-bottom: 8px;
        }
        .ab-stat-lbl {
          font-size: 14px;
          color: var(--ink-2);
          line-height: 1.4;
        }

        .ab-features {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 56px;
        }
        .ab-feature {
          background: var(--surf);
          border: 1px solid var(--line);
          border-radius: var(--radius-lg);
          padding: 28px 24px;
        }
        .ab-feature-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: var(--accent-soft);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          color: var(--accent);
        }
        .ab-feature h3 {
          font-size: 16px;
          font-weight: 700;
          color: var(--ink);
          margin-bottom: 8px;
        }
        .ab-feature p {
          font-size: 14px;
          color: var(--ink-2);
          line-height: 1.6;
        }

        .ab-section {
          margin-bottom: 52px;
        }
        .ab-section h2 {
          font-size: 24px;
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 20px;
          padding-bottom: 14px;
          border-bottom: 2px solid var(--accent);
          display: inline-block;
        }

        .ab-clients {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .ab-client {
          background: var(--surf);
          border: 1px solid var(--line);
          border-radius: var(--radius-lg);
          padding: 24px;
        }
        .ab-client h4 {
          font-size: 15px;
          font-weight: 700;
          color: var(--ink);
          margin-bottom: 8px;
        }
        .ab-client p {
          font-size: 14px;
          color: var(--ink-2);
          line-height: 1.6;
        }

        .ab-delivery {
          background: var(--surf-2);
          border: 1.5px solid var(--line);
          border-radius: var(--radius-lg);
          padding: 40px 48px;
          color: var(--ink);
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          gap: 32px;
          margin-bottom: 56px;
        }
        .ab-del-item { display: flex; flex-direction: column; gap: 10px; }
        .ab-del-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: var(--accent-soft);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
        }
        .ab-del-title { font-size: 15px; font-weight: 700; color: var(--ink); }
        .ab-del-text { font-size: 13px; color: var(--ink-2); line-height: 1.5; }

        .ab-pay {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          margin-top: 16px;
        }
        .ab-pay-chip {
          background: var(--surf);
          border: 1.5px solid var(--line);
          border-radius: 9px;
          padding: 10px 20px;
          font-size: 15px;
          font-weight: 700;
          color: var(--ink);
        }

        .ab-cta {
          background: var(--surf-2);
          border: 1.5px solid var(--line);
          border-radius: var(--radius-lg);
          padding: 48px;
          text-align: center;
          color: var(--ink);
        }
        .ab-cta h2 {
          font-size: 28px;
          font-weight: 800;
          margin-bottom: 12px;
          color: var(--ink);
        }
        .ab-cta p {
          font-size: 16px;
          color: var(--ink-2);
          margin-bottom: 28px;
        }
        .ab-cta-btns {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .ab-cta-btns a {
          padding: 14px 32px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 700;
          text-decoration: none;
          transition: .15s;
        }
        .ab-btn-white {
          background: var(--accent);
          color: #fff;
        }
        .ab-btn-white:hover { background: var(--accent-deep); }
        .ab-btn-outline {
          background: var(--surf);
          color: var(--ink);
          border: 1.5px solid var(--line-2);
        }
        .ab-btn-outline:hover { background: var(--surf-2); border-color: var(--ink); }

        @media (max-width: 900px) {
          .ab-hero-inner { grid-template-columns: 1fr; }
          .ab-truck-img { display: none; }
          .ab-stats { grid-template-columns: repeat(2,1fr); }
          .ab-features { grid-template-columns: 1fr; }
          .ab-clients { grid-template-columns: 1fr; }
          .ab-delivery { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      {/* Hero */}
      <div className="ab-hero">
        <div className="ab-hero-inner">
          <div>
            <h1>О компании <span>TulparHub</span></h1>
            <p><strong>TulparHub — интернет-магазин запасных частей для грузовых автомобилей и спецтехники в Казахстане.</strong></p>
            <p>Мы работаем с профессиональными клиентами: транспортными компаниями, автосервисами, строительными организациями и оптовыми покупателями. Весь ассортимент — только грузовые запчасти и расходные материалы.</p>
            <ul>
              <li>Запчасти для европейской техники: Volvo, Scania, MAN, DAF, Mercedes-Benz, Iveco</li>
              <li>Запчасти для китайской техники: HOWO, Shacman, FAW, Foton, Dongfeng</li>
              <li>Детали для КАМАЗ, МАЗ и другой техники СНГ</li>
              <li>Более 300 брендов, 20 000+ позиций на складе в Алматы</li>
              <li>Доставка по всему Казахстану и странам СНГ</li>
            </ul>
          </div>
          <div className="ab-truck-img">🚛</div>
        </div>
      </div>

      <main className="ab-page">

        {/* Crumbs */}
        <div className="crumbs" style={{ marginBottom: 32 }}>
          <Link href="/">Главная</Link> / <span>О компании</span>
        </div>

        {/* Stats */}
        <div className="ab-stats">
          <div className="ab-stat">
            <div className="ab-stat-num">20 000+</div>
            <div className="ab-stat-lbl">позиций запчастей на складе в Алматы</div>
          </div>
          <div className="ab-stat">
            <div className="ab-stat-num">300+</div>
            <div className="ab-stat-lbl">брендов запчастей в каталоге</div>
          </div>
          <div className="ab-stat">
            <div className="ab-stat-num">24/7</div>
            <div className="ab-stat-lbl">приём и обработка заказов на сайте</div>
          </div>
          <div className="ab-stat">
            <div className="ab-stat-num">16+</div>
            <div className="ab-stat-lbl">городов Казахстана, куда доставляем</div>
          </div>
        </div>

        {/* Преимущества */}
        <div className="ab-section">
          <h2>Почему выбирают TulparHub</h2>
          <div className="ab-features">
            <div className="ab-feature">
              <div className="ab-feature-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              </div>
              <h3>Только грузовые запчасти</h3>
              <p>Мы не продаём запчасти для легковых автомобилей. Весь фокус — на грузовой и строительной технике. Это позволяет нам держать глубокий ассортимент именно для ваших нужд.</p>
            </div>
            <div className="ab-feature">
              <div className="ab-feature-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              </div>
              <h3>Поиск по VIN и OEM-номеру</h3>
              <p>Введите VIN-код грузовика — система автоматически определит марку и модель и покажет подходящие запчасти. Или ищите напрямую по OEM-артикулу производителя.</p>
            </div>
            <div className="ab-feature">
              <div className="ab-feature-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h3>Гарантия на все товары</h3>
              <p>На каждую запчасть предоставляется гарантия 12 месяцев. Работаем только с проверенными поставщиками и официальными дистрибьюторами брендов.</p>
            </div>
            <div className="ab-feature">
              <div className="ab-feature-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              </div>
              <h3>Доставка по Казахстану и СНГ</h3>
              <p>Доставляем запчасти в Астану, Шымкент, Актобе, Павлодар, Усть-Каменогорск и другие города Казахстана, а также в страны СНГ.</p>
            </div>
            <div className="ab-feature">
              <div className="ab-feature-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <h3>Оптовые условия для бизнеса</h3>
              <p>Специальные цены для транспортных компаний, автосервисов и оптовых покупателей. Работаем с НДС, предоставляем все закрывающие документы.</p>
            </div>
            <div className="ab-feature">
              <div className="ab-feature-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              </div>
              <h3>1С-интеграция для корпоративных клиентов</h3>
              <p>Подключите наш каталог напрямую к вашей учётной системе 1С. Автоматическая синхронизация остатков и цен — без ручного обновления.</p>
            </div>
          </div>
        </div>

        {/* Кому подходим */}
        <div className="ab-section">
          <h2>Кому мы помогаем</h2>
          <div className="ab-clients">
            <div className="ab-client">
              <h4>🚚 Транспортные компании</h4>
              <p>Оптовые поставки запчастей для собственного автопарка. Персональный менеджер, кредитная линия, доставка прямо на базу. Работаем с автопарками от 5 единиц техники.</p>
            </div>
            <div className="ab-client">
              <h4>🔧 Автосервисы и СТО</h4>
              <p>Быстрая доставка под заказ клиента, широкий выбор OEM и аналогов, конкурентные цены. Специальные условия для постоянных партнёров.</p>
            </div>
            <div className="ab-client">
              <h4>🏗️ Строительные и горнодобывающие организации</h4>
              <p>Запчасти для спецтехники: экскаваторы, самосвалы, бульдозеры. Поиск по VIN или модели машины, поставки под заявку.</p>
            </div>
          </div>
        </div>

        {/* Доставка и оплата */}
        <div className="ab-delivery">
          <div className="ab-del-item">
            <div className="ab-del-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div className="ab-del-title">Круглосуточный приём</div>
            <div className="ab-del-text">Заказы на сайте принимаются и обрабатываются 24 часа в сутки, 7 дней в неделю</div>
          </div>
          <div className="ab-del-item">
            <div className="ab-del-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            </div>
            <div className="ab-del-title">Доставка по Казахстану</div>
            <div className="ab-del-text">Отправляем СДЭК, Казпочта, транспортными компаниями во все областные центры</div>
          </div>
          <div className="ab-del-item">
            <div className="ab-del-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div className="ab-del-title">Самовывоз в Алматы</div>
            <div className="ab-del-text">Склад по адресу ул. Райымбека 348А. Можно забрать заказ в удобное время</div>
          </div>
          <div className="ab-del-item">
            <div className="ab-del-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            </div>
            <div className="ab-del-title">Удобная оплата</div>
            <div className="ab-del-text">Kaspi, перевод на расчётный счёт с НДС, наличные при получении, корпоративные условия</div>
          </div>
        </div>

        {/* Оплата */}
        <div className="ab-section">
          <h2>Способы оплаты</h2>
          <p style={{ color: 'var(--ink-2)', marginBottom: 16, fontSize: 15 }}>Принимаем оплату любым удобным для вас способом:</p>
          <div className="ab-pay">
            <div className="ab-pay-chip">💳 Kaspi Pay</div>
            <div className="ab-pay-chip">🏦 Банковский перевод (с НДС)</div>
            <div className="ab-pay-chip">💵 Наличные</div>
            <div className="ab-pay-chip">📱 Kaspi QR</div>
            <div className="ab-pay-chip">🤝 Рассрочка для юрлиц</div>
          </div>
        </div>

        {/* CTA */}
        <div className="ab-cta">
          <h2>Готовы сделать заказ?</h2>
          <p>Найдите нужную запчасть в каталоге или свяжитесь с нами — поможем подобрать деталь по VIN или описанию</p>
          <div className="ab-cta-btns">
            <Link href="/catalog" className="ab-btn-white">Перейти в каталог</Link>
            <a href="tel:+77000000000" className="ab-btn-outline">+7 (700) 000-00-00</a>
          </div>
        </div>

      </main>
    </>
  )
}
