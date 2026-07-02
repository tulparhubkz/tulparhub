// Minimal in-memory rate limiter: token bucket per key (e.g. "submit:<ip>").
// Good enough while the app runs as a single instance (Render); swap the Map
// for Redis/Upstash when scaling out. See issue #68.

interface Bucket {
  tokens: number
  last: number // ms timestamp of the last refill
}

const buckets = new Map<string, Bucket>()
const MAX_KEYS = 10_000

export interface RateLimitOpts {
  limit: number // requests allowed per window
  windowMs: number
}

/** Returns true when the call is allowed; false when the key is over its limit. */
export function rateLimit(key: string, { limit, windowMs }: RateLimitOpts): boolean {
  const now = Date.now()

  // The map must not grow unbounded under spoofed IPs: once it gets large,
  // evict buckets that have fully refilled anyway.
  if (buckets.size >= MAX_KEYS) {
    buckets.forEach((b, k) => {
      if (now - b.last >= windowMs) buckets.delete(k)
    })
  }

  const b = buckets.get(key) ?? { tokens: limit, last: now }
  b.tokens = Math.min(limit, b.tokens + ((now - b.last) / windowMs) * limit)
  b.last = now
  buckets.set(key, b)

  if (b.tokens < 1) return false
  b.tokens -= 1
  return true
}

/** First hop of x-forwarded-for (Render sits behind a proxy), else x-real-ip. */
export function clientIpFrom(h: { get(name: string): string | null }): string {
  const xf = h.get('x-forwarded-for')
  if (xf) return xf.split(',')[0].trim()
  return h.get('x-real-ip') ?? 'unknown'
}

/** Test hook — reset all buckets. */
export function resetRateLimits() {
  buckets.clear()
}
