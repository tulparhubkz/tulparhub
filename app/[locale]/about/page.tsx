'use client'
import { Link } from '@/i18n/navigation'
import { useT } from '@/lib/i18n'
import { Ico } from '@/components/ui/Ico'

export default function AboutPage() {
  const t = useT()
  return (
    <>
      <style jsx global>{`
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
          color: var(--ink-3);
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
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ab-client h4 svg { color: var(--brand); flex: none; }
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
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .ab-pay-chip svg { color: var(--brand); flex: none; }

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
            <h1>{t('about.hero.titlePre')} <span>TulparHub</span></h1>
            <p><strong>{t('about.hero.lead')}</strong></p>
            <p>{t('about.hero.p1')}</p>
            <ul>
              <li>{t('about.hero.li1')}</li>
              <li>{t('about.hero.li2')}</li>
              <li>{t('about.hero.li3')}</li>
              <li>{t('about.hero.li4')}</li>
              <li>{t('about.hero.li5')}</li>
            </ul>
          </div>
          <div className="ab-truck-img"><Ico name="truck" size={128} stroke={1.25} /></div>
        </div>
      </div>

      <main className="ab-page">

        {/* Crumbs */}
        <div className="crumbs" style={{ marginBottom: 32 }}>
          <Link href="/">{t('common.home')}</Link> / <span>{t('about.crumb')}</span>
        </div>

        {/* Stats */}
        <div className="ab-stats">
          <div className="ab-stat">
            <div className="ab-stat-num">20 000+</div>
            <div className="ab-stat-lbl">{t('about.stat1')}</div>
          </div>
          <div className="ab-stat">
            <div className="ab-stat-num">300+</div>
            <div className="ab-stat-lbl">{t('about.stat2')}</div>
          </div>
          <div className="ab-stat">
            <div className="ab-stat-num">24/7</div>
            <div className="ab-stat-lbl">{t('about.stat3')}</div>
          </div>
          <div className="ab-stat">
            <div className="ab-stat-num">16+</div>
            <div className="ab-stat-lbl">{t('about.stat4')}</div>
          </div>
        </div>

        {/* Преимущества */}
        <div className="ab-section">
          <h2>{t('about.why.title')}</h2>
          <div className="ab-features">
            <div className="ab-feature">
              <div className="ab-feature-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              </div>
              <h3>{t('about.f1.title')}</h3>
              <p>{t('about.f1.text')}</p>
            </div>
            <div className="ab-feature">
              <div className="ab-feature-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              </div>
              <h3>{t('about.f2.title')}</h3>
              <p>{t('about.f2.text')}</p>
            </div>
            <div className="ab-feature">
              <div className="ab-feature-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h3>{t('about.f3.title')}</h3>
              <p>{t('about.f3.text')}</p>
            </div>
            <div className="ab-feature">
              <div className="ab-feature-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              </div>
              <h3>{t('about.f4.title')}</h3>
              <p>{t('about.f4.text')}</p>
            </div>
            <div className="ab-feature">
              <div className="ab-feature-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <h3>{t('about.f5.title')}</h3>
              <p>{t('about.f5.text')}</p>
            </div>
            <div className="ab-feature">
              <div className="ab-feature-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              </div>
              <h3>{t('about.f6.title')}</h3>
              <p>{t('about.f6.text')}</p>
            </div>
          </div>
        </div>

        {/* Кому подходим */}
        <div className="ab-section">
          <h2>{t('about.clients.title')}</h2>
          <div className="ab-clients">
            <div className="ab-client">
              <h4><Ico name="truck" size={18} /> {t('about.client1.title')}</h4>
              <p>{t('about.client1.text')}</p>
            </div>
            <div className="ab-client">
              <h4><Ico name="wrench" size={18} /> {t('about.client2.title')}</h4>
              <p>{t('about.client2.text')}</p>
            </div>
            <div className="ab-client">
              <h4><Ico name="crane" size={18} /> {t('about.client3.title')}</h4>
              <p>{t('about.client3.text')}</p>
            </div>
          </div>
        </div>

        {/* Доставка и оплата */}
        <div className="ab-delivery">
          <div className="ab-del-item">
            <div className="ab-del-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div className="ab-del-title">{t('about.d1.title')}</div>
            <div className="ab-del-text">{t('about.d1.text')}</div>
          </div>
          <div className="ab-del-item">
            <div className="ab-del-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            </div>
            <div className="ab-del-title">{t('about.d2.title')}</div>
            <div className="ab-del-text">{t('about.d2.text')}</div>
          </div>
          <div className="ab-del-item">
            <div className="ab-del-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div className="ab-del-title">{t('about.d3.title')}</div>
            <div className="ab-del-text">{t('about.d3.text')}</div>
          </div>
          <div className="ab-del-item">
            <div className="ab-del-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            </div>
            <div className="ab-del-title">{t('about.d4.title')}</div>
            <div className="ab-del-text">{t('about.d4.text')}</div>
          </div>
        </div>

        {/* Оплата */}
        <div className="ab-section">
          <h2>{t('about.pay.title')}</h2>
          <p style={{ color: 'var(--ink-2)', marginBottom: 16, fontSize: 15 }}>{t('about.pay.sub')}</p>
          <div className="ab-pay">
            <div className="ab-pay-chip"><Ico name="card" size={18} /> {t('about.pay.kaspi')}</div>
            <div className="ab-pay-chip"><Ico name="bank" size={18} /> {t('about.pay.bank')}</div>
            <div className="ab-pay-chip"><Ico name="cash" size={18} /> {t('about.pay.cash')}</div>
            <div className="ab-pay-chip"><Ico name="qr" size={18} /> {t('about.pay.qr')}</div>
            <div className="ab-pay-chip"><Ico name="handshake" size={18} /> {t('about.pay.installment')}</div>
          </div>
        </div>

        {/* CTA */}
        <div className="ab-cta">
          <h2>{t('about.cta.title')}</h2>
          <p>{t('about.cta.sub')}</p>
          <div className="ab-cta-btns">
            <Link href="/catalog" className="ab-btn-white">{t('about.cta.catalog')}</Link>
            <a href="tel:+77000000000" className="ab-btn-outline">+7 (700) 000-00-00</a>
          </div>
        </div>

      </main>
    </>
  )
}
