// Shared transactional-email transport. Delivered via Resend's HTTP API (not
// SMTP) — hosts like Render block outbound SMTP ports, which makes a nodemailer
// transport hang until it's killed. Both the auth magic-link (lib/auth-email)
// and order-status notifications (lib/order-email) send through here.

export type EmailLocale = 'ru' | 'kz' | 'en'
export const EMAIL_LOCALES: EmailLocale[] = ['ru', 'kz', 'en']

// Specific, greppable reasons a send can fail — so a broken deploy is
// diagnosable from logs / the /api/auth/email-diagnostics endpoint instead of
// an opaque failure.
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

// Sender address. Not a secret, so it defaults to our verified domain and only
// needs EMAIL_FROM set to override it.
export const DEFAULT_EMAIL_FROM = 'no-reply@tulparhub.baglanov.com'
export function emailFrom(): string {
  return process.env.EMAIL_FROM || DEFAULT_EMAIL_FROM
}

// Config problems detectable without calling Resend.
export function emailConfigErrors(
  apiKey = process.env.RESEND_API_KEY,
  from = emailFrom(),
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

export const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// POST an already-rendered email to Resend, returning a specific error code on
// failure (or null on success). Shared by the sign-in hook, diagnostics and
// order-status notifications. A 10s timeout guarantees the request can't hang.
export async function sendEmail(
  apiKey: string,
  body: { from: string; to: string; subject: string; html: string; text?: string },
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
