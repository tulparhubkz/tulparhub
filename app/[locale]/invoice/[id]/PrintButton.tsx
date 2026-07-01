'use client'

export function PrintButton() {
  return (
    <button className="inv-print" onClick={() => window.print()}>
      🖨 Распечатать / Сохранить PDF
    </button>
  )
}
