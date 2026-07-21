/**
 * Inbound-email plumbing for the vendor price feed.
 *
 * Resend signs webhooks in Svix's format and does NOT put the attachment in the
 * payload — the hook carries metadata only, so the bytes are fetched afterwards
 * from the attachments API with our existing RESEND_API_KEY.
 *
 * Verification is implemented against node:crypto rather than the svix SDK: it
 * is one HMAC, and the dependency would exist for that alone.
 */
import { createHmac, timingSafeEqual } from 'crypto'

const API = 'https://api.resend.com'

/** Reject replays of a captured request beyond this age. */
const TOLERANCE_MS = 5 * 60 * 1000

export interface InboundAttachment {
  id: string
  filename: string
  content_type: string
  size: number
  download_url: string
  expires_at: string
}

export interface InboundEmail {
  email_id: string
  from: string
  to: string[]
  subject: string
  attachments: Array<{ id: string; filename: string; content_type: string }>
}

// ── Signature ────────────────────────────────────────────────────────────────

export type VerifyResult = { ok: true } | { ok: false; reason: string }

/**
 * Verify a Svix-signed webhook.
 *
 * The signed payload is `${id}.${timestamp}.${body}`, so `body` must be the raw
 * request text — re-serializing the parsed JSON changes the bytes and the
 * signature will not match.
 */
export function verifySignature(opts: {
  body: string
  secret: string
  id: string | null
  timestamp: string | null
  signature: string | null
  now?: number
}): VerifyResult {
  const { body, secret, id, timestamp, signature } = opts
  if (!id || !timestamp || !signature) return { ok: false, reason: 'missing svix headers' }

  const ts = Number(timestamp) * 1000
  if (!Number.isFinite(ts)) return { ok: false, reason: 'bad timestamp' }
  if (Math.abs((opts.now ?? Date.now()) - ts) > TOLERANCE_MS) {
    return { ok: false, reason: 'timestamp outside tolerance' }
  }

  // Secrets are handed out as `whsec_<base64>`; the prefix is not part of the key.
  const key = Buffer.from(secret.replace(/^whsec_/, ''), 'base64')
  const expected = createHmac('sha256', key).update(`${id}.${timestamp}.${body}`).digest()

  // The header carries a space-separated list so keys can be rotated; a match
  // against any listed v1 signature is a pass.
  const candidates = signature
    .split(' ')
    .filter((p) => p.startsWith('v1,'))
    .map((p) => Buffer.from(p.slice(3), 'base64'))

  for (const cand of candidates) {
    if (cand.length === expected.length && timingSafeEqual(cand, expected)) return { ok: true }
  }
  return { ok: false, reason: 'signature mismatch' }
}

// ── Payload checks ───────────────────────────────────────────────────────────

/** Bare address out of a `Name <addr@host>` header value. */
export function normalizeAddress(from: string): string {
  const m = /<([^>]+)>/.exec(from)
  return (m ? m[1] : from).trim().toLowerCase()
}

/** Is this sender allowed to update our catalogue? */
export function isAllowedSender(from: string, allowlist: string[]): boolean {
  const addr = normalizeAddress(from)
  return allowlist.some((a) => a.trim().toLowerCase() === addr)
}

const SPREADSHEET = /\.(xlsx|xls|csv)$/i

/** The first spreadsheet attachment, which is the price list. */
export function pickSpreadsheet<T extends { filename: string }>(attachments: T[]): T | null {
  return attachments.find((a) => SPREADSHEET.test(a.filename)) ?? null
}

// ── Attachment fetch ─────────────────────────────────────────────────────────

/** List an inbound email's attachments (metadata + a 1-hour download_url). */
export async function listAttachments(
  emailId: string,
  apiKey = process.env.RESEND_API_KEY,
): Promise<InboundAttachment[]> {
  if (!apiKey) throw new Error('RESEND_API_KEY is not set')

  const res = await fetch(`${API}/emails/receiving/${emailId}/attachments`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  })
  if (!res.ok) {
    throw new Error(`resend: listing attachments failed (${res.status} ${await res.text()})`)
  }
  const json = (await res.json()) as { data?: InboundAttachment[] }
  return json.data ?? []
}

/** Download an attachment's bytes from its signed, short-lived URL. */
export async function downloadAttachment(url: string): Promise<Buffer> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`resend: attachment download failed (${res.status})`)
  return Buffer.from(await res.arrayBuffer())
}
