import { Suspense } from 'react'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import CatalogInner from './CatalogInner'

export default async function CatalogPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations()
  return (
    <Suspense fallback={<div className="container" style={{ padding: '4rem 0' }}>{t('common.loading')}</div>}>
      <CatalogInner />
    </Suspense>
  )
}
