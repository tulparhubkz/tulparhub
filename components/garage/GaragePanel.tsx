'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useGarage, type GarageVehicle } from '@/store/garage'

function TruckIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7V8z"/>
      <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  )
}

function EditModal({ vehicle, onClose }: { vehicle: GarageVehicle; onClose: () => void }) {
  const { updateVehicle, removeVehicle } = useGarage()
  const [name, setName] = useState(vehicle.name)
  const [note, setNote] = useState(vehicle.note)

  return (
    <div className="gp-modal-backdrop" onClick={onClose}>
      <div className="gp-modal" onClick={e => e.stopPropagation()}>
        <div className="gp-modal-head">
          <h3>Редактировать технику</h3>
          <button onClick={onClose} className="gp-icon-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="gp-modal-car">
          <div className="gp-car-icon"><TruckIcon size={32} /></div>
          <div>
            <div className="gp-car-name-lg">{vehicle.name}</div>
            <div className="gp-car-vin">{vehicle.vin}</div>
            {vehicle.searchQuery && vehicle.searchQuery !== vehicle.vin && (
              <div style={{ fontSize: 12, color: 'var(--ok)', marginTop: 2 }}>
                → поиск по «{vehicle.searchQuery}»
              </div>
            )}
          </div>
          <button className="gp-del-btn" onClick={() => { removeVehicle(vehicle.id); onClose() }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          </button>
        </div>
        <div className="gp-field">
          <label>Название техники в гараже</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder={vehicle.vin} />
        </div>
        <div className="gp-field">
          <label>VIN / описание</label>
          <input value={note} onChange={e => setNote(e.target.value)} placeholder="Дополнительная информация" />
        </div>
        <button className="gp-save-btn" onClick={() => {
          updateVehicle(vehicle.id, { name: name.trim() || vehicle.vin, note: note.trim() })
          onClose()
        }}>Сохранить</button>
      </div>
    </div>
  )
}

function AddForm({ onBack }: { onBack: () => void }) {
  const { addVehicle } = useGarage()
  const [vin, setVin] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [decoded, setDecoded] = useState<{ brand: string; model: string; searchQuery: string; year?: number } | null>(null)

  const decode = async (value: string) => {
    setDecoded(null)
    setError('')
    const v = value.trim()
    if (v.length < 11) return
    setLoading(true)
    try {
      const res = await fetch(`/api/vin-decode?vin=${encodeURIComponent(v)}`)
      const data = await res.json()
      if (res.ok) setDecoded(data)
    } catch {}
    setLoading(false)
  }

  const submit = () => {
    const v = vin.trim()
    if (!v) { setError('Введите VIN или модель техники'); return }
    if (v.length < 3) { setError('Слишком короткое значение'); return }
    addVehicle(v, decoded ? `${decoded.brand} ${decoded.model}${decoded.year ? ` ${decoded.year}` : ''}` : '', decoded?.searchQuery)
    onBack()
  }

  return (
    <div className="gp-screen">
      <button className="gp-back" onClick={onBack}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        Назад
      </button>
      <h2 className="gp-title">Добавить технику</h2>

      <div className="gp-field" style={{ marginTop: 20 }}>
        <input
          autoFocus
          value={vin}
          onChange={e => { setVin(e.target.value); setError(''); decode(e.target.value) }}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="VIN-номер, код или модель (DAF XF105)"
          className={error ? 'err' : ''}
        />
        {error && <div className="gp-error">{error}</div>}
      </div>

      {/* VIN decode result */}
      {loading && <div className="gp-decode-box loading">Определяю технику...</div>}
      {decoded && !loading && (
        <div className="gp-decode-box ok">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <div>
            <div className="gp-decode-name">{decoded.brand} {decoded.model}{decoded.year ? ` · ${decoded.year} г.` : ''}</div>
            <div className="gp-decode-hint">Поиск запчастей: «{decoded.searchQuery}»</div>
          </div>
        </div>
      )}

      <p className="gp-hint">
        Введите VIN-номер для автоматического определения марки и модели, или вручную укажите модель (например: <b>MAN TGA</b>, <b>DAF XF105</b>).
      </p>

      <button className="gp-add-btn" onClick={submit}>Добавить технику</button>
    </div>
  )
}

export function GaragePanel({ onClose }: { onClose: () => void }) {
  const { vehicles } = useGarage()
  const [screen, setScreen] = useState<'list' | 'add'>('list')
  const [editing, setEditing] = useState<GarageVehicle | null>(null)

  return (
    <>
      <div className="gp-backdrop" onClick={onClose} />
      <div className="gp-panel">
        <div className="gp-panel-head">
          <span className="gp-panel-title">Мой гараж</span>
          <button className="gp-icon-btn" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {screen === 'add' ? (
          <AddForm onBack={() => setScreen('list')} />
        ) : (
          <div className="gp-screen">
            {vehicles.length === 0 ? (
              <div className="gp-empty">
                <div className="gp-empty-icon"><TruckIcon size={48} /></div>
                <p>Гараж пуст</p>
                <span>Добавьте технику для быстрого поиска запчастей</span>
              </div>
            ) : (
              <div className="gp-list">
                {vehicles.map(v => (
                  <div key={v.id} className="gp-car-card" onClick={() => setEditing(v)}>
                    <div className="gp-car-icon-sm" style={{ color: 'var(--accent)' }}><TruckIcon size={28} /></div>
                    <div className="gp-car-info">
                      <div className="gp-car-name">{v.name}</div>
                      <div className="gp-car-vin">{v.vin}</div>
                    </div>
                    <Link
                      href={`/catalog?q=${encodeURIComponent(v.searchQuery || v.vin)}`}
                      className="gp-find-btn"
                      onClick={e => e.stopPropagation()}
                    >
                      Запчасти →
                    </Link>
                  </div>
                ))}
              </div>
            )}
            <button className="gp-add-btn" style={{ marginTop: 16 }} onClick={() => setScreen('add')}>
              + Добавить технику
            </button>
          </div>
        )}
      </div>

      {editing && <EditModal vehicle={editing} onClose={() => setEditing(null)} />}
    </>
  )
}
