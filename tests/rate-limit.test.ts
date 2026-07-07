import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { rateLimit, clientIpFrom, resetRateLimits } from '@/lib/rateLimit'

const OPTS = { limit: 5, windowMs: 60_000 }

describe('rateLimit — token bucket per key', () => {
  beforeEach(() => {
    resetRateLimits()
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-02T12:00:00Z'))
  })
  afterEach(() => vi.useRealTimers())

  it('allows up to the limit, then blocks', () => {
    for (let i = 0; i < 5; i++) expect(rateLimit('submit:1.2.3.4', OPTS)).toBe(true)
    expect(rateLimit('submit:1.2.3.4', OPTS)).toBe(false)
    expect(rateLimit('submit:1.2.3.4', OPTS)).toBe(false)
  })

  it('refills gradually with time', () => {
    for (let i = 0; i < 5; i++) rateLimit('k', OPTS)
    expect(rateLimit('k', OPTS)).toBe(false)
    vi.advanceTimersByTime(12_000) // 1/5 of the window → 1 token back
    expect(rateLimit('k', OPTS)).toBe(true)
    expect(rateLimit('k', OPTS)).toBe(false)
    vi.advanceTimersByTime(60_000) // full window → full bucket
    for (let i = 0; i < 5; i++) expect(rateLimit('k', OPTS)).toBe(true)
    expect(rateLimit('k', OPTS)).toBe(false)
  })

  it('tracks keys independently', () => {
    for (let i = 0; i < 5; i++) rateLimit('submit:a', OPTS)
    expect(rateLimit('submit:a', OPTS)).toBe(false)
    expect(rateLimit('submit:b', OPTS)).toBe(true) // other IP unaffected
    expect(rateLimit('track:a', OPTS)).toBe(true) // other action unaffected
  })
})

describe('clientIpFrom', () => {
  const h = (o: Record<string, string>) => ({ get: (n: string) => o[n.toLowerCase()] ?? null })

  it('takes the first hop of x-forwarded-for', () => {
    expect(clientIpFrom(h({ 'x-forwarded-for': '203.0.113.7, 10.0.0.1' }))).toBe('203.0.113.7')
  })
  it('falls back to x-real-ip, then "unknown"', () => {
    expect(clientIpFrom(h({ 'x-real-ip': '203.0.113.9' }))).toBe('203.0.113.9')
    expect(clientIpFrom(h({}))).toBe('unknown')
  })
})
