import type { Metadata } from 'next'
import { LegalArticle } from '@/components/legal/LegalArticle'
import { resolveLocale } from '@/components/legal/resolveLocale'
import { LEGAL_DOCS } from '@/lib/legal'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return { title: `${LEGAL_DOCS.requisites[resolveLocale(locale)].title} | TulparHub` }
}

export default async function RequisitesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l = resolveLocale(locale)
  return <LegalArticle doc={LEGAL_DOCS.requisites[l]} locale={l} />
}
