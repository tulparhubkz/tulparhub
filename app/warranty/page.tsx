'use client'
import Link from 'next/link'

export default function WarrantyPage() {
  return (
    <>
      <style>{`
        .wt-hero {
          background: var(--surf-2);
          color: var(--ink);
          padding: 52px 0;
          margin-bottom: 48px;
          border-bottom: 1px solid var(--line);
        }
        .wt-hero-inner {
          max-width: 860px;
          margin: 0 auto;
          padding: 0 20px;
        }
        .wt-hero h1 {
          font-size: 34px;
          font-weight: 800;
          margin-bottom: 12px;
        }
        .wt-hero p {
          font-size: 16px;
          color: var(--ink-2);
          line-height: 1.6;
        }

        .wt-page {
          max-width: 860px;
          margin: 0 auto;
          padding: 0 20px 80px;
        }

        .wt-section {
          background: var(--surf);
          border: 1px solid var(--line);
          border-radius: var(--radius-lg);
          padding: 32px 36px;
          margin-bottom: 20px;
        }
        .wt-section h2 {
          font-size: 19px;
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .wt-section h2 .icon {
          font-size: 22px;
          line-height: 1;
        }
        .wt-section p {
          font-size: 15px;
          color: var(--ink-2);
          line-height: 1.7;
          margin-bottom: 12px;
        }
        .wt-section p:last-child { margin-bottom: 0; }

        .wt-terms {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-top: 6px;
        }
        .wt-term-card {
          background: var(--surf-2);
          border: 1px solid var(--line);
          border-radius: var(--radius);
          padding: 20px 22px;
        }
        .wt-term-card .wt-term-label {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .06em;
          color: var(--ink-3);
          margin-bottom: 6px;
        }
        .wt-term-card .wt-term-val {
          font-size: 26px;
          font-weight: 800;
          color: var(--accent);
          margin-bottom: 4px;
        }
        .wt-term-card .wt-term-desc {
          font-size: 13px;
          color: var(--ink-2);
          line-height: 1.5;
        }

        .wt-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .wt-list li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 15px;
          color: var(--ink-2);
          line-height: 1.55;
        }
        .wt-list li::before {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
          flex-shrink: 0;
          margin-top: 8px;
        }

        .wt-steps {
          display: flex;
          flex-direction: column;
          gap: 0;
          margin-top: 6px;
        }
        .wt-step {
          display: flex;
          gap: 18px;
          padding: 16px 0;
          border-bottom: 1px solid var(--line);
        }
        .wt-step:last-child { border-bottom: none; }
        .wt-step-num {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--accent);
          color: #fff;
          font-size: 14px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .wt-step-body h4 {
          font-size: 15px;
          font-weight: 700;
          color: var(--ink);
          margin-bottom: 4px;
        }
        .wt-step-body p {
          font-size: 14px;
          color: var(--ink-2);
          line-height: 1.55;
          margin: 0;
        }

        .wt-faq {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-top: 6px;
        }
        .wt-faq-item {
          border: 1px solid var(--line);
          border-radius: var(--radius);
          padding: 18px 22px;
        }
        .wt-faq-item h4 {
          font-size: 15px;
          font-weight: 700;
          color: var(--ink);
          margin-bottom: 8px;
        }
        .wt-faq-item p {
          font-size: 14px;
          color: var(--ink-2);
          line-height: 1.6;
          margin: 0;
        }

        .wt-exclude {
          background: #fff8f0;
          border: 1px solid #fde8c8;
          border-radius: var(--radius);
          padding: 20px 24px;
          margin-top: 6px;
        }
        .wt-exclude p {
          font-size: 14px;
          color: #7a4f1a;
          line-height: 1.6;
          margin: 0 0 8px;
        }
        .wt-exclude p:last-child { margin: 0; }

        .wt-contact {
          background: var(--surf-2);
          border: 1.5px solid var(--line);
          border-radius: var(--radius-lg);
          padding: 36px;
          text-align: center;
          color: var(--ink);
          margin-top: 32px;
        }
        .wt-contact h2 {
          font-size: 22px;
          font-weight: 800;
          margin-bottom: 8px;
          color: var(--ink);
        }
        .wt-contact p {
          font-size: 15px;
          color: var(--ink-2);
          margin-bottom: 20px;
        }
        .wt-contact-btns {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .wt-contact-btns a {
          padding: 12px 28px;
          border-radius: 9px;
          font-size: 15px;
          font-weight: 700;
          text-decoration: none;
          transition: .15s;
        }
        .wt-btn-white { background: var(--accent); color: #fff; }
        .wt-btn-white:hover { background: var(--accent-deep); }
        .wt-btn-outline {
          background: var(--surf);
          color: var(--ink);
          border: 1.5px solid var(--line-2);
        }
        .wt-btn-outline:hover { background: var(--surf-2); border-color: var(--ink); }

        .wt-meta {
          font-size: 13px;
          color: var(--ink-3);
          margin-top: 28px;
          padding-top: 20px;
          border-top: 1px solid var(--line);
          line-height: 1.6;
        }

        @media (max-width: 640px) {
          .wt-section { padding: 22px 18px; }
          .wt-terms { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Hero */}
      <div className="wt-hero">
        <div className="wt-hero-inner">
          <div className="crumbs" style={{ marginBottom: 20, fontSize: 13 }}>
            <Link href="/">Главная</Link>
            {' / '}
            <span>Гарантия и возврат</span>
          </div>
          <h1>Гарантия и возврат товаров</h1>
          <p>TulparHub уверен в качестве продаваемых запасных частей. Мы предоставляем гарантию на весь ассортимент и стремимся сделать процесс возврата максимально простым и прозрачным.</p>
        </div>
      </div>

      <main className="wt-page">

        {/* Гарантийные сроки */}
        <div className="wt-section">
          <h2><span className="icon">🛡️</span>Гарантийные сроки</h2>
          <div className="wt-terms">
            <div className="wt-term-card">
              <div className="wt-term-label">Стандартная гарантия</div>
              <div className="wt-term-val">12 месяцев</div>
              <div className="wt-term-desc">На все запасные части без ограничения пробега</div>
            </div>
            <div className="wt-term-card">
              <div className="wt-term-label">Расширенная гарантия</div>
              <div className="wt-term-val">36 месяцев</div>
              <div className="wt-term-desc">На запчасти FEBI без ограничения пробега</div>
            </div>
          </div>
          <p style={{ marginTop: 18, fontSize: 14, color: 'var(--ink-3)' }}>
            Гарантийный срок отсчитывается с момента покупки согласно дате в товарной накладной или чеке.
          </p>
        </div>

        {/* Возврат неиспользованного товара */}
        <div className="wt-section">
          <h2><span className="icon">↩️</span>Возврат неиспользованного товара</h2>
          <p>Вы вправе вернуть неустановленную запчасть в течение <strong>14 календарных дней</strong> с даты покупки при соблюдении следующих условий:</p>
          <ul className="wt-list">
            <li>Товар не был установлен и не имеет следов использования</li>
            <li>Сохранены оригинальная упаковка и маркировка производителя</li>
            <li>Имеется документ, подтверждающий покупку (чек, накладная, электронный заказ)</li>
            <li>Товар не входит в перечень не подлежащих возврату согласно законодательству РК</li>
          </ul>
          <p style={{ marginTop: 14 }}>
            Возврат осуществляется на склад в Алматы или через службу доставки. Стоимость обратной доставки при не выявленном дефекте оплачивает покупатель.
          </p>
        </div>

        {/* Гарантийное обращение */}
        <div className="wt-section">
          <h2><span className="icon">🔍</span>Порядок гарантийного обращения</h2>
          <div className="wt-steps">
            <div className="wt-step">
              <div className="wt-step-num">1</div>
              <div className="wt-step-body">
                <h4>Свяжитесь с нами</h4>
                <p>Позвоните по номеру +7 (700) 000-00-00 или напишите на info@tulparhub.kz. Опишите дефект и укажите номер заказа.</p>
              </div>
            </div>
            <div className="wt-step">
              <div className="wt-step-num">2</div>
              <div className="wt-step-body">
                <h4>Подготовьте документы</h4>
                <p>Подтверждение покупки (чек / накладная), акт дефектовки от СТО или заказ-наряд на установку, фото или видео дефекта.</p>
              </div>
            </div>
            <div className="wt-step">
              <div className="wt-step-num">3</div>
              <div className="wt-step-body">
                <h4>Заполните акт рекламации</h4>
                <p>Менеджер пришлёт бланк акта. Подробно опишите обстоятельства обнаружения дефекта и условия эксплуатации.</p>
              </div>
            </div>
            <div className="wt-step">
              <div className="wt-step-num">4</div>
              <div className="wt-step-body">
                <h4>Ожидайте решения</h4>
                <p>Срок рассмотрения рекламации — до <strong>21 рабочего дня</strong>. При необходимости дополнительной экспертизы мы уведомим вас заранее. По итогу — замена товара, ремонт или возврат средств.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Что не покрывается */}
        <div className="wt-section">
          <h2><span className="icon">⚠️</span>Что не покрывается гарантией</h2>
          <div className="wt-exclude">
            <p>Гарантийные обязательства не распространяются на следующие случаи:</p>
            <ul className="wt-list" style={{ color: '#7a4f1a' }}>
              <li>Повреждения в результате ДТП, внешнего механического воздействия или неправильной эксплуатации</li>
              <li>Естественный износ расходных материалов (фильтры, тормозные колодки, накладки сцепления и т.д.)</li>
              <li>Нарушение правил монтажа, указанных производителем</li>
              <li>Использование детали не по назначению или в условиях, превышающих допустимые нагрузки</li>
              <li>Самостоятельное вмешательство в конструкцию детали</li>
              <li>Товары с нарушенной маркировкой или следами вскрытия упаковки без уведомления TulparHub</li>
            </ul>
          </div>
        </div>

        {/* FAQ */}
        <div className="wt-section">
          <h2><span className="icon">❓</span>Часто задаваемые вопросы</h2>
          <div className="wt-faq">
            <div className="wt-faq-item">
              <h4>Я установил запчасть самостоятельно — сохраняется ли гарантия?</h4>
              <p>Да, самостоятельная установка не является автоматическим основанием для отказа в гарантии. Важно зафиксировать процесс установки (фото/видео) и указать это в акте рекламации. Если установка произведена с нарушением технологии производителя, в гарантии может быть отказано.</p>
            </div>
            <div className="wt-faq-item">
              <h4>Как быстро рассматривается рекламация?</h4>
              <p>Стандартный срок — 21 рабочий день с момента получения полного пакета документов. По несложным случаям стараемся решить быстрее. Если нужна дополнительная экспертиза производителя — срок может быть увеличен, о чём мы уведомим вас письменно.</p>
            </div>
            <div className="wt-faq-item">
              <h4>Какие документы нужны для электронных компонентов?</h4>
              <p>Для электрики и электроники дополнительно потребуется протокол компьютерной диагностики с кодами ошибок от сертифицированного СТО. Это позволяет точно определить причину неисправности.</p>
            </div>
            <div className="wt-faq-item">
              <h4>Что происходит после признания случая гарантийным?</h4>
              <p>По вашему выбору: замена на аналогичный товар, устранение дефекта, или возврат денежных средств. Срок возврата средств — до 10 рабочих дней после принятия решения.</p>
            </div>
            <div className="wt-faq-item">
              <h4>Как вернуть товар из другого города?</h4>
              <p>Отправьте посылку транспортной компанией (СДЭК, Казпочта) на наш склад в Алматы. Реквизиты для отправки предоставит менеджер. При подтверждённом гарантийном случае стоимость доставки компенсируется.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="wt-contact">
          <h2>Остались вопросы?</h2>
          <p>Свяжитесь с нашим менеджером — поможем разобраться с гарантийным случаем</p>
          <div className="wt-contact-btns">
            <a href="tel:+77000000000" className="wt-btn-white">+7 (700) 000-00-00</a>
            <a href="mailto:info@tulparhub.kz" className="wt-btn-outline">info@tulparhub.kz</a>
          </div>
        </div>

        <p className="wt-meta">
          Гарантийная политика TulparHub действует с 2026 года. ТОО «TulparHub», Алматы, Казахстан.
          Возврат и обмен осуществляется в соответствии с Законом РК «О защите прав потребителей».
        </p>

      </main>
    </>
  )
}
