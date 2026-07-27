import { routing, type Locale } from '@/i18n/routing'

// Narrows the raw `params.locale` string to a supported Locale, falling back to
// the default. Middleware already constrains the segment, but this keeps the
// legal pages type-safe when indexing the per-locale content.
export function resolveLocale(locale: string): Locale {
  return (routing.locales as readonly string[]).includes(locale)
    ? (locale as Locale)
    : routing.defaultLocale
}
