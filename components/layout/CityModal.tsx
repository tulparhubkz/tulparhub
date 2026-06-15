'use client'
import { useState } from 'react'
import { cities } from '@/lib/data'
import { useCart } from '@/store/cart'
import { Ico } from '@/components/ui/Ico'

export function CityModal({ onClose }: { onClose: () => void }) {
  const { city, setCity } = useCart()
  const [q, setQ] = useState('')

  const filtered = q.trim()
    ? cities.filter(c => c.name.toLowerCase().includes(q.toLowerCase()))
    : cities

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>Выберите город</h3>
          <button type="button" onClick={onClose}><Ico name="close" size={16} /></button>
        </div>

        {/* Search */}
        <div className="city-search">
          <Ico name="search" size={15} />
          <input
            autoFocus
            placeholder="Поиск города..."
            value={q}
            onChange={e => setQ(e.target.value)}
          />
          {q && (
            <button type="button" onClick={() => setQ('')}>
              <Ico name="close" size={13} />
            </button>
          )}
        </div>

        <div className="city-grid">
          {filtered.length === 0 ? (
            <div style={{ gridColumn: '1/-1', padding: '20px 0', textAlign: 'center', color: 'var(--ink-3)', fontSize: 14 }}>
              Город не найден
            </div>
          ) : filtered.map((c) => (
            <button
              key={c.id}
              className={`city-card ${city === c.name ? 'on' : ''}`}
              onClick={() => { setCity(c.name); onClose() }}
            >
              <Ico name="pin" size={16} />
              <div>
                <div className="city-card-name">{c.name}</div>
                <div className="city-card-sub">{c.country} · {c.currency}</div>
              </div>
              {city === c.name && <Ico name="check" size={16} />}
            </button>
          ))}
        </div>

        <div className="modal-foot">
          <span>Город влияет на наличие товаров и цены.</span>
        </div>
      </div>
    </div>
  )
}
