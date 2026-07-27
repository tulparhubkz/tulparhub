// Structured content model for the long-form legal pages (oferta, privacy,
// returns, requisites). These documents are far too long to route through the
// UI dictionary (lib/i18n), so they live here as typed, per-locale content and
// are rendered by <LegalArticle>. Russian is the authoritative text; KZ/EN are
// translations provided for convenience.
import type { Locale } from '@/i18n/routing'

export type { Locale }

// A block is one renderable chunk inside a section.
export type LegalBlock =
  // A paragraph of prose.
  | { type: 'p'; text: string }
  // A bullet list.
  | { type: 'list'; items: string[] }
  // A definition / key-value list (used by the requisites page).
  | { type: 'fields'; items: { label: string; value: string }[] }
  // A highlighted note / callout.
  | { type: 'note'; text: string }

export type LegalSection = {
  // Optional heading. Sections are auto-numbered when `numbered` is set on the
  // doc; a section without a heading renders its blocks with no header.
  heading?: string
  blocks: LegalBlock[]
}

export type LegalDoc = {
  title: string
  // Human-readable "last updated" / effective date line.
  updated: string
  // Optional lead paragraph shown under the title in the hero.
  intro?: string
  // When true, sections with a heading get an auto "N." prefix.
  numbered?: boolean
  sections: LegalSection[]
}

export type LegalContent = Record<Locale, LegalDoc>

// URL slugs for the four legal pages.
export const LEGAL_SLUGS = ['oferta', 'privacy', 'returns', 'requisites'] as const
export type LegalSlug = (typeof LEGAL_SLUGS)[number]
