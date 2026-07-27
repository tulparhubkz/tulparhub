import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import type { LegalDoc } from '@/lib/legal'
import { LegalSections } from './LegalSections'

// "Home" breadcrumb label per locale. Kept local so this stays a plain server
// component (no next-intl hook / async translation setup needed for one word).
const HOME_LABEL: Record<Locale, string> = { ru: 'Главная', kz: 'Басты бет', en: 'Home' }

// Presentational renderer for any legal document (oferta / privacy / returns /
// requisites). Server component — the legal pages have no interactivity.
export function LegalArticle({ doc, locale }: { doc: LegalDoc; locale: Locale }) {
  return (
    <>
      <div className="lg-hero">
        <div className="lg-hero-inner">
          <div className="crumbs" style={{ marginBottom: 20, fontSize: 13 }}>
            <Link href="/">{HOME_LABEL[locale]}</Link>
            {' / '}
            <span>{doc.title}</span>
          </div>
          <h1>{doc.title}</h1>
          {doc.intro && <p>{doc.intro}</p>}
          <div className="lg-updated">{doc.updated}</div>
        </div>
      </div>

      <main className="lg-page">
        <LegalSections doc={doc} />
      </main>
    </>
  )
}
