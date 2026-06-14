'use client'

interface CrumbItem {
  label: string
  href?: string
  onClick?: () => void
}

interface CrumbsProps {
  items: CrumbItem[]
}

export function Crumbs({ items }: CrumbsProps) {
  return (
    <nav className="crumbs">
      {items.map((item, i) => (
        <span key={i} style={{ display: 'contents' }}>
          {i > 0 && <span className="crumbs-sep">/</span>}
          <button
            type="button"
            className={i === items.length - 1 ? 'on' : ''}
            onClick={item.onClick}
          >
            {item.label}
          </button>
        </span>
      ))}
    </nav>
  )
}
