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
