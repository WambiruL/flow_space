'use client'
import { supabase } from '@/lib/supabase'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useStore } from '@/store'


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
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-5">
      <div className="w-full max-w-sm animate-fade-in">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-text-primary mb-1">
            Flow<em className="not-italic text-accent-warm">Space</em>
          </h1>
          <p className="text-text-muted text-sm">Your personal mental operating system</p>
        </div>

        {/* Card */}
        <div className="card">

          {/* Tabs */}
          <div className="flex border-b border-border-default mb-6">
            {(['login', 'signup'] as const).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setError('') }}
                className={`flex-1 pb-3 text-sm transition-colors border-b-2 -mb-px ${
                  tab === t
                    ? 'text-accent-warm border-accent-warm font-medium'
                    : 'text-text-muted border-transparent hover:text-text-secondary'
                }`}
              >
                {t === 'login' ? 'Sign in' : 'Create account'}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="text-xs bg-red-50 border border-red-200 text-red-700 px-3 py-2.5 rounded-lg mb-4 leading-relaxed">
              {error}
            </div>
          )}

          {/* Fields */}
          <div className="space-y-4">
            {tab === 'signup' && (
              <div>
                <label className="label mb-1.5 block">Your name</label>
                <input className="input" value={name} onChange={e => setName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && submit()} placeholder="Ada Okafor" autoFocus />
              </div>
            )}
            <div>
              <label className="label mb-1.5 block">Email</label>
              <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submit()} placeholder="you@example.com"
                autoFocus={tab === 'login'} />
            </div>
            <div>
              <label className="label mb-1.5 block">Password</label>
              <input className="input" type="password" value={pw} onChange={e => setPw(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submit()} placeholder="At least 6 characters" />
            </div>
            {tab === 'signup' && (
              <div>
                <label className="label mb-1.5 block">Confirm password</label>
                <input className="input" type="password" value={pw2} onChange={e => setPw2(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && submit()} placeholder="Repeat password" />
              </div>
            )}

            <button onClick={submit} disabled={loading}
              className="btn-primary w-full py-2.5 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'One moment…' : tab === 'login' ? 'Sign in to FlowSpace' : 'Create my space'}
            </button>

            <div className="flex items-center gap-3 text-xs text-text-muted">
              <div className="flex-1 border-t border-border-default" />
              or
              <div className="flex-1 border-t border-border-default" />
            </div>

            <button onClick={handleDemo} className="btn-secondary w-full py-2.5">
              Continue as guest
            </button>
          </div>
        </div>

        {/* Footer links */}
        <div className="text-center mt-5 text-xs text-text-muted space-x-3">
          <button onClick={() => router.push('/landing')} className="hover:text-text-secondary transition-colors">
            ← Back to home
          </button>
          {tab === 'login' && (
            <button onClick={() => setTab('signup')} className="text-accent-warm hover:underline">
              Create account
            </button>
          )}
          {tab === 'signup' && (
            <button onClick={() => setTab('login')} className="text-accent-warm hover:underline">
              Already have one?
            </button>
          )}
        </div>

      </div>
    </div>
  )
}