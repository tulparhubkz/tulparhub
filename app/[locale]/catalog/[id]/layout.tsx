import type { Metadata } from 'next'
import { getPart } from '@/lib/services/parts'
import { siteUrl } from '@/lib/seo'

// The PDP itself is a client component; this passthrough layout exists so the
// segment can emit per-part metadata server-side (#42). Content is Russian —
// the catalog is RU-only regardless of UI locale.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}): Promise<Metadata> {
  const { locale, id: rawId } = await params
  const id = decodeURIComponent(rawId) // params keep percent-encoding ("main%3A…")
  const part = await getPart(id)
  if (!part) return {}

  const title = `${part.name}${part.oem ? ` (${part.oem})` : ''} — купить в Казахстане | TulparHub`
  const description = [
    part.name,
    part.brand ? `бренд ${part.brand}` : null,
    part.oem ? `артикул ${part.oem}` : null,
    part.price > 0 ? `цена ${part.price.toLocaleString('ru-RU')} ₸ с НДС` : null,
    'наличие на складах, доставка по Казахстану',
  ]
    .filter(Boolean)
    .join('. ')

  const url = `${siteUrl()}/${locale}/catalog/${encodeURIComponent(id)}`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'TulparHub',
      type: 'website',
    },
  }
}

export default function PartLayout({ children }: { children: React.ReactNode }) {
  return children
}
