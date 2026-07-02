import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Private/transactional surfaces — nothing an index should ever show.
      disallow: ['/api/', '/admin', '/account', '/invoice/', '/order-success', '/auth', '/cart'],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  }
}
