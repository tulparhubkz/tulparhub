const map: Record<string, { sym: string; tone: string }> = {
  engine:  { sym: 'E', tone: 'a' },
  trans:   { sym: '⟳', tone: 'b' },
  hydro:   { sym: 'H', tone: 'c' },
  chassis: { sym: '⌂', tone: 'd' },
  brakes:  { sym: 'B', tone: 'e' },
  elec:    { sym: '⚡', tone: 'f' },
  cab:     { sym: '▢', tone: 'g' },
  cool:    { sym: '≋', tone: 'h' },
  fuel:    { sym: 'F', tone: 'a' },
  steer:   { sym: '◯', tone: 'b' },
  filter:  { sym: '⏃', tone: 'c' },
  under:   { sym: '▤', tone: 'd' },
}

export function SysGlyph({ id, size = 28 }: { id: string; size?: number }) {
  const m = map[id] ?? { sym: '·', tone: 'a' }
  return (
    <div
      className={`sys-glyph sys-${m.tone}`}
      style={{ width: size, height: size, fontSize: size * 0.45 }}
    >
      {m.sym}
    </div>
  )
}
