'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useGarage, type GarageVehicle } from '@/store/garage'

function TruckIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7V8z"/>
      <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  )
}

function EditModal({ vehicle, onClose }: { vehicle: GarageVehicle; onClose: () => void }) {
  const { updateVehicle, removeVehicle } = useGarage()
  const [name, setName] = useState(vehicle.name)
  const [note, setNote] = useState(vehicle.note)

  const save = () => {
    updateVehicle(vehicle.id, { name: name.trim() || vehicle.vin, note: note.trim() })
    onClose()
  }

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
          <div className="gp-car-icon"><TruckIcon /></div>
          <div>
            <div className="gp-car-name-lg">{vehicle.name}</div>
            <div className="gp-car-vin">{vehicle.vin}</div>
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

        <button className="gp-save-btn" onClick={save}>Сохранить</button>
      </div>
    </div>
  )
}

function AddForm({ onBack }: { onBack: () => void }) {
  const { addVehicle } = useGarage()
  const [vin, setVin] = useState('')
  const [error, setError] = useState('')

  const submit = () => {
    const v = vin.trim()
    if (!v) { setError('Введите VIN или номер кузова'); return }
    if (v.length < 5) { setError('Слишком короткий номер'); return }
    addVehicle(v)
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
          onChange={e => { setVin(e.target.value); setError('') }}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="VIN-номер, код или номер кузова"
          className={error ? 'err' : ''}
        />
        {error && <div className="gp-error">{error}</div>}
      </div>
      <p className="gp-hint">
        Введите VIN-номер, и мы поможем подобрать нужные запчасти для вашей техники.
      </p>
      <button className="gp-add-btn" onClick={submit}>Добавить</button>
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
                <div className="gp-empty-icon"><TruckIcon /></div>
                <p>Гараж пуст</p>
                <span>Добавьте технику для быстрого поиска запчастей</span>
              </div>
            ) : (
              <div className="gp-list">
                {vehicles.map(v => (
                  <div key={v.id} className="gp-car-card" onClick={() => setEditing(v)}>
                    <div className="gp-car-icon-sm"><TruckIcon /></div>
                    <div className="gp-car-info">
                      <div className="gp-car-name">{v.name}</div>
                      <div className="gp-car-vin">{v.vin}</div>
                    </div>
                    <Link
                      href={`/catalog?q=${encodeURIComponent(v.vin)}`}
                      className="gp-find-btn"
                      onClick={e => e.stopPropagation()}
                    >
                      Подобрать запчасти
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
