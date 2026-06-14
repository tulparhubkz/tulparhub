import React from 'react'

interface IcoProps {
  name: string
  size?: number
  stroke?: number
  className?: string
}

const paths: Record<string, React.ReactNode> = {
  search: <><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></>,
  cart: <><path d="M3 4h2.5l2 12h11l2-8H6"/><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/></>,
  heart: <path d="M12 20s-7-4.3-7-10a4 4 0 0 1 7-2.7A4 4 0 0 1 19 10c0 5.7-7 10-7 10z"/>,
  list: <><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h10"/></>,
  user: <><circle cx="12" cy="8" r="3.5"/><path d="M5 20c1.3-3.5 4-5 7-5s5.7 1.5 7 5"/></>,
  phone: <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z"/>,
  pin: <><path d="M12 21s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></>,
  truck: <><rect x="2" y="7" width="11" height="9" rx="1"/><path d="M13 10h5l3 3v3h-8"/><circle cx="7" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/></>,
  excavator: <><rect x="2" y="15" width="11" height="3" rx="1"/><circle cx="5" cy="19" r="1.4"/><circle cx="10" cy="19" r="1.4"/><path d="M7 15v-3h4l3-5 5 1-2 5-3 2"/></>,
  loader: <><rect x="3" y="13" width="10" height="4" rx="1"/><circle cx="6" cy="19" r="1.6"/><circle cx="11" cy="19" r="1.6"/><path d="M13 14l5-4 4 1v3l-4 1"/></>,
  dozer: <><rect x="5" y="12" width="10" height="5" rx="1"/><circle cx="7" cy="19" r="1.4"/><circle cx="13" cy="19" r="1.4"/><path d="M18 9v10h2"/></>,
  crane: <><path d="M4 19h16"/><path d="M8 19V8h2v11"/><path d="M9 8l11-3"/><path d="M9 12l8-2"/></>,
  mixer: <><circle cx="14" cy="13" r="5"/><path d="M2 17h7"/><circle cx="6" cy="19" r="1.4"/><path d="M14 8v10"/></>,
  dump: <><rect x="2" y="9" width="9" height="7"/><path d="M11 14l9-3v5h-9"/><circle cx="6" cy="19" r="1.6"/><circle cx="17" cy="19" r="1.6"/></>,
  grader: <><path d="M3 17h18"/><path d="M6 17l4-7h6l4 7"/><circle cx="8" cy="19" r="1.3"/><circle cx="16" cy="19" r="1.3"/></>,
  roller: <><circle cx="7" cy="15" r="4"/><rect x="11" y="9" width="9" height="7" rx="1"/><circle cx="16" cy="18" r="1.4"/></>,
  chevron: <path d="m9 6 6 6-6 6"/>,
  chevDown: <path d="m6 9 6 6 6-6"/>,
  plus: <><path d="M12 5v14"/><path d="M5 12h14"/></>,
  minus: <path d="M5 12h14"/>,
  close: <><path d="m6 6 12 12"/><path d="m18 6-12 12"/></>,
  check: <path d="m5 12 5 5 9-11"/>,
  filter: <path d="M3 5h18l-7 9v5l-4 1v-6L3 5z"/>,
  grid: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>,
  rows: <><path d="M3 6h18"/><path d="M3 12h18"/><path d="M3 18h18"/></>,
  star: <path d="m12 4 2.5 5.2 5.7.8-4.1 4 1 5.6L12 17l-5.1 2.6 1-5.6-4.1-4 5.7-.8z"/>,
  info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><circle cx="12" cy="8" r=".5" fill="currentColor"/></>,
  pdf: <><rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 13h6"/><path d="M9 17h4"/></>,
  car: <><path d="M5 16V11l2-5h10l2 5v5"/><circle cx="8" cy="17" r="1.4"/><circle cx="16" cy="17" r="1.4"/><path d="M4 12h16"/></>,
  spark: <><path d="M12 3v3"/><path d="M12 18v3"/><path d="M3 12h3"/><path d="M18 12h3"/><path d="m6 6 2 2"/><path d="m16 16 2 2"/><path d="m6 18 2-2"/><path d="m16 8 2-2"/></>,
  bolt: <path d="M13 3 4 14h7l-1 7 9-11h-7l1-7z"/>,
  cal: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18"/><path d="M8 3v4"/><path d="M16 3v4"/></>,
  chat: <path d="M21 12a7.5 7.5 0 0 1-11 6.5L4 20l1.5-5A7.5 7.5 0 1 1 21 12z"/>,
  bag: <><path d="M6 7h12l-1 14H7L6 7z"/><path d="M9 7a3 3 0 0 1 6 0"/></>,
  arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
  arrowLeft: <><path d="M19 12H5"/><path d="m11 6-6 6 6 6"/></>,
  barcode: <><path d="M4 5v14"/><path d="M7 5v14"/><path d="M9 5v14"/><path d="M12 5v14"/><path d="M14 5v14"/><path d="M17 5v14"/><path d="M20 5v14"/></>,
  vin: <><rect x="3" y="6" width="18" height="12" rx="1"/><path d="M6 10v4"/><path d="M9 10v4"/><path d="M12 10v4"/><path d="M15 10v4"/><path d="M18 10v4"/></>,
}

export function Ico({ name, size = 18, stroke = 1.6, className = '' }: IcoProps) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {paths[name] ?? null}
    </svg>
  )
}
