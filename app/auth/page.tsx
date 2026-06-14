'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type Screen = 'entry' | 'login' | 'type' | 'reg-fiz' | 'reg-ur' | 'verify' | 'done-fiz' | 'done-ur'

const STEP_MAP: Record<string, number> = { type: 0, 'reg-fiz': 1, 'reg-ur': 1, verify: 2 }

/* ─── SVG helpers ─── */
const Ico = ({ d, w = 18 }: { d: string; w?: number }) => (
  <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

export default function AuthPage() {
  const router = useRouter()
  const [screen, setScreen]     = useState<Screen>('entry')
  const [history, setHistory]   = useState<Screen[]>([])
  const [accType, setAccType]   = useState<'fiz' | 'ur'>('fiz')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd]   = useState(false)
  const [timer, setTimer]       = useState(0)
  const [code, setCode]         = useState(['', '', '', '', '', ''])
  const codeRefs = useRef<(HTMLInputElement | null)[]>([])

  // first name, last name, phone
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName]   = useState('')
  const [phone, setPhone]         = useState('')
  const [agreed, setAgreed]       = useState(false)

  // UR fields
  const [bin, setBin]         = useState('')
  const [company, setCompany] = useState('')
  const [contact, setContact] = useState('')
  const [position, setPosition] = useState('')

  function go(to: Screen) {
    setHistory(h => [...h, screen])
    setScreen(to)
    if (to === 'verify') startTimer()
  }

  function back() {
    const prev = history[history.length - 1]
    if (prev) {
      setHistory(h => h.slice(0, -1))
      setScreen(prev)
    }
  }

  function startTimer() {
    setTimer(42)
  }

  useEffect(() => {
    if (timer <= 0) return
    const id = setTimeout(() => setTimer(t => t - 1), 1000)
    return () => clearTimeout(id)
  }, [timer])

  function handleCodeInput(i: number, val: string) {
    if (!/^\d?$/.test(val)) return
    const next = [...code]
    next[i] = val
    setCode(next)
    if (val && i < 5) codeRefs.current[i + 1]?.focus()
  }

  function handleCodeKey(i: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !code[i] && i > 0) {
      codeRefs.current[i - 1]?.focus()
    }
  }

  const stepIdx = STEP_MAP[screen] ?? -1
  const showBack = screen !== 'entry'
  const showSteps = stepIdx >= 0

  return (
    <>
      <style>{`
        .auth-wrap{min-height:100vh;display:grid;place-items:center;padding:32px;background:var(--bg)}
        .auth{width:980px;max-width:100%;min-height:660px;background:var(--surf);border-radius:22px;box-shadow:0 40px 80px -40px rgba(10,36,71,.45),0 12px 32px -12px rgba(10,36,71,.18);overflow:hidden;display:grid;grid-template-columns:400px 1fr}
        @media(max-width:740px){.auth{grid-template-columns:1fr}.brandpanel{display:none}}
        .brandpanel{background:linear-gradient(165deg,#0d2a52 0%,#0a2447 60%,#08203f 100%);color:#fff;padding:40px 38px;display:flex;flex-direction:column;position:relative;overflow:hidden}
        .brandpanel::after{content:"";position:absolute;right:-90px;bottom:-90px;width:280px;height:280px;border-radius:50%;border:1px solid rgba(255,255,255,.06);box-shadow:0 0 0 40px rgba(255,255,255,.03)}
        .bp-logo{display:flex;align-items:center;gap:11px;margin-bottom:46px}
        .bp-logo .mk{width:40px;height:40px;border-radius:9px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);display:grid;place-items:center}
        .bp-logo .wd{font-weight:800;font-size:20px;letter-spacing:-.01em}
        .bp-head{font-size:25px;font-weight:700;line-height:1.2;letter-spacing:-.02em;margin-bottom:8px}
        .bp-sub{color:#9fb1cc;font-size:14px;line-height:1.5;margin-bottom:34px}
        .bp-list{display:flex;flex-direction:column;gap:22px;position:relative;z-index:1}
        .bp-item{display:flex;gap:13px;align-items:flex-start}
        .bp-item .ic{width:30px;height:30px;border-radius:8px;background:rgba(192,144,42,.16);display:grid;place-items:center;flex-shrink:0;color:var(--gold)}
        .bp-item b{display:block;font-size:14px;font-weight:600;margin-bottom:1px}
        .bp-item span{font-size:12.5px;color:#9fb1cc;line-height:1.4}
        .bp-foot{margin-top:auto;padding-top:30px;display:flex;align-items:center;gap:10px;color:#7e91b0;font-size:12.5px;position:relative;z-index:1}
        .formarea{padding:38px 44px;display:flex;flex-direction:column;overflow-y:auto}
        .fa-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;min-height:30px}
        .back-btn{display:inline-flex;align-items:center;gap:7px;color:var(--ink-2);font-size:13.5px;font-weight:500;background:none;border:none;cursor:pointer;padding:0}
        .back-btn:hover{color:var(--accent)}
        .steps{display:flex;gap:6px}
        .step-dot{height:4px;border-radius:2px;background:var(--line-2);transition:.2s;width:24px}
        .step-dot.on{background:var(--accent);width:32px}
        .step-dot.done{background:var(--ok);width:24px}
        .auth-title{font-size:25px;font-weight:800;letter-spacing:-.02em;margin-bottom:7px}
        .auth-lede{color:var(--ink-2);font-size:14.5px;line-height:1.5;margin-bottom:26px}
        .auth-lede b{color:var(--ink);font-weight:600}
        .auth-field{margin-bottom:16px}
        .auth-field label{display:block;font-size:13px;font-weight:600;color:var(--ink-2);margin-bottom:7px}
        .auth-ctrl{display:flex;align-items:center;gap:10px;height:50px;background:var(--surf);border:1.5px solid var(--line-2);border-radius:9px;padding:0 14px;transition:border-color .15s}
        .auth-ctrl:focus-within{border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-soft)}
        .auth-ctrl svg{color:var(--ink-3);flex-shrink:0}
        .auth-ctrl input{flex:1;border:none;outline:none;background:none;font-size:15px;height:100%;font-family:inherit;color:var(--ink)}
        .eye-btn{background:none;border:none;cursor:pointer;color:var(--ink-3);display:flex;padding:0}
        .eye-btn:hover{color:var(--ink)}
        .field-hint{font-size:12px;color:var(--ink-3);margin-top:6px}
        .field-resolved .auth-ctrl{border-color:var(--ok);background:var(--ok-soft)}
        .resolved-chip{display:inline-flex;align-items:center;gap:7px;margin-top:8px;font-size:13px;color:var(--ok);font-weight:600}
        .two-cols{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .auth-btn{display:flex;align-items:center;justify-content:center;gap:9px;width:100%;height:52px;background:var(--accent);color:#fff;font-weight:600;font-size:15.5px;border-radius:9px;border:none;cursor:pointer;margin-top:6px;font-family:inherit;transition:.15s}
        .auth-btn:hover{background:var(--accent-deep)}
        .auth-btn.sec{background:var(--surf);color:var(--ink);border:1.5px solid var(--line-2)}
        .auth-btn.sec:hover{border-color:var(--accent);color:var(--accent);background:var(--surf)}
        .auth-divider{display:flex;align-items:center;gap:14px;color:var(--ink-3);font-size:13px;margin:20px 0}
        .auth-divider::before,.auth-divider::after{content:"";flex:1;height:1px;background:var(--line)}
        .alt-link{text-align:center;font-size:14px;color:var(--ink-2);margin-top:auto;padding-top:24px}
        .alt-link a{color:var(--accent);font-weight:600;cursor:pointer}
        .small-links{display:flex;justify-content:space-between;margin-top:12px;font-size:13.5px}
        .small-links a{color:var(--accent);font-weight:500;cursor:pointer}
        /* type cards */
        .typecards{display:flex;flex-direction:column;gap:14px;margin-bottom:8px}
        .tcard{display:flex;gap:16px;align-items:flex-start;border:1.5px solid var(--line-2);border-radius:14px;padding:18px;cursor:pointer;transition:.15s;position:relative}
        .tcard:hover{border-color:var(--accent)}
        .tcard.sel{border-color:var(--accent);background:var(--accent-soft)}
        .tcard .tic{width:46px;height:46px;border-radius:11px;background:var(--surf-2);display:grid;place-items:center;flex-shrink:0;color:var(--ink)}
        .tcard.sel .tic{background:var(--accent);color:#fff}
        .tcard h3{font-size:16px;font-weight:700;margin-bottom:4px}
        .tcard p{font-size:13px;color:var(--ink-2);line-height:1.45}
        .tcard-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:9px}
        .tcard-tag{font-size:11px;font-weight:600;background:var(--surf-2);color:var(--ink-2);padding:3px 9px;border-radius:6px}
        .tcard.sel .tcard-tag{background:#fff}
        .tcard-radio{width:21px;height:21px;border-radius:50%;border:2px solid var(--line-2);flex-shrink:0;margin-left:auto;display:grid;place-items:center;transition:.15s;align-self:flex-start;margin-top:2px}
        .tcard.sel .tcard-radio{border-color:var(--accent)}
        .tcard.sel .tcard-radio::after{content:"";width:11px;height:11px;border-radius:50%;background:var(--accent)}
        .badge-rec{position:absolute;top:-9px;right:16px;background:var(--gold);color:#fff;font-size:10px;font-weight:700;padding:3px 9px;border-radius:6px;letter-spacing:.03em}
        /* code */
        .codeboxes{display:flex;gap:10px;margin:6px 0 18px}
        .codebox{width:54px;height:62px;border:1.5px solid var(--line-2);border-radius:11px;text-align:center;font-size:26px;font-weight:700;outline:none;font-family:var(--font-jetbrains),monospace;transition:.15s;color:var(--ink)}
        .codebox:focus{border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-soft)}
        .codebox.filled{border-color:var(--accent);background:var(--accent-soft)}
        .resend{font-size:13.5px;color:var(--ink-3)}
        .resend b{color:var(--ink-2)}
        .resend a{color:var(--accent);font-weight:600;cursor:pointer}
        /* success */
        .screen-center{align-items:center;text-align:center}
        .bigicon{width:84px;height:84px;border-radius:50%;display:grid;place-items:center;margin:0 auto 22px}
        .bigicon.ok{background:var(--ok-soft);color:var(--ok)}
        .bigicon.wait{background:color-mix(in oklab,var(--gold) 14%,#fff);color:var(--gold)}
        /* timeline */
        .timeline{width:100%;text-align:left;border:1px solid var(--line);border-radius:var(--radius-lg);overflow:hidden;margin-bottom:24px}
        .tl-row{display:flex;align-items:center;gap:13px;padding:14px 18px;border-bottom:1px solid var(--line);font-size:14px}
        .tl-row:last-child{border-bottom:none}
        .tl-dot{width:24px;height:24px;border-radius:50%;flex-shrink:0;display:grid;place-items:center}
        .tl-dot.done{background:var(--ok);color:#fff}
        .tl-dot.active{background:var(--accent);color:#fff;animation:pulse 1.6s infinite}
        .tl-dot.todo{background:var(--surf-2);color:var(--ink-3);border:1.5px solid var(--line-2)}
        @keyframes pulse{0%,100%{box-shadow:0 0 0 0 var(--accent-soft)}50%{box-shadow:0 0 0 6px var(--accent-soft)}}
        .tl-tx{flex:1}
        .tl-tx b{font-weight:600}
        .tl-tx span{display:block;font-size:12.5px;color:var(--ink-3)}
        .tl-st{font-size:12px;font-weight:600;color:var(--ink-3)}
        .tl-st.act{color:var(--accent)}
        /* checkrow */
        .checkrow{display:flex;align-items:flex-start;gap:10px;margin-bottom:18px;cursor:pointer}
        .checkrow .cb{width:20px;height:20px;border:1.5px solid var(--line-2);border-radius:5px;flex-shrink:0;display:grid;place-items:center;margin-top:1px;transition:.15s}
        .checkrow input{display:none}
        .checkrow input:checked+.cb{background:var(--accent);border-color:var(--accent)}
        .checkrow .cb svg{opacity:0;transition:.12s}
        .checkrow input:checked+.cb svg{opacity:1}
        .checkrow .lbl{font-size:12.5px;color:var(--ink-2);line-height:1.45}
        .checkrow .lbl a{color:var(--accent)}
      `}</style>

      <div className="auth-wrap">
        <div className="auth">

          {/* ─── LEFT BRAND PANEL ─── */}
          <aside className="brandpanel">
            <div className="bp-logo">
              <span className="mk">
                <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#c0902a" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
                  <path d="M3 14h4l2-6h6l3 4h3"/><circle cx="8" cy="16" r="2.2"/><circle cx="17" cy="16" r="2.2"/>
                </svg>
              </span>
              <span className="wd">TULPARHUB</span>
            </div>
            <div className="bp-head">Грузовые запчасти оптом и в розницу</div>
            <div className="bp-sub">Личный кабинет: история заказов, сохранённая техника, быстрый повторный заказ.</div>
            <div className="bp-list">
              {[
                { icon: 'M3 3h18v6H3zM3 9v12h18V9M8 14h8', title: '10 000+ позиций в наличии', sub: 'Со складов в Алматы, Астане, Шымкенте' },
                { icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6', title: 'Оптовые цены для юр. лиц', sub: 'Спецпрайс и отсрочка платежа' },
                { icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M9 13h6M9 17h4', title: 'Закрывающие документы', sub: 'Счёт, накладная, ЭСФ для бухгалтерии' },
                { icon: 'M1 3h15v13H1zM16 8h4l3 3v5h-7M5.5 19a2 2 0 1 0 0-.1M16.5 19a2 2 0 1 0 0-.1', title: 'Доставка по Казахстану и СНГ', sub: 'Транспортные компании и самовывоз' },
              ].map((it, i) => (
                <div key={i} className="bp-item">
                  <span className="ic">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={it.icon}/></svg>
                  </span>
                  <div><b>{it.title}</b><span>{it.sub}</span></div>
                </div>
              ))}
            </div>
            <div className="bp-foot">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
              Данные защищены. Подтверждение по e-mail.
            </div>
          </aside>

          {/* ─── RIGHT FORM AREA ─── */}
          <main className="formarea">
            <div className="fa-top">
              {showBack ? (
                <button className="back-btn" onClick={back}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
                  Назад
                </button>
              ) : <span />}
              {showSteps && (
                <div className="steps">
                  {[0, 1, 2].map(i => (
                    <span
                      key={i}
                      className={`step-dot${i === stepIdx ? ' on' : i < stepIdx ? ' done' : ''}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* ── S0: ENTRY ── */}
            {screen === 'entry' && (
              <>
                <h1 className="auth-title">Вход и регистрация</h1>
                <p className="auth-lede">Введите e-mail — войдём в аккаунт или создадим новый.</p>
                <div className="auth-field">
                  <label>E-mail</label>
                  <div className="auth-ctrl">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
                    <input type="email" placeholder="you@company.kz" value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                </div>
                <button className="auth-btn" onClick={() => go('type')}>
                  Продолжить
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 6 6 6-6 6"/></svg>
                </button>
                <div className="auth-divider">или</div>
                <button className="auth-btn sec" onClick={() => go('login')}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8.1 9.6a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2Z"/></svg>
                  Войти по номеру телефона
                </button>
                <div className="alt-link">Уже есть аккаунт? <a onClick={() => go('login')}>Войти с паролем</a></div>
              </>
            )}

            {/* ── S1: LOGIN ── */}
            {screen === 'login' && (
              <>
                <h1 className="auth-title">С возвращением</h1>
                <p className="auth-lede">Вход для <b>{email || 'you@company.kz'}</b> · <a style={{ color: 'var(--accent)', cursor: 'pointer' }} onClick={() => go('entry')}>сменить</a></p>
                <div className="auth-field">
                  <label>Пароль</label>
                  <div className="auth-ctrl">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
                    <input type={showPwd ? 'text' : 'password'} placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} />
                    <button className="eye-btn" onClick={() => setShowPwd(v => !v)}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                  </div>
                </div>
                <div className="small-links">
                  <a onClick={() => go('verify')}>Войти по коду из почты</a>
                  <a>Забыли пароль?</a>
                </div>
                <button className="auth-btn" style={{ marginTop: 22 }} onClick={() => go('done-fiz')}>
                  Войти
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 6 6 6-6 6"/></svg>
                </button>
                <div className="alt-link">Нет аккаунта? <a onClick={() => go('type')}>Зарегистрироваться</a></div>
              </>
            )}

            {/* ── S2: ACCOUNT TYPE ── */}
            {screen === 'type' && (
              <>
                <h1 className="auth-title">Кто вы?</h1>
                <p className="auth-lede">От этого зависят цены и набор документов. Это можно изменить позже.</p>
                <div className="typecards">
                  <div className={`tcard${accType === 'fiz' ? ' sel' : ''}`} onClick={() => setAccType('fiz')}>
                    <span className="tic">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M5 21c0-4 3-6 7-6s7 2 7 6"/></svg>
                    </span>
                    <div>
                      <h3>Физ. лицо</h3>
                      <p>Для личных покупок и разовых заказов. Розничные цены, быстрая регистрация.</p>
                      <div className="tcard-tags">
                        <span className="tcard-tag">Розничные цены</span>
                        <span className="tcard-tag">Без документов</span>
                      </div>
                    </div>
                    <span className="tcard-radio" />
                  </div>
                  <div className={`tcard${accType === 'ur' ? ' sel' : ''}`} onClick={() => setAccType('ur')}>
                    <span className="badge-rec">Для бизнеса</span>
                    <span className="tic">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01"/></svg>
                    </span>
                    <div>
                      <h3>Юр. лицо / ИП</h3>
                      <p>Для компаний и автопарков. Оптовые цены, отсрочка платежа и закрывающие документы.</p>
                      <div className="tcard-tags">
                        <span className="tcard-tag">Оптовый прайс</span>
                        <span className="tcard-tag">Отсрочка</span>
                        <span className="tcard-tag">Счёт · ЭСФ</span>
                      </div>
                    </div>
                    <span className="tcard-radio" />
                  </div>
                </div>
                <button className="auth-btn" style={{ marginTop: 18 }} onClick={() => go(accType === 'fiz' ? 'reg-fiz' : 'reg-ur')}>
                  Продолжить
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 6 6 6-6 6"/></svg>
                </button>
              </>
            )}

            {/* ── S3a: FIZ FORM ── */}
            {screen === 'reg-fiz' && (
              <>
                <h1 className="auth-title">Регистрация · физ. лицо</h1>
                <p className="auth-lede">Несколько полей — и вы в каталоге.</p>
                <div className="two-cols">
                  <div className="auth-field">
                    <label>Имя</label>
                    <div className="auth-ctrl"><input placeholder="Айдар" value={firstName} onChange={e => setFirstName(e.target.value)} /></div>
                  </div>
                  <div className="auth-field">
                    <label>Фамилия</label>
                    <div className="auth-ctrl"><input placeholder="Серіков" value={lastName} onChange={e => setLastName(e.target.value)} /></div>
                  </div>
                </div>
                <div className="auth-field">
                  <label>Телефон</label>
                  <div className="auth-ctrl">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8.1 9.6a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2Z"/></svg>
                    <input placeholder="+7 (___) ___-__-__" value={phone} onChange={e => setPhone(e.target.value)} />
                  </div>
                </div>
                <div className="auth-field">
                  <label>Пароль</label>
                  <div className="auth-ctrl">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
                    <input type={showPwd ? 'text' : 'password'} placeholder="Минимум 8 символов" value={password} onChange={e => setPassword(e.target.value)} />
                    <button className="eye-btn" onClick={() => setShowPwd(v => !v)}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                  </div>
                </div>
                <label className="checkrow">
                  <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
                  <span className="cb">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="m5 12 5 5 9-10"/></svg>
                  </span>
                  <span className="lbl">Согласен с <a>условиями</a> и <a>политикой конфиденциальности</a></span>
                </label>
                <button className="auth-btn" onClick={() => go('verify')}>
                  Получить код на e-mail
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 6 6 6-6 6"/></svg>
                </button>
              </>
            )}

            {/* ── S3b: UR FORM ── */}
            {screen === 'reg-ur' && (
              <>
                <h1 className="auth-title">Регистрация · юр. лицо</h1>
                <p className="auth-lede">Укажите БИН/ИИН — подтянем данные компании из реестра.</p>
                <div className={`auth-field${company ? ' field-resolved' : ''}`}>
                  <label>БИН / ИИН</label>
                  <div className="auth-ctrl">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M5 21V7l7-4 7 4v14"/></svg>
                    <input
                      style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
                      maxLength={12}
                      placeholder="000000000000"
                      value={bin}
                      onChange={e => {
                        setBin(e.target.value)
                        setCompany(e.target.value.length === 12 ? 'ТОО «Ваша компания»' : '')
                      }}
                    />
                    {company && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ok)" strokeWidth="3"><path d="m5 12 5 5 9-10"/></svg>
                    )}
                  </div>
                  {company && (
                    <div className="resolved-chip">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m5 12 5 5 9-10"/></svg>
                      {company} · действующая
                    </div>
                  )}
                </div>
                <div className="two-cols">
                  <div className="auth-field">
                    <label>Контактное лицо</label>
                    <div className="auth-ctrl"><input placeholder="ФИО" value={contact} onChange={e => setContact(e.target.value)} /></div>
                  </div>
                  <div className="auth-field">
                    <label>Должность</label>
                    <div className="auth-ctrl"><input placeholder="Снабжение" value={position} onChange={e => setPosition(e.target.value)} /></div>
                  </div>
                </div>
                <div className="two-cols">
                  <div className="auth-field">
                    <label>Телефон</label>
                    <div className="auth-ctrl"><input placeholder="+7 (___) ___-__-__" value={phone} onChange={e => setPhone(e.target.value)} /></div>
                  </div>
                  <div className="auth-field">
                    <label>Пароль</label>
                    <div className="auth-ctrl">
                      <input type={showPwd ? 'text' : 'password'} placeholder="Минимум 8" value={password} onChange={e => setPassword(e.target.value)} />
                      <button className="eye-btn" onClick={() => setShowPwd(v => !v)}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
                <label className="checkrow">
                  <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
                  <span className="cb">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="m5 12 5 5 9-10"/></svg>
                  </span>
                  <span className="lbl">Согласен с <a>условиями</a>, <a>офертой для юр. лиц</a> и обработкой данных</span>
                </label>
                <button className="auth-btn" onClick={() => go('verify')}>
                  Получить код на e-mail
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 6 6 6-6 6"/></svg>
                </button>
              </>
            )}

            {/* ── S4: VERIFY ── */}
            {screen === 'verify' && (
              <>
                <h1 className="auth-title">Подтвердите e-mail</h1>
                <p className="auth-lede">Отправили 6-значный код на <b>{email || 'you@company.kz'}</b>. Введите его ниже.</p>
                <div className="codeboxes">
                  {code.map((v, i) => (
                    <input
                      key={i}
                      ref={el => { codeRefs.current[i] = el }}
                      className={`codebox${v ? ' filled' : ''}`}
                      maxLength={1}
                      inputMode="numeric"
                      value={v}
                      onChange={e => handleCodeInput(i, e.target.value)}
                      onKeyDown={e => handleCodeKey(i, e)}
                    />
                  ))}
                </div>
                <div className="resend">
                  Не пришёл код?{' '}
                  {timer > 0
                    ? <b>Отправить снова через 0:{String(timer).padStart(2, '0')}</b>
                    : <><b>Код устарел.</b> <a onClick={startTimer}>Отправить снова</a></>
                  }
                </div>
                <button className="auth-btn" style={{ marginTop: 24 }} onClick={() => go(accType === 'fiz' ? 'done-fiz' : 'done-ur')}>
                  Подтвердить
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 6 6 6-6 6"/></svg>
                </button>
                <div className="alt-link"><a onClick={() => go('entry')}>Изменить e-mail</a></div>
              </>
            )}

            {/* ── S5a: DONE FIZ ── */}
            {screen === 'done-fiz' && (
              <div className="screen-center" style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <div className="bigicon ok">
                  <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 13 4 4L19 7"/></svg>
                </div>
                <h1 className="auth-title">Готово! Вы вошли</h1>
                <p className="auth-lede">Аккаунт физ. лица создан. Доступны розничные цены, корзина и история заказов.</p>
                <button className="auth-btn" style={{ maxWidth: 280 }} onClick={() => router.push('/catalog')}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                  Перейти в каталог
                </button>
              </div>
            )}

            {/* ── S5b: DONE UR ── */}
            {screen === 'done-ur' && (
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center', textAlign: 'center' }}>
                <div className="bigicon wait" style={{ marginTop: 12 }}>
                  <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
                </div>
                <h1 className="auth-title">Заявка принята</h1>
                <p className="auth-lede">E-mail подтверждён. Менеджер проверит компанию — обычно <b>до 1 рабочего дня</b>.</p>
                <div className="timeline" style={{ maxWidth: 420 }}>
                  {[
                    { dot: 'done', icon: 'm5 12 5 5 9-10', label: 'Регистрация', sub: 'Данные компании отправлены', st: 'Готово', stCls: '' },
                    { dot: 'done', icon: 'm5 12 5 5 9-10', label: 'E-mail подтверждён', sub: email || 'you@company.kz', st: 'Готово', stCls: '' },
                    { dot: 'active', icon: 'M12 7v5l3 2', label: 'Проверка компании', sub: 'Сверяем БИН и реквизиты', st: 'Идёт', stCls: 'act' },
                    { dot: 'todo', icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6', label: 'Оптовый доступ', sub: 'Спецпрайс, отсрочка, ЭСФ', st: 'Ожидает', stCls: '' },
                  ].map((row, i) => (
                    <div key={i} className="tl-row">
                      <span className={`tl-dot ${row.dot}`}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={row.dot === 'done' ? '3' : '2.5'}><path d={row.icon}/></svg>
                      </span>
                      <div className="tl-tx"><b>{row.label}</b><span>{row.sub}</span></div>
                      <span className={`tl-st ${row.stCls}`}>{row.st}</span>
                    </div>
                  ))}
                </div>
                <p className="auth-lede" style={{ marginTop: -6 }}>А пока можно покупать по розничным ценам.</p>
                <button className="auth-btn" style={{ maxWidth: 280 }} onClick={() => router.push('/catalog')}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                  Перейти в каталог
                </button>
              </div>
            )}

          </main>
        </div>
      </div>
    </>
  )
}
