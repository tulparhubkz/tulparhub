import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  tone?: string
}

export function Badge({ children, tone }: BadgeProps) {
  return <span className={`badge ${tone ?? ''}`}>{children}</span>
}

interface ChipProps {
  children: React.ReactNode
  tone?: string
  onClick?: () => void
  active?: boolean
}

export function Chip({ children, tone, onClick, active }: ChipProps) {
  return (
    <button type="button" onClick={onClick} className={`chip ${tone ?? ''} ${active ? 'on' : ''}`}>
      {children}
    </button>
  )
}
