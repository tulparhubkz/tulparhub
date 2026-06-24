'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Screen = 'entry' | 'login' | 'register' | 'verify'

export default function AuthPage() {
  const router = useRouter()
  const [screen, setScreen] = useState<Screen>('entry')
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName]   = useState('')
  const [phone, setPhone]         = useState('')
  const [showPwd, setShowPwd]     = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError(error.message === 'Invalid login credentials'
        ? 'Неверный email или пароль'
        : error.message)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!firstName.trim()) { setError('Введите имя'); return }
    if (password.length < 6) { setError('Пароль минимум 6 символов'); return }
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName, phone },
        emailRedirectTo: 'https://tulparhub-psi.vercel.app/auth/callback',
      },
    })
    setLoading(false)
    if (error) {
      setError(error.message === 'User already registered'
        ? 'Этот email уже зарегистрирован'
        : error.message)
    } else {
      setScreen('verify')
    }
  }

  return (
    <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surf-2)' }}>
      <div style={{ width: '100%', maxWidth: 420, background: 'var(--surf)', borderRadius: 16, boxShadow: 'var(--shadow-md)', overflow: 'hidden' }}>

        {/* Logo header */}
        <div style={{ background: 'var(--accent)', padding: '24px 32px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="rgba(255,255,255,0.2)" />
            <path d="M6 22 L16 8 L26 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <circle cx="16" cy="22" r="3" fill="white"/>
          </svg>
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 18, letterSpacing: '-0.5px' }}>TULPAR HUB</div>
            <div style={{ color: 'rgba(255,255,255,.7)', fontSize: 12 }}>Запчасти для грузовиков</div>
          </div>
        </div>

        <div style={{ padding: '32px' }}>

          {/* ── ENTRY ── */}
          {screen === 'entry' && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Войдите или создайте аккаунт</h2>
              <p style={{ color: 'var(--ink-2)', fontSize: 14, marginBottom: 28 }}>Чтобы видеть заказы, избранное и историю</p>
              <button className="btn-primary" style={{ width: '100%', marginBottom: 12 }} onClick={() => setScreen('login')}>
                Войти
              </button>
              <button onClick={() => setScreen('register')}
                style={{ width: '100%', padding: '12px 0', border: '1.5px solid var(--line-2)', borderRadius: 10, background: 'none', fontSize: 15, fontWeight: 600, cursor: 'pointer', color: 'var(--ink)' }}>
                Создать аккаунт
              </button>
            </div>
          )}

          {/* ── LOGIN ── */}
          {screen === 'login' && (
            <form onSubmit={handleLogin}>
              <button type="button" onClick={() => { setScreen('entry'); setError('') }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-3)', fontSize: 13, marginBottom: 20, padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                ← Назад
              </button>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Вход в аккаунт</h2>

              <label style={{ display: 'block', marginBottom: 16 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-2)', display: 'block', marginBottom: 6 }}>Email</span>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="example@mail.com"
                  style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--line-2)', borderRadius: 10, fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
              </label>

              <label style={{ display: 'block', marginBottom: 24 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-2)', display: 'block', marginBottom: 6 }}>Пароль</span>
                <div style={{ position: 'relative' }}>
                  <input type={showPwd ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{ width: '100%', padding: '11px 42px 11px 14px', border: '1.5px solid var(--line-2)', borderRadius: 10, fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
                  <button type="button" onClick={() => setShowPwd(v => !v)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-3)', fontSize: 13 }}>
                    {showPwd ? 'Скрыть' : 'Показать'}
                  </button>
                </div>
              </label>

              {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px', color: '#dc2626', fontSize: 13, marginBottom: 16 }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Загрузка…' : 'Войти'}
              </button>

              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <button type="button" onClick={() => { setScreen('register'); setError('') }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontSize: 13, fontWeight: 500 }}>
                  Нет аккаунта? Зарегистрироваться
                </button>
              </div>
            </form>
          )}

          {/* ── REGISTER ── */}
          {screen === 'register' && (
            <form onSubmit={handleRegister}>
              <button type="button" onClick={() => { setScreen('entry'); setError('') }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-3)', fontSize: 13, marginBottom: 20, padding: 0 }}>
                ← Назад
              </button>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Создать аккаунт</h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <label>
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-2)', display: 'block', marginBottom: 6 }}>Имя *</span>
                  <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)}
                    placeholder="Айбек"
                    style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--line-2)', borderRadius: 10, fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
                </label>
                <label>
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-2)', display: 'block', marginBottom: 6 }}>Фамилия</span>
                  <input type="text" value={lastName} onChange={e => setLastName(e.target.value)}
                    placeholder="Тулегенов"
                    style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--line-2)', borderRadius: 10, fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
                </label>
              </div>

              <label style={{ display: 'block', marginBottom: 16 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-2)', display: 'block', marginBottom: 6 }}>Телефон</span>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="+7 (700) 000-00-00"
                  style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--line-2)', borderRadius: 10, fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
              </label>

              <label style={{ display: 'block', marginBottom: 16 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-2)', display: 'block', marginBottom: 6 }}>Email *</span>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="example@mail.com"
                  style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--line-2)', borderRadius: 10, fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
              </label>

              <label style={{ display: 'block', marginBottom: 24 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-2)', display: 'block', marginBottom: 6 }}>Пароль * (мин. 6 символов)</span>
                <div style={{ position: 'relative' }}>
                  <input type={showPwd ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{ width: '100%', padding: '11px 42px 11px 14px', border: '1.5px solid var(--line-2)', borderRadius: 10, fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
                  <button type="button" onClick={() => setShowPwd(v => !v)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-3)', fontSize: 13 }}>
                    {showPwd ? 'Скрыть' : 'Показать'}
                  </button>
                </div>
              </label>

              {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px', color: '#dc2626', fontSize: 13, marginBottom: 16 }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Создаём аккаунт…' : 'Зарегистрироваться'}
              </button>

              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <button type="button" onClick={() => { setScreen('login'); setError('') }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontSize: 13, fontWeight: 500 }}>
                  Уже есть аккаунт? Войти
                </button>
              </div>
            </form>
          )}

          {/* ── VERIFY ── */}
          {screen === 'verify' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Подтвердите email</h2>
              <p style={{ color: 'var(--ink-2)', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
                Мы отправили письмо на <b>{email}</b>. Перейдите по ссылке в письме и вернитесь сюда для входа.
              </p>
              <button className="btn-primary" style={{ width: '100%', marginBottom: 12 }} onClick={() => setScreen('login')}>
                Войти после подтверждения
              </button>
              <p style={{ fontSize: 12, color: 'var(--ink-3)' }}>Письмо не пришло? Проверьте папку «Спам»</p>
            </div>
          )}

        </div>
      </div>
    </main>
  )
}
