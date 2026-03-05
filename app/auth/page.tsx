'use client'
import { supabase } from '@/lib/supabase'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useStore } from '@/store'
import { Flame } from 'lucide-react'


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
export default function AuthPage() {
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


  //redirect users if already logged in

useEffect(() => {
  const checkUser = async () => {
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (user) {
      router.push('/dashboard')
    }
  }

  checkUser()
}, [])

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