'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Ico } from '@/components/ui/Ico'
import { Btn } from '@/components/ui/Btn'
import { Crumbs } from '@/components/ui/Crumbs'
import { SysGlyph } from '@/components/ui/SysGlyph'
import { brands, models, systems, subAssemblies } from '@/lib/data'

export default function PodborPage() {
  const router = useRouter()
  const [pick, setPick] = useState<{
    brand: string | null; model: string | null
    year: string | null; system: string | null
  }>({ brand: null, model: null, year: null, system: null })

  const step = !pick.brand ? 0 : !pick.model ? 1 : !pick.year ? 2 : !pick.system ? 3 : 4

  const steps = ['Производитель', 'Модель', 'Год выпуска', 'Система', 'Подузел']
  const brandObj = brands.find((b) => b.id === pick.brand)
  const modelObj = (models[pick.brand ?? ''] ?? []).find((m) => m.id === pick.model)

  const crumbs = [
    { label: 'Главная', onClick: () => router.push('/') },
    { label: 'Подбор по технике' },
  ]

  return (
    <main className="wizard">
      <div className="container">
        <Crumbs items={crumbs} />

        <div className="wiz-head">
          <h1>Подбор запчастей для грузовиков</h1>
          <p>Выберите тип и марку грузовика — покажем подходящие запчасти.</p>
        </div>

        {/* Progress */}
        <div className="wiz-progress">
          {steps.map((s, i) => (
            <span key={i} style={{ display: 'contents' }}>
              <div className={`wp-step ${i === step ? 'on' : ''} ${i < step ? 'done' : ''}`}>
                <span className="wp-num">
                  {i < step ? <Ico name="check" size={12} /> : i + 1}
                </span>
                <span className="wp-lbl">{s}</span>
              </div>
              {i < steps.length - 1 && <span className="wp-bar" />}
            </span>
          ))}
        </div>

        <div className="wiz-layout">
          <div>
            {/* Step 0: Brand */}
            {step === 0 && (
              <div className="wiz-grid wiz-grid-4">
                {brands.map((b) => (
                  <button key={b.id} className="wiz-card wiz-card-brand" onClick={() => setPick({ ...pick, brand: b.id })}>
                    <div className="wiz-brand-mark">{b.name[0]}</div>
                    <div className="wiz-card-name">{b.name}</div>
                    <div className="wiz-card-sub">{b.models} моделей · {b.parts?.toLocaleString('ru')} запч.</div>
                  </button>
                ))}
              </div>
            )}

            {/* Step 1: Model */}
            {step === 1 && (
              <>
                <button className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }} onClick={() => setPick({ ...pick, brand: null })}>
                  <Ico name="arrowLeft" size={14} /> Назад
                </button>
                <div className="wiz-grid wiz-grid-3">
                  {(models[pick.brand ?? ''] ?? []).length ? (
                    (models[pick.brand ?? ''] ?? []).map((m) => (
                      <button key={m.id} className="wiz-card wiz-card-model" onClick={() => setPick({ ...pick, model: m.id })}>
                        <div className="wiz-model-mark"><Ico name="truck" size={32} /></div>
                        <div className="wiz-card-name">{brandObj?.name} {m.name}</div>
                        <div className="wiz-card-sub">{m.cls} · {m.years}</div>
                      </button>
                    ))
                  ) : (
                    <div className="wiz-empty">
                      <Ico name="info" size={18} />
                      <div><b>Для {brandObj?.name} модели уточняются.</b>
                        <p>Оставьте заявку — менеджер подберёт по VIN или фото шильдика.</p></div>
                      <Btn variant="primary" size="sm">Оставить заявку</Btn>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Step 2: Year */}
            {step === 2 && (
              <>
                <button className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }} onClick={() => setPick({ ...pick, model: null })}>
                  <Ico name="arrowLeft" size={14} /> Назад
                </button>
                <div className="wiz-grid wiz-grid-4">
                  {['2024', '2022–2023', '2019–2021', '2015–2018', '2010–2014', 'до 2010'].map((y) => (
                    <button key={y} className="wiz-card wiz-card-year" onClick={() => setPick({ ...pick, year: y })}>
                      <div className="wiz-card-name">{y}</div>
                      <div className="wiz-card-sub">{modelObj?.name}</div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Step 3: System */}
            {step === 3 && (
              <>
                <button className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }} onClick={() => setPick({ ...pick, year: null })}>
                  <Ico name="arrowLeft" size={14} /> Назад
                </button>
                <div className="wiz-grid wiz-grid-4">
                  {systems.map((s) => (
                    <button key={s.id} className="wiz-card wiz-card-sys" onClick={() => setPick({ ...pick, system: s.id })}>
                      <SysGlyph id={s.id} size={40} />
                      <div className="wiz-card-name">{s.ru}</div>
                      <div className="wiz-card-sub">{s.count} артикулов</div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Step 4: Sub-assembly */}
            {step === 4 && (
              <>
                <button className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }} onClick={() => setPick({ ...pick, system: null })}>
                  <Ico name="arrowLeft" size={14} /> Назад
                </button>
                <div className="wiz-final">
                  <div className="wiz-grid wiz-grid-3">
                    {(subAssemblies[pick.system ?? ''] ?? subAssemblies.engine).map((sa) => (
                      <button
                        key={sa}
                        className="wiz-card wiz-card-sub"
                        onClick={() => router.push(`/catalog?brand=${pick.brand}&model=${pick.model}&system=${pick.system}`)}
                      >
                        <div className="wiz-sub-mark">→</div>
                        <div className="wiz-card-name">{sa}</div>
                        <div className="wiz-card-sub">показать все</div>
                      </button>
                    ))}
                  </div>
                  <div className="wiz-cta">
                    <Btn
                      variant="primary" size="lg" iconRight="arrow"
                      onClick={() => router.push(`/catalog?brand=${pick.brand}&model=${pick.model}&system=${pick.system}`)}
                    >
                      Показать все запчасти по системе
                    </Btn>
                    <span>Найдено {systems.find((s) => s.id === pick.system)?.count} артикулов</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Aside */}
          <aside className="wiz-aside">
            <div className="wiz-aside-card">
              <h4>Моя техника</h4>
              <p>Сохраните машину — на следующий раз пропустите этот мастер.</p>
              <div className="garage">
                <div className="garage-item">
                  <Ico name="truck" size={18} />
                  <div><div className="garage-name">KAMAZ 6520 #1</div><div className="garage-sub">2019 · самосвал</div></div>
                  <button>•••</button>
                </div>
                <button className="garage-add">+ Добавить технику</button>
              </div>
            </div>
            <div className="wiz-aside-card">
              <h4>Другие способы</h4>
              <div className="wiz-alt">
                <button><Ico name="vin" size={14} /> Подбор по VIN</button>
                <button><Ico name="barcode" size={14} /> Поиск по OEM</button>
                <button><Ico name="chat" size={14} /> Запрос менеджеру</button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
