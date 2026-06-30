'use client'
import { useEffect, useState } from 'react'
import { useCart } from '@/store/cart'
import {
  dictionaries,
  DEFAULT_LANG,
  HTML_LANG,
  type Lang,
  type TranslationKey,
} from './dictionaries'

export { LANGS, DEFAULT_LANG } from './dictionaries'
export type { Lang, TranslationKey } from './dictionaries'

// The selected language is persisted in the cart store (localStorage). On the
// server and the first client paint we always use DEFAULT_LANG so the rendered
// markup matches the SSR output; once mounted we switch to the stored value.
// This avoids hydration mismatches when a user has picked KZ/EN. It also keeps
// <html lang> in sync for accessibility/SEO.
export function useLang(): Lang {
  const stored = useCart((s) => s.lang)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const lang = mounted ? stored : DEFAULT_LANG

  useEffect(() => {
    if (mounted) document.documentElement.lang = HTML_LANG[lang]
  }, [mounted, lang])

  return lang
}

export type TFunction = (key: TranslationKey) => string

export function useT(): TFunction {
  const lang = useLang()
  return (key) => dictionaries[lang][key] ?? dictionaries[DEFAULT_LANG][key] ?? key
}
