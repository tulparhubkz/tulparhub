interface PlaceholderProps {
  label?: string
  ratio?: string
  tone?: 'warm' | 'dark'
}

export function Placeholder({ label = '', ratio = '4/3', tone = 'warm' }: PlaceholderProps) {
  const bg = tone === 'dark' ? '#1a1a1c' : '#efece4'
  const fg = tone === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'

  return (
    <div
      className="ph"
      style={{
        aspectRatio: ratio,
        background: bg,
      }}
    >
      <div
        className="ph-stripes"
        style={{
          backgroundImage: `repeating-linear-gradient(135deg, ${fg} 0 8px, transparent 8px 24px)`,
        }}
      />
      <span className="ph-label">{label}</span>
    </div>
  )
}
