'use client'
import { useEffect, useState } from 'react'
import { Ico } from './Ico'

export interface ToastItem {
  id: number
  msg: string
  icon?: string
}

interface ToastHostProps {
  toasts: ToastItem[]
  onClear: (id: number) => void
}

export function ToastHost({ toasts, onClear }: ToastHostProps) {
  return (
    <div className="toast-host">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onClear={onClear} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onClear }: { toast: ToastItem; onClear: (id: number) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onClear(toast.id), 3200)
    return () => clearTimeout(timer)
  }, [toast.id, onClear])

  return (
    <div className="toast">
      <Ico name={toast.icon ?? 'check'} size={16} />
      <span>{toast.msg}</span>
    </div>
  )
}
