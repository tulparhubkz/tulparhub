import type { MetadataRoute } from 'next'
import { desc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { parts } from '@/lib/db/schema'
import { siteUrl } from '@/lib/seo'

// DB-backed: never evaluate at build (no DB there) — generate per request.
export const dynamic = 'force-dynamic'

const LOCALES = ['ru', 'kz', 'en'] as const
const STATIC_PATHS = ['', '/catalog', '/rental', '/podbor', '/vin', '/parts-brands', '/about', '/warranty', '/track']
const MAX_PARTS = 5_000 // well under the 50k/URL sitemap cap; freshest first

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl()

  const staticEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    STATIC_PATHS.map((path) => ({
      url: `${base}/${locale}${path}`,
      changeFrequency: path === '' || path === '/catalog' ? ('daily' as const) : ('weekly' as const),
      priority: path === '' ? 1 : path === '/catalog' ? 0.9 : 0.6,
    })),
  )

  // Product pages: RU only — the catalog content itself is Russian.
  let partEntries: MetadataRoute.Sitemap = []
  try {
    const rows = await db
      .select({ id: parts.id, updatedAt: parts.updatedAt })
      .from(parts)
      .where(eq(parts.active, true))
      .orderBy(desc(parts.updatedAt))
      .limit(MAX_PARTS)
    partEntries = rows.map((r) => ({
      url: `${base}/ru/catalog/${encodeURIComponent(r.id)}`,
      lastModified: r.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  } catch (err) {
    // A DB hiccup must not turn the sitemap into a 500 — serve the static part.
    console.error('[sitemap] parts query failed:', err)
  }

  return [...staticEntries, ...partEntries]
}
