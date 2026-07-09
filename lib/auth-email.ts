import type { EmailConfig } from '@auth/core/providers/email'

// Localized magic-link email. Auth.js's default sender is English-only; this
// sends the sign-in link in the language the user is actually using (RU/KZ/EN).
// Delivered via Resend's HTTP API (not SMTP) — hosts like Render block outbound
// SMTP ports, which makes a nodemailer transport hang until it's killed.

export type EmailLocale = 'ru' | 'kz' | 'en'
const LOCALES: EmailLocale[] = ['ru', 'kz', 'en']

// The locale travels with the sign-in `callbackUrl` (always embedded in the
// magic-link URL — the /auth page sets it to the current /{locale}); we fall
// back to next-intl's NEXT_LOCALE cookie, then to RU.
export function detectLocale(cookieHeader: string | null, url: string): EmailLocale {
  try {
    const cb = new URL(url).searchParams.get('callbackUrl')
    if (cb) {
      const seg = new URL(cb, 'http://x').pathname.split('/')[1]
      if ((LOCALES as string[]).includes(seg)) return seg as EmailLocale
    }
  } catch {
    /* malformed url — fall through */
  }
  const m = (cookieHeader ?? '').match(/(?:^|;\s*)NEXT_LOCALE=([^;]+)/)
  if (m && (LOCALES as string[]).includes(m[1])) return m[1] as EmailLocale
  return 'ru'
}

interface Copy {
  subject: string
  heading: string
  body: string
  button: string
  fallback: string
  ignore: string
  tagline: string
}

const COPY: Record<EmailLocale, Copy> = {
  ru: {
    subject: 'Вход в TULPAR HUB',
    heading: 'Вход в аккаунт',
    body: 'Нажмите кнопку ниже, чтобы войти в TULPAR HUB. Ссылка действительна ограниченное время.',
    button: 'Войти',
    fallback: 'Если кнопка не работает, скопируйте эту ссылку в браузер:',
    ignore: 'Если вы не запрашивали вход, просто проигнорируйте это письмо.',
    tagline: 'Запчасти для грузовиков',
  },
  kz: {
    subject: 'TULPAR HUB-қа кіру',
    heading: 'Аккаунтқа кіру',
    body: 'TULPAR HUB-қа кіру үшін төмендегі түймені басыңыз. Сілтеме шектеулі уақыт жарамды.',
    button: 'Кіру',
    fallback: 'Түйме жұмыс істемесе, осы сілтемені браузерге көшіріңіз:',
    ignore: 'Егер сіз кіруді сұрамаған болсаңыз, бұл хатты елемей қоя беріңіз.',
    tagline: 'Жүк көліктеріне қосалқы бөлшектер',
  },
  en: {
    subject: 'Sign in to TULPAR HUB',
    heading: 'Sign in',
    body: 'Click the button below to sign in to TULPAR HUB. This link is valid for a limited time.',
    button: 'Sign in',
    fallback: 'If the button doesn’t work, copy this link into your browser:',
    ignore: 'If you didn’t request this, you can safely ignore this email.',
    tagline: 'Truck parts',
  },
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export function renderVerificationEmail(locale: EmailLocale, url: string): { subject: string; html: string; text: string } {
  const c = COPY[locale]
  const link = esc(url)
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
          <p style="margin:0 0 22px;font-size:14px;line-height:1.55;color:#44507a;">${esc(c.body)}</p>
          <a href="${link}" style="display:inline-block;background:#db0a40;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:13px 28px;border-radius:10px;">${esc(c.button)}</a>
          <p style="margin:24px 0 6px;font-size:12px;color:#647089;">${esc(c.fallback)}</p>
          <p style="margin:0 0 22px;font-size:12px;word-break:break-all;"><a href="${link}" style="color:#db0a40;">${link}</a></p>
          <p style="margin:0;font-size:12px;line-height:1.5;color:#647089;border-top:1px solid #e4e7f0;padding-top:16px;">${esc(c.ignore)}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
  const text = `${c.heading}\n\n${c.body}\n\n${url}\n\n${c.ignore}`
  return { subject: c.subject, html, text }
}

// Auth.js Resend hook — sends the localized email through Resend's HTTP API.
// A 10s timeout guarantees the sign-in request can never hang indefinitely.
export const sendVerificationRequest: EmailConfig['sendVerificationRequest'] = async ({
  identifier,
  url,
  provider,
  request,
}) => {
  const locale = detectLocale(request?.headers.get('cookie') ?? null, url)
  const { subject, html, text } = renderVerificationEmail(locale, url)
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${provider.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: provider.from, to: identifier, subject, html, text }),
    signal: AbortSignal.timeout(10000),
  })
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Resend send failed (${res.status}): ${detail}`)
  }
}
