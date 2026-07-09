'use client'
import { useEffect } from 'react'
import { useLocale } from 'next-intl'
import { Ico } from '@/components/ui/Ico'
import type { Locale } from '@/i18n/routing'
import { oferta } from '@/lib/legal/oferta'
import { privacy } from '@/lib/legal/privacy'
import { resolveLocale } from './resolveLocale'
import { LegalSections } from './LegalSections'

// Only the documents a user consents to at signup. Imported one by one rather
// than through LEGAL_DOCS so the other two don't ship in the wizard's bundle.
const DOCS = { oferta, privacy }

export type LegalModalSlug = keyof typeof DOCS

const CLOSE_LABEL: Record<Locale, string> = { ru: 'Закрыть', kz: 'Жабу', en: 'Close' }

// Shows a legal document in a scrollable popup. Used where navigating to the
// document's own page is not possible — notably the signup wizard, which a
// half-onboarded user cannot leave.
export function LegalModal({ slug, onClose }: { slug: LegalModalSlug; onClose: () => void }) {
  const locale = resolveLocale(useLocale())
  const doc = DOCS[slug][locale]

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="lg-modal" role="dialog" aria-modal="true" aria-label={doc.title} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{doc.title}</h3>
          <button type="button" onClick={onClose} aria-label={CLOSE_LABEL[locale]}>
            <Ico name="close" size={16} />
          </button>
        </div>
        <div className="lg-modal-updated">{doc.updated}</div>

        <div className="lg-modal-body">
          {doc.intro && <p className="lg-modal-intro">{doc.intro}</p>}
          <LegalSections doc={doc} />
        </div>
      </div>
    </div>
  )
}
