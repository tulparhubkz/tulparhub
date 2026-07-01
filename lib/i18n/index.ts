'use client'
// Thin client shim over next-intl so call sites keep using `t('dotted.key')`
// with our typed TranslationKey union. Language now lives in the URL locale
// (see i18n/routing.ts) and is provided via NextIntlClientProvider, so there is
// no more localStorage/hydration dance here.
import { useTranslations } from 'next-intl'
import type { TranslationKey } from './dictionaries'

export type { TranslationKey } from './dictionaries'

// URL locale codes and their display labels for the language switcher.
export const LOCALES = ['ru', 'kz', 'en'] as const
export type Locale = (typeof LOCALES)[number]
export const LOCALE_LABELS: Record<Locale, string> = { ru: 'RU', kz: 'KZ', en: 'EN' }

export function useT(): (key: TranslationKey) => string {
  const t = useTranslations()
  return t as unknown as (key: TranslationKey) => string
}
