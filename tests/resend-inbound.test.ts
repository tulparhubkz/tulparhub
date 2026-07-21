import { describe, it, expect } from 'vitest'
import { createHmac } from 'crypto'
import {
  verifySignature,
  isAllowedSender,
  normalizeAddress,
  pickSpreadsheet,
} from '@/lib/resend-inbound'

const SECRET = 'whsec_' + Buffer.from('super-secret-key').toString('base64')
const ID = 'msg_2abc'
const NOW = 1_770_000_000_000
const TS = String(Math.floor(NOW / 1000))

function sign(body: string, secret = SECRET, id = ID, ts = TS) {
  const key = Buffer.from(secret.replace(/^whsec_/, ''), 'base64')
  const mac = createHmac('sha256', key).update(`${id}.${ts}.${body}`).digest('base64')
  return `v1,${mac}`
}

describe('webhook signature', () => {
  const body = JSON.stringify({ type: 'email.received' })

  it('accepts a correctly signed payload', () => {
    const res = verifySignature({
      body,
      secret: SECRET,
      id: ID,
      timestamp: TS,
      signature: sign(body),
      now: NOW,
    })
    expect(res.ok).toBe(true)
  })

  it('accepts when one of several rotated signatures matches', () => {
    const sig = `v1,${Buffer.from('wrong').toString('base64')} ${sign(body)}`
    expect(verifySignature({ body, secret: SECRET, id: ID, timestamp: TS, signature: sig, now: NOW }).ok).toBe(true)
  })

  it('rejects a tampered body', () => {
    const res = verifySignature({
      body: body.replace('received', 'delivered'),
      secret: SECRET,
      id: ID,
      timestamp: TS,
      signature: sign(body),
      now: NOW,
    })
    expect(res).toEqual({ ok: false, reason: 'signature mismatch' })
  })

  it('rejects a signature made with a different secret', () => {
    const other = 'whsec_' + Buffer.from('other-key').toString('base64')
    const res = verifySignature({
      body,
      secret: SECRET,
      id: ID,
      timestamp: TS,
      signature: sign(body, other),
      now: NOW,
    })
    expect(res.ok).toBe(false)
  })

  it('rejects a replay outside the tolerance window', () => {
    const res = verifySignature({
      body,
      secret: SECRET,
      id: ID,
      timestamp: TS,
      signature: sign(body),
      now: NOW + 10 * 60 * 1000,
    })
    expect(res).toEqual({ ok: false, reason: 'timestamp outside tolerance' })
  })

  it('rejects missing headers', () => {
    const res = verifySignature({
      body,
      secret: SECRET,
      id: null,
      timestamp: TS,
      signature: sign(body),
      now: NOW,
    })
    expect(res).toEqual({ ok: false, reason: 'missing svix headers' })
  })
})

describe('sender allowlist', () => {
  it('extracts the bare address from a display-name header', () => {
    expect(normalizeAddress('TM Updates <Update@TruckMotors.KZ>')).toBe('update@truckmotors.kz')
    expect(normalizeAddress('  update@truckmotors.kz ')).toBe('update@truckmotors.kz')
  })

  it('admits the vendor and refuses anyone else', () => {
    const list = ['update@truckmotors.kz']
    expect(isAllowedSender('TM <update@truckmotors.kz>', list)).toBe(true)
    expect(isAllowedSender('attacker@evil.com', list)).toBe(false)
    expect(isAllowedSender('update@truckmotors.kz.evil.com', list)).toBe(false)
  })
})

describe('attachment selection', () => {
  it('picks the spreadsheet past inline images', () => {
    const picked = pickSpreadsheet([
      { filename: 'signature.png' },
      { filename: 'Прайс TM Алматы.xlsx' },
    ])
    expect(picked?.filename).toBe('Прайс TM Алматы.xlsx')
  })

  it('returns null when the mail carries no spreadsheet', () => {
    expect(pickSpreadsheet([{ filename: 'logo.gif' }])).toBeNull()
  })
})
