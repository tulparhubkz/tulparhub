'use client'
import { cities } from '@/lib/data'
import { useCart } from '@/store/cart'
import { Ico } from '@/components/ui/Ico'

export function CityModal({ onClose }: { onClose: () => void }) {
  const { city, setCity } = useCart()

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>Выберите город</h3>
          <button type="button" onClick={onClose}><Ico name="close" size={16} /></button>
        </div>
        <div className="city-grid">
          {cities.map((c) => (
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
