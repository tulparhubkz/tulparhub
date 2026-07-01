import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'
import { messagesFor } from '@/lib/i18n/dictionaries'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }
  return { locale, messages: messagesFor(locale) }
})
