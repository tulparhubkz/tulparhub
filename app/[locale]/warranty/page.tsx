'use client'
import { Link } from '@/i18n/navigation'
import { useT } from '@/lib/i18n'
import { Ico } from '@/components/ui/Ico'

export default function WarrantyPage() {
  const t = useT()
  return (
    <>
      <style jsx global>{`
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
          display: inline-flex;
          color: var(--brand);
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
            <Link href="/">{t('common.home')}</Link>
            {' / '}
            <span>{t('warranty.crumb')}</span>
          </div>
          <h1>{t('warranty.hero.title')}</h1>
          <p>{t('warranty.hero.sub')}</p>
        </div>
      </div>

      <main className="wt-page">

        {/* Гарантийные сроки */}
        <div className="wt-section">
          <h2><span className="icon"><Ico name="shield" size={22} /></span>{t('warranty.terms.title')}</h2>
          <div className="wt-terms">
            <div className="wt-term-card">
              <div className="wt-term-label">{t('warranty.term1.label')}</div>
              <div className="wt-term-val">{t('warranty.term1.val')}</div>
              <div className="wt-term-desc">{t('warranty.term1.desc')}</div>
            </div>
            <div className="wt-term-card">
              <div className="wt-term-label">{t('warranty.term2.label')}</div>
              <div className="wt-term-val">{t('warranty.term2.val')}</div>
              <div className="wt-term-desc">{t('warranty.term2.desc')}</div>
            </div>
          </div>
          <p style={{ marginTop: 18, fontSize: 14, color: 'var(--ink-3)' }}>
            {t('warranty.terms.note')}
          </p>
        </div>

        {/* Возврат неиспользованного товара */}
        <div className="wt-section">
          <h2><span className="icon"><Ico name="undo" size={22} /></span>{t('warranty.return.title')}</h2>
          <p>{t('warranty.return.p1pre')}<strong>{t('warranty.return.p1bold')}</strong>{t('warranty.return.p1post')}</p>
          <ul className="wt-list">
            <li>{t('warranty.return.li1')}</li>
            <li>{t('warranty.return.li2')}</li>
            <li>{t('warranty.return.li3')}</li>
            <li>{t('warranty.return.li4')}</li>
          </ul>
          <p style={{ marginTop: 14 }}>
            {t('warranty.return.p2')}
          </p>
        </div>

        {/* Гарантийное обращение */}
        <div className="wt-section">
          <h2><span className="icon"><Ico name="search" size={22} /></span>{t('warranty.process.title')}</h2>
          <div className="wt-steps">
            <div className="wt-step">
              <div className="wt-step-num">1</div>
              <div className="wt-step-body">
                <h4>{t('warranty.step1.title')}</h4>
                <p>{t('warranty.step1.text')}</p>
              </div>
            </div>
            <div className="wt-step">
              <div className="wt-step-num">2</div>
              <div className="wt-step-body">
                <h4>{t('warranty.step2.title')}</h4>
                <p>{t('warranty.step2.text')}</p>
              </div>
            </div>
            <div className="wt-step">
              <div className="wt-step-num">3</div>
              <div className="wt-step-body">
                <h4>{t('warranty.step3.title')}</h4>
                <p>{t('warranty.step3.text')}</p>
              </div>
            </div>
            <div className="wt-step">
              <div className="wt-step-num">4</div>
              <div className="wt-step-body">
                <h4>{t('warranty.step4.title')}</h4>
                <p>{t('warranty.step4.pre')}<strong>{t('warranty.step4.bold')}</strong>{t('warranty.step4.post')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Что не покрывается */}
        <div className="wt-section">
          <h2><span className="icon"><Ico name="warn" size={22} /></span>{t('warranty.exclude.title')}</h2>
          <div className="wt-exclude">
            <p>{t('warranty.exclude.lead')}</p>
            <ul className="wt-list" style={{ color: '#7a4f1a' }}>
              <li>{t('warranty.exclude.li1')}</li>
              <li>{t('warranty.exclude.li2')}</li>
              <li>{t('warranty.exclude.li3')}</li>
              <li>{t('warranty.exclude.li4')}</li>
              <li>{t('warranty.exclude.li5')}</li>
              <li>{t('warranty.exclude.li6')}</li>
            </ul>
          </div>
        </div>

        {/* FAQ */}
        <div className="wt-section">
          <h2><span className="icon"><Ico name="help" size={22} /></span>{t('warranty.faq.title')}</h2>
          <div className="wt-faq">
            <div className="wt-faq-item">
              <h4>{t('warranty.faq1.q')}</h4>
              <p>{t('warranty.faq1.a')}</p>
            </div>
            <div className="wt-faq-item">
              <h4>{t('warranty.faq2.q')}</h4>
              <p>{t('warranty.faq2.a')}</p>
            </div>
            <div className="wt-faq-item">
              <h4>{t('warranty.faq3.q')}</h4>
              <p>{t('warranty.faq3.a')}</p>
            </div>
            <div className="wt-faq-item">
              <h4>{t('warranty.faq4.q')}</h4>
              <p>{t('warranty.faq4.a')}</p>
            </div>
            <div className="wt-faq-item">
              <h4>{t('warranty.faq5.q')}</h4>
              <p>{t('warranty.faq5.a')}</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="wt-contact">
          <h2>{t('warranty.contact.title')}</h2>
          <p>{t('warranty.contact.sub')}</p>
          <div className="wt-contact-btns">
            <a href="tel:+77000000000" className="wt-btn-white">+7 (700) 000-00-00</a>
            <a href="mailto:info@tulparhub.kz" className="wt-btn-outline">info@tulparhub.kz</a>
          </div>
        </div>

        <p className="wt-meta">
          {t('warranty.meta')}
        </p>

      </main>
    </>
  )
}
