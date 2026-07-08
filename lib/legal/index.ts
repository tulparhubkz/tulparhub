// Aggregates the four legal documents so pages can look one up by slug.
import type { LegalContent, LegalSlug } from './types'
import { oferta } from './oferta'
import { privacy } from './privacy'
import { returns } from './returns'
import { requisites } from './requisites'

export type { LegalDoc, LegalSlug, LegalBlock, LegalSection } from './types'
export { LEGAL_SLUGS } from './types'

export const LEGAL_DOCS: Record<LegalSlug, LegalContent> = {
  oferta,
  privacy,
  returns,
  requisites,
}
