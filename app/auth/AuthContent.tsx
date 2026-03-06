'use client'
import { supabase } from '@/lib/supabase'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useStore } from '@/store'
import { Flame } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'


// ── Local auth helpers ──────────────────────────────────────────────────────
// These store users in localStorage.

// const USERS_KEY = 'fs_users'
// const AUTH_KEY  = 'fs_auth'

// function getUsers(): Record<string, any> {
//    try { return JSON.parse(localStorage.getItem(USERS_KEY) || '{}') } catch { return {} }
// }

// function registerUser(email: string, password: string, name: string) {
//   const users = getUsers()
//   if (users[email]) return { error: 'An account with this email already exists.' }
//   const user = { email, password, name, id: Date.now().toString(36), createdAt: new Date().toISOString() }
//   users[email] = user
//   localStorage.setItem(USERS_KEY, JSON.stringify(users))
//   return { user }
// }

// function loginUser(email: string, password: string) {
//   const users = getUsers()
//   const user = users[email]
//   if (!user) return { error: 'No account found with this email.' }
//   if (user.password !== password) return { error: 'Incorrect password.' }
//   return { user }
// }

// ── Component ───────────────────────────────────────────────────────────────
export default function AuthContent() {
  const router       = useRouter()
  const params       = useSearchParams()
  const setUserId    = useStore(s => s.setUserId)

  const initialMode = params.get('mode') === 'signup' ? 'signup' : 'login'
  const [tab,     setTab]     = useState<'login' | 'signup'>(initialMode)
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [pw,      setPw]      = useState('')
  const [pw2,     setPw2]     = useState('')
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

const handleOAuth = async () => {
    setLoading(true)
    setError('')
    try {
      const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
   )
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (err: any) {
      setError(err.message || 'Authentication failed')
      setLoading(false)
    }
  }
  //redirect users if already logged in

  useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    // Only redirect on active sign-in events, not on stale session detection
    if (event === 'SIGNED_IN' && session?.user) {
      router.push('/dashboard')
    }
  })
  return () => subscription.unsubscribe()
}, [])

// useEffect(() => {
//   const checkUser = async () => {
//     const {
//       data: { user }
//     } = await supabase.auth.getUser()

//     if (user) {
//       router.push('/dashboard')
//     }
//   }

