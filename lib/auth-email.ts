import type { EmailConfig } from '@auth/core/providers/email'

// Localized magic-link email. Auth.js's default sender is English-only; this
// sends the sign-in link in the language the user is actually using (RU/KZ/EN).
// Delivered via Resend's HTTP API (not SMTP) — hosts like Render block outbound
// SMTP ports, which makes a nodemailer transport hang until it's killed.

export type EmailLocale = 'ru' | 'kz' | 'en'
const LOCALES: EmailLocale[] = ['ru', 'kz', 'en']

// Specific, greppable reasons email sign-in can fail — so a broken deploy is
// diagnosable from logs / the /api/auth/email-diagnostics endpoint instead of
// the opaque Auth.js "Configuration" error.
export type EmailErrorCode =
  | 'RESEND_API_KEY_MISSING'
  | 'EMAIL_FROM_MISSING'
  | 'EMAIL_FROM_INVALID'
  | 'RESEND_UNAUTHORIZED' // 401 — bad/restricted API key
  | 'RESEND_DOMAIN_NOT_VERIFIED' // 403 — from-domain not verified
  | 'RESEND_INVALID_REQUEST' // 422 — bad from/to/payload
  | 'RESEND_SEND_FAILED' // other non-2xx from Resend
  | 'RESEND_UNREACHABLE' // network error / timeout

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

// Config problems detectable without calling Resend.
export function emailConfigErrors(
  apiKey = process.env.RESEND_API_KEY,
  from = process.env.EMAIL_FROM,
): EmailErrorCode[] {
  const errs: EmailErrorCode[] = []
  if (!apiKey) errs.push('RESEND_API_KEY_MISSING')
  if (!from) errs.push('EMAIL_FROM_MISSING')
  else if (!EMAIL_RE.test(from)) errs.push('EMAIL_FROM_INVALID')
  return errs
}

// Map a Resend HTTP status to a specific code.
export function resendStatusToCode(status: number): EmailErrorCode {
  if (status === 401) return 'RESEND_UNAUTHORIZED'
  if (status === 403) return 'RESEND_DOMAIN_NOT_VERIFIED'
  if (status === 422) return 'RESEND_INVALID_REQUEST'
  return 'RESEND_SEND_FAILED'
}

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

// POST an already-rendered email to Resend, returning a specific error code on
// failure (or null on success). Shared by the sign-in hook and diagnostics.
async function resendSend(
  apiKey: string,
  body: Record<string, unknown>,
): Promise<{ code: EmailErrorCode; detail: string } | null> {
  let res: Response
  try {
    res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10000),
    })
  } catch (err) {
    return { code: 'RESEND_UNREACHABLE', detail: String(err) }
  }
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    return { code: resendStatusToCode(res.status), detail: `${res.status} ${detail}` }
  }
  return null
}

// Auth.js Resend hook — sends the localized email through Resend's HTTP API.
// Throws an `EmailErrorCode` (logged with a greppable prefix) so failures are
// diagnosable. A 10s timeout guarantees the request can never hang.
export const sendVerificationRequest: EmailConfig['sendVerificationRequest'] = async ({
  identifier,
  url,
  provider,
  request,
}) => {
  const configErrs = emailConfigErrors(provider.apiKey, provider.from)
  if (configErrs.length) {
    console.error(`[auth-email] config error: ${configErrs.join(', ')}`)
    throw new Error(configErrs[0])
  }

  const locale = detectLocale(request?.headers.get('cookie') ?? null, url)
  const { subject, html, text } = renderVerificationEmail(locale, url)
  const fail = await resendSend(provider.apiKey!, {
    from: provider.from,
    to: identifier,
    subject,
    html,
    text,
  })
  if (fail) {
    console.error(`[auth-email] ${fail.code}: ${fail.detail}`)
    throw new Error(fail.code)
  }
}

// On-demand check of email config (+ optional live test send to Resend's test
// address). Powers GET /api/auth/email-diagnostics. Never returns secrets.
export interface EmailDiagnostics {
  ok: boolean
  errors: EmailErrorCode[]
  config: { resendApiKey: boolean; emailFrom: string | null }
  testSend?: { ok: boolean; code?: EmailErrorCode; detail?: string }
}

export async function emailDiagnostics(testSend = false): Promise<EmailDiagnostics> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM ?? null
  const errors = emailConfigErrors(apiKey, from ?? undefined)

  const diag: EmailDiagnostics = {
    ok: errors.length === 0,
    errors,
    config: { resendApiKey: !!apiKey, emailFrom: from },
  }

  if (testSend && errors.length === 0) {
    const fail = await resendSend(apiKey!, {
      from,
      to: 'delivered@resend.dev', // Resend's test sink — no real inbox
      subject: 'TulparHub email diagnostics',
      html: '<p>ok</p>',
    })
    diag.testSend = fail ? { ok: false, code: fail.code, detail: fail.detail } : { ok: true }
    diag.ok = !fail
  }

  return diag
}
