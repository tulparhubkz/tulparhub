const icons: Record<string, JSX.Element> = {
  engine: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="10" rx="2"/>
      <path d="M7 8V6a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2"/>
      <line x1="12" y1="8" x2="12" y2="18"/>
      <line x1="7" y1="13" x2="17" y2="13"/>
      <path d="M3 11H1M3 15H1M21 11h2M21 15h2"/>
    </svg>
  ),
  suspension: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="18" r="3"/>
      <circle cx="18" cy="18" r="3"/>
      <path d="M6 15V9l4-5h4l4 5v6"/>
      <line x1="6" y1="9" x2="18" y2="9"/>
      <path d="M10 9V5M14 9V5"/>
    </svg>
  ),
  electrical: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2 4.5 13.5H12l-1 8.5 8.5-11.5H12l1-8.5z"/>
    </svg>
  ),
  transmission: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <circle cx="4" cy="6" r="2"/>
      <circle cx="20" cy="6" r="2"/>
      <circle cx="4" cy="18" r="2"/>
      <circle cx="20" cy="18" r="2"/>
      <line x1="6" y1="7" x2="10" y2="11"/>
      <line x1="18" y1="7" x2="14" y2="11"/>
      <line x1="6" y1="17" x2="10" y2="13"/>
      <line x1="18" y1="17" x2="14" y2="13"/>
    </svg>
  ),
  cabin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 17V9l5-6h10l5 6v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z"/>
      <path d="M2 13h20"/>
      <path d="M9 21V13M15 21V13"/>
      <rect x="8" y="5" width="8" height="5" rx="1"/>
    </svg>
  ),
  brakes: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2"/>
      <path d="M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M6.3 17.7l1.4-1.4M16.3 7.7l1.4-1.4"/>
    </svg>
  ),
  filters: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 4h18l-7 8v7l-4-2V12L3 4z"/>
    </svg>
  ),
  steering: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <circle cx="12" cy="12" r="2"/>
      <line x1="12" y1="3" x2="12" y2="10"/>
      <path d="M3.9 17c1.8-2 4.9-3 8.1-3s6.3 1 8.1 3"/>
    </svg>
  ),
  axle: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5" cy="12" r="3"/>
      <circle cx="19" cy="12" r="3"/>
      <line x1="8" y1="12" x2="16" y2="12"/>
      <path d="M5 9V5M19 9V5M5 15v4M19 15v4"/>
    </svg>
  ),
  fuel: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 22V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/>
      <path d="M2 22h14"/>
      <path d="M16 8h2a2 2 0 0 1 2 2v3a1 1 0 0 0 1 1h0a1 1 0 0 0 1-1V9l-3-3"/>
      <line x1="8" y1="10" x2="12" y2="10"/>
    </svg>
  ),
  cooling: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 2v4M12 18v4M4.2 4.2l2.8 2.8M17 17l2.8 2.8M2 12h4M18 12h4M4.2 19.8l2.8-2.8M17 7l2.8-2.8"/>
      <path d="M12 9V5M12 19v-4" strokeOpacity="0.3"/>
    </svg>
  ),
  pneumatics: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z"/>
      <circle cx="12" cy="9" r="2.5"/>
      <path d="M6 20h12"/>
    </svg>
  ),
}

const tones = ['a','b','c','d','e','f','g','h','a','b','c','d']
const order = ['engine','suspension','electrical','transmission','cabin','brakes','filters','steering','axle','fuel','cooling','pneumatics']

export function SysGlyph({ id, size = 28 }: { id: string; size?: number }) {
  const tone = tones[order.indexOf(id)] ?? 'a'
  const icon = icons[id]
  return (
    <div
      className={`sys-glyph sys-${tone}`}
      style={{ width: size, height: size, padding: size * 0.18 }}
    >
      {icon ?? <span style={{ fontSize: size * 0.45 }}>·</span>}
    </div>
  )
}
