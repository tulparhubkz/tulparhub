// Shared contact validators — used client-side (cart form) and server-side
// (submitOrder), so the rules can't drift apart.

export function phoneDigits(s: string | null | undefined): string {
  return (s ?? '').replace(/\D/g, '')
}

/** KZ-style mobile/landline: 10 digits, or 11 starting with 7/8 (+7 / 8 prefix). */
export function isValidPhone(s: string | null | undefined): boolean {
  const d = phoneDigits(s)
  if (d.length === 10) return true
  return d.length === 11 && (d[0] === '7' || d[0] === '8')
}

export function isValidEmail(s: string | null | undefined): boolean {
  const v = (s ?? '').trim()
  return v.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)
}

/**
 * Progressive input mask: "+7 (700) 123-45-67". Accepts 8/7/+7 prefixes and
 * bare local numbers; returns '' when the field is cleared so it stays
 * clearable. Use in onChange: e.target.value = formatPhoneInput(e.target.value).
 */
export function formatPhoneInput(raw: string): string {
  let d = raw.replace(/\D/g, '')
  if (!d) return ''
  if (d.startsWith('8')) d = '7' + d.slice(1)
  if (!d.startsWith('7')) d = '7' + d
  d = d.slice(0, 11)
  const p = d.slice(1)
  let out = '+7'
  if (p.length > 0) out += ' (' + p.slice(0, 3)
  if (p.length >= 3) out += ')'
  if (p.length > 3) out += ' ' + p.slice(3, 6)
  if (p.length > 6) out += '-' + p.slice(6, 8)
  if (p.length > 8) out += '-' + p.slice(8, 10)
  return out
}
