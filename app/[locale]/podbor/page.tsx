'use client'
import { useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { Link } from '@/i18n/navigation'
import { Ico } from '@/components/ui/Ico'
import { Btn } from '@/components/ui/Btn'
import { Crumbs } from '@/components/ui/Crumbs'
import { SysGlyph } from '@/components/ui/SysGlyph'
import { brands, models, systems, subAssemblies } from '@/lib/data'
import { useFacetCounts } from '@/lib/useFacetCounts'
import { useT } from '@/lib/i18n'
import { reachGoal } from '@/lib/analytics'

export default function PodborPage() {
  const router = useRouter()
  const t = useT()
  const facets = useFacetCounts()
  const [pick, setPick] = useState<{
    brand: string | null; model: string | null
    year: string | null; system: string | null
  }>({ brand: null, model: null, year: null, system: null })

  const step = !pick.brand ? 0 : !pick.model ? 1 : !pick.year ? 2 : !pick.system ? 3 : 4

  const goToCatalog = () => {
    reachGoal('PODBOR_SUBMIT', { brand: pick.brand, model: pick.model, system: pick.system })
    router.push(`/catalog?brand=${pick.brand}&model=${pick.model}&system=${pick.system}`)
  }

  const steps = [t('podbor.step.brand'), t('podbor.step.model'), t('podbor.step.year'), t('podbor.step.system'), t('podbor.step.sub')]
  const brandObj = brands.find((b) => b.id === pick.brand)
  const modelObj = (models[pick.brand ?? ''] ?? []).find((m) => m.id === pick.model)

  const crumbs = [
    { label: t('common.home'), onClick: () => router.push('/') },
    { label: t('podbor.crumb') },
  ]

  const years = ['2024', '2022–2023', '2019–2021', '2015–2018', '2010–2014', t('podbor.yearBefore')]

  return (
    <main className="wizard">
      <div className="container">
        <Crumbs items={crumbs} />

        <div className="wiz-head">
          <h1>{t('podbor.title')}</h1>
          <p>{t('podbor.sub')}</p>
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
                    <div className="wiz-card-sub">{b.models} {t('podbor.modelsCount')} · {(facets?.brands[b.id] ?? 0).toLocaleString('ru')} {t('home.selector.partsShort')}</div>
                  </button>
                ))}
              </div>
            )}

            {/* Step 1: Model */}
            {step === 1 && (
              <>
                <button className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }} onClick={() => setPick({ ...pick, brand: null })}>
                  <Ico name="arrowLeft" size={14} /> {t('common.back')}
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
                      <div><b>{t('podbor.empty.pre')}{brandObj?.name}{t('podbor.empty.post')}</b>
                        <p>{t('podbor.empty.text')}</p></div>
                      <Btn variant="primary" size="sm">{t('podbor.empty.btn')}</Btn>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Step 2: Year */}
            {step === 2 && (
              <>
                <button className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }} onClick={() => setPick({ ...pick, model: null })}>
                  <Ico name="arrowLeft" size={14} /> {t('common.back')}
                </button>
                <div className="wiz-grid wiz-grid-4">
                  {years.map((y) => (
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
                  <Ico name="arrowLeft" size={14} /> {t('common.back')}
                </button>
                <div className="wiz-grid wiz-grid-4">
                  {systems.map((s) => (
                    <button key={s.id} className="wiz-card wiz-card-sys" onClick={() => setPick({ ...pick, system: s.id })}>
                      <SysGlyph id={s.id} size={40} />
                      <div className="wiz-card-name">{s.ru}</div>
                      <div className="wiz-card-sub">{facets?.categories[s.id] ?? 0} {t('home.cat.countSuffix')}</div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Step 4: Sub-assembly */}
            {step === 4 && (
              <>
                <button className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }} onClick={() => setPick({ ...pick, system: null })}>
                  <Ico name="arrowLeft" size={14} /> {t('common.back')}
                </button>
                <div className="wiz-final">
                  <div className="wiz-grid wiz-grid-3">
                    {(subAssemblies[pick.system ?? ''] ?? subAssemblies.engine).map((sa) => (
                      <button
                        key={sa}
                        className="wiz-card wiz-card-sub"
                        onClick={goToCatalog}
                      >
                        <div className="wiz-sub-mark">→</div>
                        <div className="wiz-card-name">{sa}</div>
                        <div className="wiz-card-sub">{t('podbor.showAllShort')}</div>
                      </button>
                    ))}
                  </div>
                  <div className="wiz-cta">
                    <Btn
                      variant="primary" size="lg" iconRight="arrow"
                      onClick={goToCatalog}
                    >
                      {t('podbor.cta')}
                    </Btn>
                    <span>{t('podbor.foundPre')}{facets?.categories[pick.system ?? ''] ?? 0} {t('home.cat.countSuffix')}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Aside */}
          <aside className="wiz-aside">
            <div className="wiz-aside-card">
              <h4>{t('podbor.aside.myTech')}</h4>
              <p>{t('podbor.aside.myTechText')}</p>
              <div className="garage">
                <div className="garage-item">
                  <Ico name="truck" size={18} />
                  <div><div className="garage-name">KAMAZ 6520 #1</div><div className="garage-sub">{t('podbor.aside.demoSub')}</div></div>
                  <button>•••</button>
                </div>
                <button className="garage-add">{t('podbor.aside.addTech')}</button>
              </div>
            </div>
            <div className="wiz-aside-card">
              <h4>{t('podbor.aside.other')}</h4>
              <div className="wiz-alt">
                <button><Ico name="vin" size={14} /> {t('podbor.alt.vin')}</button>
                <button><Ico name="barcode" size={14} /> {t('podbor.alt.oem')}</button>
                <button><Ico name="chat" size={14} /> {t('podbor.alt.manager')}</button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
