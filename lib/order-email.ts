import {
  type EmailLocale,
  emailConfigErrors,
  emailFrom,
  esc,
  sendEmail,
} from '@/lib/email'

// Customer-facing "your order changed status" email. Temporary email transport
// for what the roadmap plans as SMS notifications (the SMS gateway / alpha-name
// registration is a long external lead time). Sent fire-and-forget from the
// admin status actions — a mail outage must never fail a status update.

export type OrderEmailKind = 'order' | 'payment'

export interface OrderStatusEmailParams {
  invoiceNumber: string
  /** An order status (new/confirmed/…) when kind==='order', a payment status when kind==='payment'. */
  status: string
  kind: OrderEmailKind
  /** Absolute (or relative) link to the /track page — build with trackUrl(). */
  trackUrl: string
}

// Human labels for each status, per locale. Keys mirror ORDER_STATUSES /
// PAYMENT_STATUSES in lib/services/orders. An unknown status renders verbatim.
const ORDER_LABELS: Record<EmailLocale, Record<string, string>> = {
  ru: { new: 'Новый', confirmed: 'Подтверждён', shipped: 'Отправлен', done: 'Выполнен', cancelled: 'Отменён' },
  kz: { new: 'Жаңа', confirmed: 'Расталды', shipped: 'Жіберілді', done: 'Орындалды', cancelled: 'Бас тартылды' },
  en: { new: 'New', confirmed: 'Confirmed', shipped: 'Shipped', done: 'Completed', cancelled: 'Cancelled' },
}

const PAYMENT_LABELS: Record<EmailLocale, Record<string, string>> = {
  ru: { pending: 'Ожидает оплаты', paid: 'Оплачен', failed: 'Ошибка оплаты', refunded: 'Возврат' },
  kz: { pending: 'Төлем күтілуде', paid: 'Төленді', failed: 'Төлем қатесі', refunded: 'Қайтарылды' },
  en: { pending: 'Awaiting payment', paid: 'Paid', failed: 'Payment failed', refunded: 'Refunded' },
}

interface Copy {
  subjectOrder: (inv: string, label: string) => string
  subjectPayment: (inv: string, label: string) => string
  heading: string
  intro: (inv: string) => string
  statusLine: (label: string) => string
  button: string
  fallback: string
  tagline: string
}

const COPY: Record<EmailLocale, Copy> = {
  ru: {
    subjectOrder: (inv, label) => `Заказ ${inv}: ${label}`,
    subjectPayment: (inv, label) => `Оплата заказа ${inv}: ${label}`,
    heading: 'Статус заказа обновлён',
    intro: (inv) => `Ваш заказ ${inv} обновлён.`,
    statusLine: (label) => `Текущий статус: ${label}`,
    button: 'Отследить заказ',
    fallback: 'Если кнопка не работает, скопируйте эту ссылку в браузер:',
    tagline: 'Запчасти для грузовиков',
  },
  kz: {
    subjectOrder: (inv, label) => `${inv} тапсырысы: ${label}`,
    subjectPayment: (inv, label) => `${inv} тапсырысының төлемі: ${label}`,
    heading: 'Тапсырыс мәртебесі жаңартылды',
    intro: (inv) => `Сіздің ${inv} тапсырысыңыз жаңартылды.`,
    statusLine: (label) => `Ағымдағы мәртебе: ${label}`,
    button: 'Тапсырысты бақылау',
    fallback: 'Түйме жұмыс істемесе, осы сілтемені браузерге көшіріңіз:',
    tagline: 'Жүк көліктеріне қосалқы бөлшектер',
  },
  en: {
    subjectOrder: (inv, label) => `Order ${inv}: ${label}`,
    subjectPayment: (inv, label) => `Order ${inv} payment: ${label}`,
    heading: 'Order status updated',
    intro: (inv) => `Your order ${inv} has been updated.`,
    statusLine: (label) => `Current status: ${label}`,
    button: 'Track order',
    fallback: 'If the button doesn’t work, copy this link into your browser:',
    tagline: 'Truck parts',
  },
}

function labelFor(locale: EmailLocale, kind: OrderEmailKind, status: string): string {
  const table = kind === 'payment' ? PAYMENT_LABELS : ORDER_LABELS
  return table[locale][status] ?? status
}

/** Build the customer's /track link with the invoice number prefilled. */
export function trackUrl(locale: EmailLocale, invoiceNumber: string): string {
  const base = (process.env.AUTH_URL ?? '').replace(/\/$/, '')
  const path = `/${locale}/track?num=${encodeURIComponent(invoiceNumber)}`
  return base ? `${base}${path}` : path
}

export function renderOrderStatusEmail(
  locale: EmailLocale,
  p: OrderStatusEmailParams,
): { subject: string; html: string; text: string } {
  const c = COPY[locale]
  const label = labelFor(locale, p.kind, p.status)
  const subject = p.kind === 'payment'
    ? c.subjectPayment(p.invoiceNumber, label)
    : c.subjectOrder(p.invoiceNumber, label)
  const link = esc(p.trackUrl)

  const html = `<!doctype html>
<html lang="${locale === 'kz' ? 'kk' : locale}">
<body style="margin:0;background:#eef0f7;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#0a1a4f;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef0f7;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:440px;background:#ffffff;border-radius:16px;overflow:hidden;">
        <tr><td style="background:#db0a40;padding:22px 28px;color:#ffffff;">
          <div style="font-size:18px;font-weight:800;letter-spacing:-.5px;">TULPAR HUB</div>
          <div style="font-size:12px;opacity:.75;margin-top:2px;">${esc(c.tagline)}</div>
        </td></tr>
        <tr><td style="padding:28px;">
          <h1 style="margin:0 0 10px;font-size:20px;font-weight:700;color:#0a1a4f;">${esc(c.heading)}</h1>
          <p style="margin:0 0 6px;font-size:14px;line-height:1.55;color:#44507a;">${esc(c.intro(p.invoiceNumber))}</p>
          <p style="margin:0 0 22px;font-size:15px;font-weight:700;color:#0a1a4f;">${esc(c.statusLine(label))}</p>
          <a href="${link}" style="display:inline-block;background:#db0a40;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:13px 28px;border-radius:10px;">${esc(c.button)}</a>
          <p style="margin:24px 0 6px;font-size:12px;color:#647089;">${esc(c.fallback)}</p>
          <p style="margin:0;font-size:12px;word-break:break-all;"><a href="${link}" style="color:#db0a40;">${link}</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  const text = `${c.heading}\n\n${c.intro(p.invoiceNumber)}\n${c.statusLine(label)}\n\n${p.trackUrl}`
  return { subject, html, text }
}

/**
 * Send the status email, fire-and-forget. Silent no-op when email is
 * misconfigured (never throws — callers await it only for `void`). Errors are
 * logged with a greppable prefix for diagnosis.
 */
export async function sendOrderStatusEmail(opts: {
  to: string
  locale: EmailLocale
  invoiceNumber: string
  status: string
  kind: OrderEmailKind
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const from = emailFrom()
  const configErrs = emailConfigErrors(apiKey, from)
  if (configErrs.length) {
    console.error(`[order-email] config error: ${configErrs.join(', ')}`)
    return
  }
  const { subject, html, text } = renderOrderStatusEmail(opts.locale, {
    invoiceNumber: opts.invoiceNumber,
    status: opts.status,
    kind: opts.kind,
    trackUrl: trackUrl(opts.locale, opts.invoiceNumber),
  })
  const fail = await sendEmail(apiKey!, { from, to: opts.to, subject, html, text })
  if (fail) console.error(`[order-email] ${fail.code}: ${fail.detail}`)
}
