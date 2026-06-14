import React from 'react'
import { Ico } from './Ico'

interface BtnProps {
  children: React.ReactNode
  variant?: 'primary' | 'dark' | 'ghost' | 'success'
  size?: 'sm' | 'md' | 'lg'
  icon?: string
  iconRight?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  full?: boolean
  className?: string
}

export function Btn({
  children, variant = 'primary', size = 'md', icon, iconRight,
  onClick, type = 'button', disabled, full, className = '',
}: BtnProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`btn btn-${variant} btn-${size} ${full ? 'btn-full' : ''} ${className}`}
    >
      {icon && <Ico name={icon} size={size === 'sm' ? 14 : 16} />}
      <span>{children}</span>
      {iconRight && <Ico name={iconRight} size={size === 'sm' ? 14 : 16} />}
    </button>
  )
}
