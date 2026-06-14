import { fmtKZT, fmtVAT } from '@/lib/utils'

interface PriceProps {
  value: number
  vat?: number
  showVAT?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function Price({ value, vat = 12, showVAT = true, size = 'md' }: PriceProps) {
  return (
    <div className={`price price-${size}`}>
      <div className="price-main">{fmtKZT(value)}</div>
      {showVAT && <div className="price-sub">без НДС {fmtKZT(fmtVAT(value, vat))}</div>}
    </div>
  )
}
