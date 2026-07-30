'use client'
import { useState, useEffect } from 'react'
import { Link } from '@/i18n/navigation'
import { useT } from '@/lib/i18n'
import { useGarage } from '@/store/garage'
import { isValidPhone, phoneInputValue } from '@/lib/validation'
import { reachGoal } from '@/lib/analytics'

const TRUCK_BRANDS = [
  'DAF', 'Volvo', 'MAN', 'Mercedes-Benz', 'Scania', 'Iveco', 'Renault Trucks',
  'КАМАЗ', 'МАЗ', 'УРАЛ', 'ЗИЛ', 'ГАЗ', 'КрАЗ', 'БелАЗ',
  'HOWO (Sinotruk)', 'Shacman', 'FAW', 'DongFeng', 'Foton', 'JAC', 'CNHTC',
  'Isuzu', 'Mitsubishi Fuso', 'Hino', 'UD Trucks',
]

const YEARS = Array.from({ length: 35 }, (_, i) => String(2025 - i))

export default function VinPage() {
  const t = useT()
  const { addVehicle } = useGarage()
  const [tab, setTab] = useState<'vin' | 'params'>('vin')
  const [vinForm, setVinForm] = useState({ vin: '', parts: '' })
  const [vinDecoded, setVinDecoded] = useState<{ brand: string; model: string; year?: number; searchQuery?: string } | null>(null)
  const [addedToGarage, setAddedToGarage] = useState(false)
  const [paramsForm, setParamsForm] = useState({
    year: '', brand: '', model: '', engine: '', gearbox: 'manual', parts: '',
  })
  const [contact, setContact] = useState({ name: '', phone: '' })
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const v = vinForm.vin.trim()
    if (v.length < 11) { setVinDecoded(null); setAddedToGarage(false); return }
    setAddedToGarage(false)
    fetch(`/api/vin-decode?vin=${encodeURIComponent(v)}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => setVinDecoded(d))
      .catch(() => setVinDecoded(null))
  }, [vinForm.vin])

  // POST the request to /api/leads; only flip to the success screen on 200 (#123).
  async function submitLead(payload: Record<string, unknown>) {
    if (submitting) return
    const name = contact.name.trim()
    const phone = contact.phone.trim()
    if (name.length < 2) { setError(t('cart.toast.enterName')); return }
    if (!isValidPhone(phone)) { setError(t('cart.toast.badPhone')); return }
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, kind: 'quote', name, phone }),
      })
      if (res.ok) {
        reachGoal('LEAD_SUBMIT', { kind: payload.source })
        setSent(true)
      } else {
        const data = await res.json().catch(() => null)
        setError(data?.error || t('vin.err'))
      }
    } catch {
      setError(t('vin.err'))
    } finally {
      setSubmitting(false)
    }
  }

  function submitVin(e: React.FormEvent) {
    e.preventDefault()
    void submitLead({
      source: 'vin',
      comment: vinForm.parts.trim(),
      vin: vinForm.vin.trim(),
      brand: vinDecoded?.brand,
      model: vinDecoded?.model,
      year: vinDecoded?.year ? String(vinDecoded.year) : undefined,
      search_query: vinDecoded?.searchQuery,
    })
  }

  function submitParams(e: React.FormEvent) {
    e.preventDefault()
    void submitLead({
      source: 'params',
      comment: paramsForm.parts.trim(),
      brand: paramsForm.brand,
      model: paramsForm.model.trim(),
      year: paramsForm.year,
      engine: paramsForm.engine.trim(),
      gearbox: paramsForm.gearbox,
    })
  }

  function handleAddToGarage() {
    if (!vinDecoded) return
    const label = `${vinDecoded.brand} ${vinDecoded.model}${vinDecoded.year ? ` ${vinDecoded.year}` : ''}`.trim()
    addVehicle(vinForm.vin.trim(), label, vinDecoded.searchQuery)
    setAddedToGarage(true)
  }

  if (sent) {
    return (
      <main style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: 440 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--ok-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--ok)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)', marginBottom: 10 }}>{t('vin.sent.title')}</h2>
          <p style={{ color: 'var(--ink-2)', fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>
            {t('vin.sent.sub')}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button
              onClick={() => setSent(false)}
              style={{ padding: '10px 20px', border: '1.5px solid var(--line-2)', borderRadius: 'var(--radius)', background: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}
            >
              {t('vin.sent.new')}
            </button>
            <Link href="/catalog" style={{ padding: '10px 20px', background: 'var(--accent)', color: '#fff', borderRadius: 'var(--radius)', textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
              {t('vin.sent.catalog')}
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <>
      <style jsx global>{`
        .vin-page { max-width: 780px; margin: 0 auto; padding: 32px 20px 60px; }
        .vin-title { font-size: 26px; font-weight: 800; color: var(--ink); margin-bottom: 6px; }
        .vin-sub { font-size: 14px; color: var(--ink-3); margin-bottom: 24px; }
        .vin-tabs { display: flex; border-bottom: 2px solid var(--line); margin-bottom: 28px; }
        .vin-tab { padding: 10px 22px; font-size: 15px; font-weight: 500; color: var(--ink-3); background: none; border: none; border-bottom: 2px solid transparent; margin-bottom: -2px; cursor: pointer; }
        .vin-tab.on { color: var(--accent); border-bottom-color: var(--accent); font-weight: 700; }
        .vin-card { background: var(--surf); border: 1px solid var(--line); border-radius: var(--radius-lg); padding: 28px; }
        .vin-info { display: flex; gap: 12px; background: var(--accent-soft); border: 1px solid rgba(31,95,191,.15); border-radius: var(--radius); padding: 14px 16px; margin-bottom: 24px; }
        .vin-info svg { flex-shrink: 0; margin-top: 1px; }
        .vin-info p { font-size: 13.5px; color: var(--ink-2); line-height: 1.55; margin: 0; }
        .vin-info a { color: var(--accent); }
        .vin-field { margin-bottom: 20px; }
        .vin-label { font-size: 13px; font-weight: 600; color: var(--ink); margin-bottom: 7px; display: block; }
        .vin-input { width: 100%; padding: 11px 14px; border: 1.5px solid var(--line-2); border-radius: var(--radius); font-size: 14px; color: var(--ink); background: var(--surf); box-sizing: border-box; font-family: var(--font-jetbrains), monospace; }
        .vin-input:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(31,95,191,.1); }
        .vin-textarea { width: 100%; padding: 11px 14px; border: 1.5px solid var(--line-2); border-radius: var(--radius); font-size: 14px; color: var(--ink); background: var(--surf); box-sizing: border-box; resize: vertical; min-height: 110px; font-family: inherit; }
        .vin-textarea:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(31,95,191,.1); }
        .vin-select { width: 100%; padding: 11px 14px; border: 1.5px solid var(--line-2); border-radius: var(--radius); font-size: 14px; color: var(--ink); background: var(--surf); box-sizing: border-box; appearance: none; background-image: url("data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%238a97ab' stroke-width='2' xmlns='http:%2F%2Fwww.w3.org%2F2000%2Fsvg'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; cursor: pointer; }
        .vin-select:focus { outline: none; border-color: var(--accent); }
        .vin-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .vin-submit { display: flex; align-items: center; gap: 12px; padding: 13px 32px; background: var(--accent); color: #fff; border: none; border-radius: var(--radius); font-size: 15px; font-weight: 700; cursor: pointer; margin-top: 8px; }
        .vin-submit:hover { background: var(--accent-deep); }
        .vin-submit:disabled { opacity: .6; cursor: default; }
        .vin-ctas { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 12px; }
        .vin-cta { display: inline-flex; align-items: center; gap: 7px; padding: 9px 16px; border: 1.5px solid var(--line-2); border-radius: var(--radius); background: var(--surf); color: var(--ink); font-size: 13.5px; font-weight: 600; cursor: pointer; text-decoration: none; }
        .vin-cta:hover { border-color: var(--accent); color: var(--accent); }
        .vin-cta:disabled { border-color: #68d391; color: #38a169; cursor: default; }
        .vin-error { background: #fef2f2; border: 1px solid #fca5a5; border-radius: var(--radius); padding: 10px 14px; color: #dc2626; font-size: 13.5px; margin-bottom: 16px; }
        @media (max-width: 600px) { .vin-row { grid-template-columns: 1fr; } }
      `}</style>

      <main className="container vin-page">
        <div className="crumbs" style={{ marginBottom: 20 }}>
          <Link href="/">{t('common.home')}</Link> / <span>{t('vin.crumb')}</span>
        </div>

        <h1 className="vin-title">{t('vin.title')}</h1>
        <p className="vin-sub">{t('vin.sub')}</p>

        <div className="vin-tabs">
          <button className={`vin-tab${tab === 'vin' ? ' on' : ''}`} onClick={() => setTab('vin')}>{t('vin.tab.vin')}</button>
          <button className={`vin-tab${tab === 'params' ? ' on' : ''}`} onClick={() => setTab('params')}>{t('vin.tab.params')}</button>
        </div>

        {tab === 'vin' ? (
          <div className="vin-card">
            <div className="vin-info">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <p>
                {t('vin.info.pre')}<button type="button" onClick={() => setTab('params')} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: 0, fontWeight: 600 }}>{t('vin.info.link')}</button>.
              </p>
            </div>

            <form onSubmit={submitVin}>
              <div className="vin-field">
                <label className="vin-label">{t('vin.field.vin')}</label>
                <input
                  className="vin-input"
                  placeholder={t('vin.placeholder.vin')}
                  maxLength={17}
                  value={vinForm.vin}
                  onChange={e => setVinForm(f => ({ ...f, vin: e.target.value.toUpperCase() }))}
                  required
                />
                {vinDecoded && (
                  <>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:8, padding:'10px 14px', background:'#f0faf4', border:'1px solid #68d391', borderRadius:'var(--radius)', fontSize:13 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#38a169" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      <span><b>{vinDecoded.brand} {vinDecoded.model}</b>{vinDecoded.year ? ` · ${vinDecoded.year} ${t('common.yearShort')}`.trimEnd() : ''}</span>
                    </div>
                    <div className="vin-ctas">
                      <Link href={`/catalog?q=${encodeURIComponent(vinDecoded.searchQuery || `${vinDecoded.brand} ${vinDecoded.model}`)}`} className="vin-cta">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        {t('vin.cta.catalog')}
                      </Link>
                      <button type="button" className="vin-cta" onClick={handleAddToGarage} disabled={addedToGarage}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                        {addedToGarage ? t('vin.cta.added') : t('vin.cta.garage')}
                      </button>
                    </div>
                  </>
                )}
              </div>
              <div className="vin-field">
                <label className="vin-label">{t('vin.field.parts')}</label>
                <textarea
                  className="vin-textarea"
                  placeholder={t('vin.placeholder.parts')}
                  value={vinForm.parts}
                  onChange={e => setVinForm(f => ({ ...f, parts: e.target.value }))}
                  required
                />
              </div>
              <div className="vin-row">
                <div className="vin-field">
                  <label className="vin-label">{t('vin.field.name')}</label>
                  <input
                    className="vin-input"
                    style={{ fontFamily: 'inherit' }}
                    placeholder={t('vin.placeholder.name')}
                    value={contact.name}
                    onChange={e => setContact(c => ({ ...c, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="vin-field">
                  <label className="vin-label">{t('vin.field.phone')}</label>
                  <input
                    className="vin-input"
                    style={{ fontFamily: 'inherit' }}
                    type="tel"
                    placeholder={t('vin.placeholder.phone')}
                    value={contact.phone}
                    onChange={e => setContact(c => ({ ...c, phone: phoneInputValue(e) }))}
                    required
                  />
                </div>
              </div>
              {error && <div className="vin-error">{error}</div>}
              <button type="submit" className="vin-submit" disabled={submitting}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                {submitting ? t('vin.submitting') : t('vin.submit')}
              </button>
            </form>
          </div>
        ) : (
          <div className="vin-card">
            <form onSubmit={submitParams}>
              <div className="vin-row">
                <div className="vin-field">
                  <label className="vin-label">{t('vin.p.year')}</label>
                  <select
                    className="vin-select"
                    value={paramsForm.year}
                    onChange={e => setParamsForm(f => ({ ...f, year: e.target.value }))}
                    required
                  >
                    <option value="">{t('vin.p.select')}</option>
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div className="vin-field">
                  <label className="vin-label">{t('vin.p.brand')}</label>
                  <select
                    className="vin-select"
                    value={paramsForm.brand}
                    onChange={e => setParamsForm(f => ({ ...f, brand: e.target.value, model: '' }))}
                    required
                  >
                    <option value="">{t('vin.p.select')}</option>
                    {TRUCK_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>

              <div className="vin-row">
                <div className="vin-field">
                  <label className="vin-label">{t('vin.p.model')}</label>
                  <input
                    className="vin-input"
                    placeholder={t('vin.placeholder.model')}
                    value={paramsForm.model}
                    onChange={e => setParamsForm(f => ({ ...f, model: e.target.value }))}
                    required
                  />
                </div>
                <div className="vin-field">
                  <label className="vin-label">{t('vin.p.engine')}</label>
                  <input
                    className="vin-input"
                    placeholder="12.0"
                    value={paramsForm.engine}
                    onChange={e => setParamsForm(f => ({ ...f, engine: e.target.value }))}
                    style={{ fontFamily: 'inherit' }}
                  />
                </div>
              </div>

              <div className="vin-field" style={{ maxWidth: '50%' }}>
                <label className="vin-label">{t('vin.p.gearbox')}</label>
                <select
                  className="vin-select"
                  value={paramsForm.gearbox}
                  onChange={e => setParamsForm(f => ({ ...f, gearbox: e.target.value }))}
                >
                  <option value="manual">{t('vin.gear.manual')}</option>
                  <option value="auto">{t('vin.gear.auto')}</option>
                  <option value="robot">{t('vin.gear.robot')}</option>
                </select>
              </div>

              <div className="vin-field">
                <label className="vin-label">{t('vin.field.parts')}</label>
                <textarea
                  className="vin-textarea"
                  placeholder={t('vin.placeholder.parts')}
                  value={paramsForm.parts}
                  onChange={e => setParamsForm(f => ({ ...f, parts: e.target.value }))}
                  required
                />
              </div>

              <div className="vin-row">
                <div className="vin-field">
                  <label className="vin-label">{t('vin.field.name')}</label>
                  <input
                    className="vin-input"
                    style={{ fontFamily: 'inherit' }}
                    placeholder={t('vin.placeholder.name')}
                    value={contact.name}
                    onChange={e => setContact(c => ({ ...c, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="vin-field">
                  <label className="vin-label">{t('vin.field.phone')}</label>
                  <input
                    className="vin-input"
                    style={{ fontFamily: 'inherit' }}
                    type="tel"
                    placeholder={t('vin.placeholder.phone')}
                    value={contact.phone}
                    onChange={e => setContact(c => ({ ...c, phone: phoneInputValue(e) }))}
                    required
                  />
                </div>
              </div>
              {error && <div className="vin-error">{error}</div>}

              <button type="submit" className="vin-submit" disabled={submitting}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                {submitting ? t('vin.submitting') : t('vin.submit')}
              </button>
            </form>
          </div>
        )}
      </main>
    </>
  )
}
