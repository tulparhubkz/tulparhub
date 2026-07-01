// Internal language codes for the message dictionaries. These are the keys of
// each message namespace (RU/KZ/EN) and are mapped to URL locales (ru/kz/en) in
// lib/i18n/dictionaries.ts. The user-facing locale routing lives in i18n/routing.ts.
export const LANGS = ['RU', 'KZ', 'EN'] as const
export type Lang = (typeof LANGS)[number]
