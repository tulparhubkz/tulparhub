import { describe, it, expect } from 'vitest'
import { detectLocale, renderVerificationEmail } from '@/lib/auth-email'

const link = (callbackUrl?: string) =>
  `https://tulparhub.kz/api/auth/callback/nodemailer?token=abc&email=a%40b.com` +
  (callbackUrl ? `&callbackUrl=${encodeURIComponent(callbackUrl)}` : '')

describe('detectLocale', () => {
  it('reads the locale from the callbackUrl path', () => {
    expect(detectLocale(null, link('/kz'))).toBe('kz')
    expect(detectLocale(null, link('/en'))).toBe('en')
    expect(detectLocale(null, link('/ru/cart'))).toBe('ru')
  })

  it('handles an absolute same-origin callbackUrl', () => {
    expect(detectLocale(null, link('https://tulparhub.kz/en/wishlist'))).toBe('en')
  })

  it('falls back to the NEXT_LOCALE cookie when callbackUrl has no locale', () => {
    expect(detectLocale('foo=1; NEXT_LOCALE=kz; bar=2', link('/cart'))).toBe('kz')
    expect(detectLocale('NEXT_LOCALE=en', link())).toBe('en')
  })

  it('prefers the callbackUrl locale over the cookie', () => {
    expect(detectLocale('NEXT_LOCALE=en', link('/kz'))).toBe('kz')
  })

  it('defaults to ru when nothing indicates a locale', () => {
    expect(detectLocale(null, link('/cart'))).toBe('ru')
    expect(detectLocale('NEXT_LOCALE=fr', link())).toBe('ru')
    expect(detectLocale(null, 'not a url')).toBe('ru')
  })
})

describe('renderVerificationEmail', () => {
  const url = 'https://tulparhub.kz/api/auth/callback/nodemailer?token=xyz'

  it('localizes the subject', () => {
    expect(renderVerificationEmail('ru', url).subject).toBe('Вход в TULPAR HUB')
    expect(renderVerificationEmail('kz', url).subject).toBe('TULPAR HUB-қа кіру')
    expect(renderVerificationEmail('en', url).subject).toBe('Sign in to TULPAR HUB')
  })

  it('embeds the sign-in link in both html and text', () => {
    const { html, text } = renderVerificationEmail('en', url)
    expect(html).toContain(`href="${url}"`)
    expect(text).toContain(url)
    expect(html).toContain('Sign in')
  })

  it('uses the right button label per locale', () => {
    expect(renderVerificationEmail('ru', url).html).toContain('Войти')
    expect(renderVerificationEmail('kz', url).html).toContain('Кіру')
  })
})
