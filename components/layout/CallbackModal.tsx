'use client'
import { useRef, useState } from 'react'
import { Ico } from '@/components/ui/Ico'
import { useT } from '@/lib/i18n'
import { isValidPhone, phoneInputValue } from '@/lib/validation'
import { submitOrder } from '@/app/actions'
import { useCart } from '@/store/cart'

export function CallbackModal({ onClose }: { onClose: () => void }) {
  const t = useT()
  const { city } = useCart()
  const nameRef  = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const [error, setError]     = useState('')
  const [done, setDone]       = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (loading) return
    const name  = nameRef.current?.value?.trim()
    const phone = phoneRef.current?.value?.trim()
    if (!name)  { setError(t('cart.toast.enterName')); return }
    if (!phone) { setError(t('cart.toast.enterPhone')); return }
    if (!isValidPhone(phone)) { setError(t('cart.toast.badPhone')); return }
    setError('')
    setLoading(true)
    try {
      const res = await submitOrder({ kind: 'callback', name, phone, city })
      if (res.ok) setDone(t(res.message, res.params))
      else setError(t(res.message, res.params))
    } catch {
      setError(t('cart.toast.connError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 400 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{t('header.callback')}</h3>
          <button type="button" onClick={onClose}><Ico name="close" size={16} /></button>
        </div>

        {done ? (
          <div style={{ padding: '28px 4px', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>📞</div>
            <p style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.6 }}>{done}</p>
            <button className="btn btn-primary" style={{ marginTop: 18 }} onClick={onClose}>OK</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 6 }}>
            <p style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.5 }}>{t('cb.sub')}</p>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 13, color: 'var(--ink-2)' }}>
              {t('cb.name')}
              <input ref={nameRef} autoFocus placeholder={t('cart.namePlaceholder')}
                style={{ padding: '11px 13px', border: '1.5px solid var(--line-2)', borderRadius: 10, fontSize: 15 }} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 13, color: 'var(--ink-2)' }}>
              {t('bs.phone')}
              <input ref={phoneRef} type="tel" placeholder="+7 (700) 000-00-00"
                onChange={(e) => { e.target.value = phoneInputValue(e) }}
                style={{ padding: '11px 13px', border: '1.5px solid var(--line-2)', borderRadius: 10, fontSize: 15 }} />
            </label>
            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '9px 12px', color: '#dc2626', fontSize: 13 }}>
                {error}
              </div>
            )}
            <button className="btn btn-primary" disabled={loading} onClick={submit} style={{ padding: '12px 0', fontSize: 15 }}>
              {loading ? t('cart.submitting') : t('cb.send')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
