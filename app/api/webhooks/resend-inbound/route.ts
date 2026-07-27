/**
 * Resend inbound-email webhook — receives the vendor's per-city price list.
 *
 * Point the Resend inbound webhook at:
 *
 *   POST https://<host>/api/webhooks/resend-inbound
 *
 * Flow: verify the Svix signature → check the sender against the allowlist →
 * pull the spreadsheet from the attachments API (the hook carries metadata
 * only) → parse it → refresh wholesale price + this city's stock for matched
 * parts, recording the run in sync_runs.
 *
 * The vendor sends one file per city (Прайс TM Алматы, Прайс TM Астана); each
 * arrives as its own webhook and updates only its own city — see importPriceFeed.
 */
import { NextResponse } from 'next/server'
import {
  verifySignature,
  isAllowedSender,
  pickSpreadsheet,
  listAttachments,
  downloadAttachment,
  type InboundEmail,
} from '@/lib/resend-inbound'
import { importPriceFeed } from '@/lib/services/priceFeed'

export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 8k+ rows: download + parse + write

// The vendor's feed address, plus the operator's own for testing/manual resends.
// Override entirely with INBOUND_FEED_SENDERS (comma-separated) in production.
const DEFAULT_SENDERS = 'update@truckmotors.kz,baglanov.a0930@gmail.com'

/** Always 200 for handled-but-ignored mail, so Resend doesn't retry forever. */
function ignored(reason: string) {
  return NextResponse.json({ ok: true, ignored: reason })
}

export async function POST(req: Request) {
  const secret = process.env.RESEND_INBOUND_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'RESEND_INBOUND_SECRET is not set' }, { status: 500 })
  }

  // Must be the raw text: re-serializing the JSON would break the signature.
  const raw = await req.text()
  const verified = verifySignature({
    body: raw,
    secret,
    id: req.headers.get('svix-id'),
    timestamp: req.headers.get('svix-timestamp'),
    signature: req.headers.get('svix-signature'),
  })
  if (!verified.ok) {
    return NextResponse.json({ error: `Unauthorized: ${verified.reason}` }, { status: 401 })
  }

  let event: { type?: string; data?: InboundEmail }
  try {
    event = JSON.parse(raw)
  } catch {
    return NextResponse.json({ error: 'Malformed JSON' }, { status: 400 })
  }

  if (event.type !== 'email.received') return ignored(`event ${event.type}`)
  const mail = event.data
  if (!mail) return ignored('no data')

  const allowlist = (process.env.INBOUND_FEED_SENDERS ?? DEFAULT_SENDERS).split(',')
  if (!isAllowedSender(mail.from, allowlist)) return ignored(`sender ${mail.from}`)

  if (!pickSpreadsheet(mail.attachments ?? [])) return ignored('no spreadsheet attached')

  const vendorId = process.env.VENDOR_ID ?? 'main'

  try {
    // The webhook only names the attachments; fetch the signed URLs to get bytes.
    const attachments = await listAttachments(mail.email_id)
    const file = pickSpreadsheet(attachments)
    if (!file) throw new Error('attachment metadata listed no spreadsheet')

    const buf = await downloadAttachment(file.download_url)
    const result = await importPriceFeed({
      buf,
      vendorId,
      fileName: file.filename,
      subject: mail.subject,
    })

    return NextResponse.json({ ok: true, file: file.filename, ...result })
  } catch (err) {
    // importPriceFeed records its own failure on the sync run; report to Resend.
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
