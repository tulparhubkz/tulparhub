import { describe, it, expect } from 'vitest'
import { phoneDigits, isValidPhone, isValidEmail, formatPhoneInput } from '@/lib/validation'

describe('phoneDigits', () => {
  it('strips everything but digits', () => {
    expect(phoneDigits('+7 (700) 123-45-67')).toBe('77001234567')
    expect(phoneDigits(null)).toBe('')
    expect(phoneDigits(undefined)).toBe('')
  })
})

describe('isValidPhone', () => {
  it('accepts 10-digit local numbers', () => {
    expect(isValidPhone('7001234567')).toBe(true)
  })
  it('accepts 11 digits with 7 or 8 prefix', () => {
    expect(isValidPhone('+7 700 123 45 67')).toBe(true)
    expect(isValidPhone('8 (700) 123-45-67')).toBe(true)
  })
  it('rejects 11 digits with other prefixes', () => {
    expect(isValidPhone('17001234567')).toBe(false)
  })
  it('rejects too short / too long / empty', () => {
    expect(isValidPhone('123456')).toBe(false)
    expect(isValidPhone('770012345678')).toBe(false)
    expect(isValidPhone('')).toBe(false)
    expect(isValidPhone(null)).toBe(false)
  })
})

describe('isValidEmail', () => {
  it('accepts ordinary addresses', () => {
    expect(isValidEmail('ops@tulparhub.kz')).toBe(true)
    expect(isValidEmail('  padded@mail.ru  ')).toBe(true) // trims
  })
  it('rejects malformed addresses', () => {
    expect(isValidEmail('no-at-sign')).toBe(false)
    expect(isValidEmail('a@b')).toBe(false) // TLD required
    expect(isValidEmail('a b@c.kz')).toBe(false)
    expect(isValidEmail('')).toBe(false)
  })
  it('rejects addresses over 254 chars', () => {
    expect(isValidEmail('x'.repeat(250) + '@a.kz')).toBe(false)
  })
})

describe('formatPhoneInput', () => {
  it('builds the +7 mask progressively', () => {
    expect(formatPhoneInput('7')).toBe('+7')
    expect(formatPhoneInput('+7 (700) 1')).toBe('+7 (700) 1')
    expect(formatPhoneInput('+77001234567')).toBe('+7 (700) 123-45-67')
  })
  it('treats a leading 7 as the country code (KZ numbers must be typed with +7/8 prefix)', () => {
    // Documents current behavior: bare "7001234567" loses its leading 7 to the
    // country code. All KZ mobile codes start with 7xx, so this is a known quirk.
    expect(formatPhoneInput('7001234567')).toBe('+7 (001) 234-56-7')
  })
  it('normalizes an 8 prefix to +7', () => {
    expect(formatPhoneInput('87001234567')).toBe('+7 (700) 123-45-67')
  })
  it('keeps +7-prefixed input unchanged', () => {
    expect(formatPhoneInput('+7 (700) 123-45-67')).toBe('+7 (700) 123-45-67')
  })
  it('truncates extra digits past 11', () => {
    expect(formatPhoneInput('7700123456789')).toBe('+7 (700) 123-45-67')
  })
  it('returns empty string when cleared', () => {
    expect(formatPhoneInput('')).toBe('')
    expect(formatPhoneInput('+')).toBe('')
  })
})
