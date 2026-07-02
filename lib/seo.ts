// Canonical site origin for sitemap/robots/OG links. Until the production
// domain lands (#40), staging on Render is the public face.
export function siteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || process.env.AUTH_URL || 'https://tulparhub.onrender.com'
  return raw.replace(/\/$/, '')
}
