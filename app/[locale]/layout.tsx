import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import { Golos_Text, JetBrains_Mono } from 'next/font/google'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FloatingChat } from '@/components/layout/FloatingChat'
import { BottomNav } from '@/components/layout/BottomNav'
import { CartAddedPopup } from '@/components/cart/CartAddedPopup'
import { YandexMetrica } from '@/components/analytics/YandexMetrica'
import { MetricaIdentity } from '@/components/analytics/MetricaIdentity'
import { routing } from '@/i18n/routing'
import { siteUrl } from '@/lib/seo'
import { Providers } from '../providers'
import '../globals.css'

const golos = Golos_Text({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-golos',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale })
  const title = t('meta.title')
  const description = t('meta.description')
  return {
    metadataBase: new URL(siteUrl()),
    title,
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: { ru: '/ru', kk: '/kz', en: '/en' },
    },
    openGraph: {
      title,
      description,
      siteName: 'TulparHub',
      type: 'website',
      url: `/${locale}`,
    },
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a1a4f',
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

// URL segment → BCP-47 for the <html lang> attribute (kz → kk).
const HTML_LANG: Record<string, string> = { ru: 'ru', kz: 'kk', en: 'en' }

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()

  // Enable static rendering for this locale.
  setRequestLocale(locale)

  const messages = await getMessages()

  return (
    <html lang={HTML_LANG[locale] ?? locale} className={`${golos.variable} ${jetbrains.variable}`}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <YandexMetrica />
            <MetricaIdentity />
            <Header />
            {children}
            <Footer />
            <FloatingChat />
            <BottomNav />
            <CartAddedPopup />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
