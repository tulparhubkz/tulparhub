'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'

function OrderSuccessInner() {
  const params = useSearchParams()
  const router = useRouter()
  const num    = params.get('num') ?? 'TH-2024-000000'
  const phone  = params.get('phone') ?? ''
  const pay    = params.get('pay') ?? 'invoice'

  const isInvoice = pay === 'invoice'
  const isKaspi   = pay === 'kaspi-qr' || pay === 'kaspi-rs'

  const steps = [
    {
      icon: '✅',
      title: 'Заказ принят',
      desc: `Номер заказа ${num} зафиксирован в системе.`,
      done: true,
    },
    {
      icon: '📞',
      title: 'Звонок менеджера',
      desc: `В течение 15 минут перезвоним на ${phone || 'ваш номер'} для подтверждения.`,
      done: false,
    },
    {
      icon: isInvoice ? '📄' : '💳',
      title: isInvoice ? 'Счёт на оплату' : 'Оплата',
      desc: isInvoice
        ? 'Счёт-фактура будет отправлена на email в течение 5 минут.'
        : isKaspi
          ? 'Ссылку на оплату Kaspi отправим в WhatsApp.'
          : 'Детали оплаты — в SMS или WhatsApp.',
      done: false,
    },
    {
      icon: '📦',
      title: 'Отгрузка',
      desc: 'После подтверждения оплаты отгрузим в течение 2 часов (Алматы) или следующим рейсом (регионы).',
      done: false,
    },
  ]

  return (
    <>
      <style>{`
        .success-page { min-height: 80vh; display: flex; align-items: center; justify-content: center; padding: 40px 16px; }
        .success-wrap { max-width: 700px; width: 100%; display: flex; flex-direction: column; gap: 24px; }

        .success-hero { background: var(--surf); border: 1.5px solid var(--line); border-radius: 20px; padding: 48px 40px 40px; text-align: center; }
        .success-icon { width: 80px; height: 80px; border-radius: 50%; background: #f0fdf4; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; }
        .success-icon svg { color: #16a34a; }
        .success-hero h1 { font-size: 28px; font-weight: 800; letter-spacing: -.02em; color: var(--ink); margin-bottom: 8px; }
        .success-hero p { color: var(--ink-2); font-size: 15px; line-height: 1.6; }
        .order-num { display: inline-flex; align-items: center; gap: 8px; background: var(--surf-2); border: 1.5px solid var(--line-2); border-radius: 10px; padding: 10px 18px; margin-top: 20px; font-family: var(--font-jetbrains, monospace); font-size: 18px; font-weight: 700; color: var(--ink); letter-spacing: .04em; }
        .copy-btn { background: none; border: none; cursor: pointer; color: var(--ink-3); padding: 2px; display: flex; align-items: center; }
        .copy-btn:hover { color: var(--accent); }

        .success-steps { background: var(--surf); border: 1.5px solid var(--line); border-radius: 20px; padding: 32px 36px; }
        .success-steps h2 { font-size: 16px; font-weight: 700; color: var(--ink); margin-bottom: 24px; }
        .step-list { display: flex; flex-direction: column; gap: 0; }
        .step-item { display: flex; gap: 16px; align-items: flex-start; padding-bottom: 24px; position: relative; }
        .step-item:last-child { padding-bottom: 0; }
        .step-item:not(:last-child)::before { content: ''; position: absolute; left: 19px; top: 42px; bottom: 0; width: 2px; background: var(--line); }
        .step-dot { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; border: 2px solid var(--line); background: var(--surf-2); }
        .step-dot.done { background: #f0fdf4; border-color: #16a34a; }
        .step-body { padding-top: 8px; }
        .step-body b { display: block; font-size: 15px; font-weight: 600; color: var(--ink); margin-bottom: 4px; }
        .step-body span { font-size: 13px; color: var(--ink-2); line-height: 1.5; }

        .success-contacts { background: var(--surf); border: 1.5px solid var(--line); border-radius: 20px; padding: 28px 36px; display: flex; gap: 20px; align-items: center; flex-wrap: wrap; }
        .success-contacts .sc-text { flex: 1; min-width: 200px; }
        .success-contacts h3 { font-size: 15px; font-weight: 700; color: var(--ink); margin-bottom: 4px; }
        .success-contacts p { font-size: 13px; color: var(--ink-2); line-height: 1.5; }
        .sc-btns { display: flex; gap: 10px; flex-wrap: wrap; }

        .btn-wa { display: inline-flex; align-items: center; gap: 8px; background: #25d366; color: #fff; font-weight: 600; font-size: 14px; padding: 11px 20px; border-radius: 10px; border: none; cursor: pointer; text-decoration: none; }
        .btn-wa:hover { background: #1ebe5c; }
        .btn-tg { display: inline-flex; align-items: center; gap: 8px; background: #2aabee; color: #fff; font-weight: 600; font-size: 14px; padding: 11px 20px; border-radius: 10px; border: none; cursor: pointer; text-decoration: none; }
        .btn-tg:hover { background: #1a9bd9; }

        .success-actions { display: flex; gap: 12px; flex-wrap: wrap; }
        .btn-primary { flex: 1; min-width: 200px; display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: var(--accent); color: #fff; font-weight: 600; font-size: 15px; padding: 14px 24px; border-radius: 12px; border: none; cursor: pointer; text-decoration: none; }
        .btn-primary:hover { background: var(--accent-deep); }
        .btn-outline { flex: 1; min-width: 160px; display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: var(--surf); color: var(--ink); font-weight: 600; font-size: 15px; padding: 14px 24px; border-radius: 12px; border: 1.5px solid var(--line-2); cursor: pointer; text-decoration: none; }
        .btn-outline:hover { border-color: var(--ink); }

        .trust-row { display: flex; gap: 20px; flex-wrap: wrap; justify-content: center; }
        .trust-item { display: flex; align-items: center; gap: 7px; font-size: 13px; color: var(--ink-2); }
        .trust-item svg { color: #16a34a; flex-shrink: 0; }

        @media (max-width: 600px) {
          .success-hero { padding: 32px 20px; }
          .success-steps, .success-contacts { padding: 24px 20px; }
          .pdp-title { font-size: 22px; }
        }
      `}</style>

      <main className="success-page">
        <div className="success-wrap">

          {/* Hero */}
          <div className="success-hero">
            <div className="success-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h1>Заказ оформлен!</h1>
            <p>Спасибо! Ваш заказ принят и передан менеджеру.<br/>Ожидайте звонка в течение 15 минут.</p>
            <div className="order-num">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              {num}
              <button className="copy-btn" title="Скопировать" onClick={() => navigator.clipboard.writeText(num)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              </button>
            </div>
          </div>

          {/* Steps: что дальше */}
          <div className="success-steps">
            <h2>Что происходит дальше</h2>
            <div className="step-list">
              {steps.map((s, i) => (
                <div key={i} className="step-item">
                  <div className={`step-dot${s.done ? ' done' : ''}`}>{s.icon}</div>
                  <div className="step-body">
                    <b>{s.title}</b>
                    <span>{s.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contacts */}
          <div className="success-contacts">
            <div className="sc-text">
              <h3>Остались вопросы?</h3>
              <p>Напишите менеджеру напрямую — ответим за 2 минуты и поможем с подбором.</p>
            </div>
            <div className="sc-btns">
              <a
                href="https://wa.me/77000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-wa"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                WhatsApp
              </a>
              <a
                href="https://t.me/tulparhub"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-tg"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                Telegram
              </a>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="success-actions">
            <Link href="/catalog" className="btn-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              Продолжить покупки
            </Link>
            <Link href="/podbor" className="btn-outline">
              Подобрать ещё запчасти
            </Link>
          </div>

          {/* Trust */}
          <div className="trust-row">
            {[
              'Гарантия 12 месяцев на OEM',
              'Возврат 14 дней без вопросов',
              'Закрывающие документы в 1С',
              'Доставка по всему Казахстану',
            ].map(t => (
              <div key={t} className="trust-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                {t}
              </div>
            ))}
          </div>

        </div>
      </main>
    </>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense>
      <OrderSuccessInner />
    </Suspense>
  )
}
