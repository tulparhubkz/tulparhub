// Merges every message namespace into one flat dictionary per language. Each
// namespace lives in ./messages/* and locks its KZ/EN keys to its RU keys, so
// the three languages stay in sync. Add a new page's strings by creating a new
// module and spreading it here.
import { chrome } from './messages/chrome'
import { home } from './messages/home'
import { about } from './messages/about'
import { warranty } from './messages/warranty'
import { rental } from './messages/rental'
import { vin } from './messages/vin'
import { podbor } from './messages/podbor'
import { commerce } from './messages/commerce'
import { catalog } from './messages/catalog'
import { components } from './messages/components'
import type { Lang } from './config'

export type { Lang } from './config'

export const dictionaries = {
  RU: { ...chrome.RU, ...home.RU, ...about.RU, ...warranty.RU, ...rental.RU, ...vin.RU, ...podbor.RU, ...commerce.RU, ...catalog.RU, ...components.RU },
  KZ: { ...chrome.KZ, ...home.KZ, ...about.KZ, ...warranty.KZ, ...rental.KZ, ...vin.KZ, ...podbor.KZ, ...commerce.KZ, ...catalog.KZ, ...components.KZ },
  EN: { ...chrome.EN, ...home.EN, ...about.EN, ...warranty.EN, ...rental.EN, ...vin.EN, ...podbor.EN, ...commerce.EN, ...catalog.EN, ...components.EN },
} satisfies Record<Lang, Record<string, string>>

export type TranslationKey = keyof typeof dictionaries.RU

// next-intl consumes nested message objects and resolves the dotted path in
// `t('a.b.c')`. Our dictionaries use flat dotted keys as the source of truth
// (typed, parity-checked), so we expand them into a nested tree at request time.
type Nested = { [k: string]: string | Nested }

function unflatten(flat: Record<string, string>): Nested {
  const out: Nested = {}
  for (const [key, value] of Object.entries(flat)) {
    const parts = key.split('.')
    let node = out
    for (let i = 0; i < parts.length - 1; i++) {
      node[parts[i]] = (node[parts[i]] as Nested) ?? {}
      node = node[parts[i]] as Nested
    }
    node[parts[parts.length - 1]] = value
  }
  return out
}

const LOCALE_TO_LANG: Record<string, Lang> = { ru: 'RU', kz: 'KZ', en: 'EN' }

export function messagesFor(locale: string): Nested {
  return unflatten(dictionaries[LOCALE_TO_LANG[locale] ?? 'RU'])
}
