import { defineRouting } from 'next-intl/routing'

// URL-facing locale codes. `kz` is used as the segment (the market convention);
// the <html lang> is mapped to the BCP-47 `kk` in the [locale] layout.
export const routing = defineRouting({
  locales: ['ru', 'kz', 'en'],
  defaultLocale: 'ru',
  // KZ-market convention (like kaspi.kz): everyone lands on RU regardless of
  // browser Accept-Language; switching is always explicit via the UI.
  localeDetection: false,
})

export type Locale = (typeof routing.locales)[number]
