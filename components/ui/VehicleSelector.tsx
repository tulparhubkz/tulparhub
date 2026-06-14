'use client'
import { useState } from 'react'
import { brands, equipmentTypes, models } from '@/lib/data'
import { Ico } from './Ico'

interface VehiclePick {
  type: string | null
  brand: string | null
  model: string | null
}

interface VehicleSelectorProps {
  onComplete?: (pick: VehiclePick) => void
  compact?: boolean
}

export function VehicleSelector({ onComplete, compact = false }: VehicleSelectorProps) {
  const [step, setStep] = useState(0)
  const [pick, setPick] = useState<VehiclePick>({ type: null, brand: null, model: null })

  const steps = [
    {
      label: 'Тип техники',
      options: equipmentTypes.slice(0, 6).map((t) => ({
        id: t.id, label: t.ru, sub: `${t.count.toLocaleString('ru-RU')} запч.`,
      })),
      onPick: (id: string) => { setPick((p) => ({ ...p, type: id })); setStep(1) },
    },
    {
      label: 'Производитель',
      options: brands.slice(0, 8).map((b) => ({
        id: b.id, label: b.name, sub: `${b.models} мод.`,
      })),
      onPick: (id: string) => { setPick((p) => ({ ...p, brand: id })); setStep(2) },
    },
    {
      label: 'Модель',
      options: (models[pick.brand ?? ''] ?? []).map((m) => ({
        id: m.id, label: m.name, sub: m.cls,
      })),
      onPick: (id: string) => {
        const next = { ...pick, model: id }
        setPick(next)
        onComplete?.(next)
      },
    },
  ]

  const current = steps[step]

  return (
    <div className={`vs ${compact ? 'vs-compact' : ''}`}>
      <div className="vs-header">
        <div className="vs-steps">
          {steps.map((s, i) => (
            <div key={i} className={`vs-step ${i === step ? 'on' : ''} ${i < step ? 'done' : ''}`}>
              <span className="vs-num">{i + 1}</span>
              <span className="vs-lbl">{s.label}</span>
            </div>
          ))}
        </div>
        {step > 0 && (
          <button type="button" className="vs-back" onClick={() => setStep(step - 1)}>
            <Ico name="arrowLeft" size={14} /> Назад
          </button>
        )}
      </div>

      <div className="vs-options">
        {current.options.length ? current.options.map((o) => (
          <button key={o.id} className="vs-opt" onClick={() => current.onPick(o.id)}>
            <span className="vs-opt-label">{o.label}</span>
            <span className="vs-opt-sub">{o.sub}</span>
            <Ico name="chevron" size={14} />
          </button>
        )) : (
          <div className="vs-empty">
            Нет данных по модели — <a href="#">оставьте заявку</a>
          </div>
        )}
      </div>

      <div className="vs-foot">
        <span>Не нашли свою модель? <a href="/podbor">Подбор по VIN</a> · <a href="/catalog">Поиск по OEM-номеру</a></span>
      </div>
    </div>
  )
}