//   checkUser()
// }, [])

  // Handle ?demo=true query param (from landing page CTA)
  useEffect(() => {
    if (params.get('demo') === 'true') handleDemo()
  }, [])

  const handleDemo = async () => {
    const { data, error } = await supabase.auth.signInAnonymously()

    if (error) {
      setError(error.message)
      return
    }

    if (data.user) {
      setUserId(data.user.id)
      router.push('/dashboard')
    }
  }

  const submit = async () => {
  setError('')

  if (!email.trim() || !pw.trim()) {
    setError('Please fill in all fields.')
    return
  }

  setLoading(true)

  if (tab === 'signup') {
    if (!name.trim()) {
      setError('Please enter your name.')
      setLoading(false)
      return
    }

    if (pw.length < 6) {
      setError('Password must be at least 6 characters.')
      setLoading(false)
      return
    }

    if (pw !== pw2) {
      setError('Passwords do not match.')
      setLoading(false)
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password: pw,
      options: {
        data: {
          name: name.trim(),
        },
      },
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    if (data.user) {
      setUserId(data.user.id)
      router.push('/dashboard')
    }
  } else {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: pw,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    if (data.user) {
      setUserId(data.user.id)
      router.push('/dashboard')
    }
  }
}

  return (
    <div
      className="min-h-screen flex items-center justify-center p-5"
      style={{
        background: '#3C1518',
        backgroundImage: 'radial-gradient(at 20% 30%, #A4420010 0px, transparent 55%), radial-gradient(at 80% 70%, #D5893608 0px, transparent 55%)',
      }}
    >
      <div className="w-full max-w-sm animate-fade-in">

        {/* Logo */}
        <div className="text-center mb-9">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center animate-float"
              style={{ background: 'linear-gradient(135deg, #A44200, #D58936)', boxShadow: '0 0 24px #A4420040' }}
            >
              <Flame size={18} style={{ color: '#F2F3AE' }} />
            </div>
          </div>
          <h1 className="font-display text-4xl font-semibold" style={{ color: '#F2F3AE' }}>
            Flow
            <span style={{
              background: 'linear-gradient(135deg, #D58936, #F2F3AE)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Space</span>
          </h1>
          <p className="text-sm mt-1.5" style={{ color: '#8A8A45' }}>Your personal mental operating system</p>
        </div>

        {/* Card */}
        <div className="card-accent">
          {/* Google */}
          <button
            onClick={handleOAuth}
            disabled={loading}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              width: '100%', padding: '13px 20px', borderRadius: 12,
              background: 'rgba(42,12,14,0.60)',
              border: '1px solid rgba(107,36,32,0.50)',
              color: '#C8C97A', cursor: 'pointer',
              fontSize: 14, fontWeight: 600,
              fontFamily: "'Nunito', sans-serif",
              marginBottom: 16,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'rgba(164,66,0,0.60)'
              el.style.background = 'rgba(52,16,18,0.80)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'rgba(107,36,32,0.50)'
              el.style.background = 'rgba(42,12,14,0.60)'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20,
          }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(107,36,32,0.40)' }} />
            <span style={{ fontSize: 12, color: '#A44200', fontFamily: "'Nunito', sans-serif" }}>
              or continue with email
            </span>
            <div style={{ flex: 1, height: 1, background: 'rgba(107,36,32,0.40)' }} />
          </div>

          {/* Tabs */}
          <div className="flex" style={{ borderBottom: '1px solid #6B2420', marginBottom: '1.5rem' }}>
            {(['login', 'signup'] as const).map(t => (
              <button key={t} onClick={() => { setTab(t); setError('') }}
                className="flex-1 pb-3 text-sm transition-colors border-b-2 -mb-px"
                style={{
                  color: tab === t ? '#F2F3AE' : '#8A8A45',
                  fontWeight: tab === t ? 600 : 400,
                  borderBottomColor: tab === t ? '#A44200' : 'transparent',
                }}>
                {t === 'login' ? 'Sign in' : 'Create account'}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="text-xs px-3 py-2.5 rounded-xl mb-4 leading-relaxed"
              style={{ background: '#A4420018', border: '1px solid #A4420030', color: '#E8855A' }}>
              {error}
            </div>
          )}

          {/* Fields */}
          <div className="space-y-4">
            {tab === 'signup' && (
              <div>
                <label className="label block mb-1.5">Your name</label>
                <input className="input" value={name} onChange={e => setName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && submit()}
                  placeholder="Ada Okafor" autoFocus />
              </div>
            )}
            <div>
              <label className="label block mb-1.5">Email</label>
              <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submit()}
                placeholder="you@example.com" autoFocus={tab === 'login'} />
            </div>
            <div>
              <label className="label block mb-1.5">Password</label>
              <input className="input" type="password" value={pw} onChange={e => setPw(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submit()}
                placeholder="At least 6 characters" />
            </div>
            {tab === 'signup' && (
              <div>
                <label className="label block mb-1.5">Confirm password</label>
                <input className="input" type="password" value={pw2} onChange={e => setPw2(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && submit()}
                  placeholder="Repeat password" />
              </div>
            )}

            <button onClick={submit} disabled={loading} className="btn-primary w-full py-2.5 justify-center disabled:opacity-40">
              {loading ? 'One moment…' : tab === 'login' ? 'Enter FlowSpace' : 'Create my space'}
            </button>

            <div className="flex items-center gap-3 text-xs" style={{ color: '#8A8A45' }}>
              <div className="flex-1 border-t" style={{ borderColor: '#6B2420' }} />
              or
              <div className="flex-1 border-t" style={{ borderColor: '#6B2420' }} />
            </div>

            <button onClick={handleDemo} className="btn-secondary w-full py-2.5 justify-center">
              Continue as guest
            </button>
          </div>
        </div>

        <p className="text-center text-xs mt-5" style={{ color: '#5A3A20' }}>
          Everything stored privately in your browser.
        </p>
      </div>
    </div>
  )
}