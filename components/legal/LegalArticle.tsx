import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import type { LegalDoc } from '@/lib/legal'

// "Home" breadcrumb label per locale. Kept local so this stays a plain server
// component (no next-intl hook / async translation setup needed for one word).
const HOME_LABEL: Record<Locale, string> = { ru: 'Главная', kz: 'Басты бет', en: 'Home' }

// Presentational renderer for any legal document (oferta / privacy / returns /
// requisites). Server component — the legal pages have no interactivity.
export function LegalArticle({ doc, locale }: { doc: LegalDoc; locale: Locale }) {
  let num = 0
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
        {doc.sections.map((section, si) => {
          const heading = section.heading
          const prefix = heading && doc.numbered ? `${(num += 1)}. ` : ''
          return (
            <section className="lg-section" key={si}>
              {heading && (
                <h2>
                  {prefix}
                  {heading}
                </h2>
              )}
              {section.blocks.map((block, bi) => {
                switch (block.type) {
                  case 'p':
                    return <p key={bi}>{block.text}</p>
                  case 'note':
                    return (
                      <p className="lg-note" key={bi}>
                        {block.text}
                      </p>
                    )
                  case 'list':
                    return (
                      <ul className="lg-list" key={bi}>
                        {block.items.map((item, ii) => (
                          <li key={ii}>{item}</li>
                        ))}
                      </ul>
                    )
                  case 'fields':
                    return (
                      <dl className="lg-fields" key={bi}>
                        {block.items.map((f, fi) => (
                          <div className="lg-field" key={fi}>
                            <dt>{f.label}</dt>
                            <dd>{f.value}</dd>
                          </div>
                        ))}
                      </dl>
                    )
                }
              })}
            </section>
          )
        })}
      </main>
    </>
  )
}
