import type { LegalDoc } from '@/lib/legal'

// Renders the body of a legal document: the numbered sections and their blocks.
// Shared by the full-page <LegalArticle> and the <LegalModal> popup, so both
// stay in sync. Plain (non-client) component — the markup has no interactivity.
export function LegalSections({ doc }: { doc: LegalDoc }) {
  let num = 0
  return (
    <>
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
    </>
  )
}
