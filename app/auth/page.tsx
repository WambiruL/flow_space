'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { useStore } from '@/store'

export default function AuthPage() {
  const router = useRouter()
  const setUserId = useStore(s => s.setUserId)
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [demoMode, setDemoMode] = useState(false)

  const handleAuth = async () => {
    setLoading(true)
    setError('')
    try {
      const supabase = createClient()
      if (mode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        setUserId(data.user?.id || null)
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setUserId(data.user?.id || null)
      }
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDemo = () => {
    setUserId('demo-user')
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl text-text-primary mb-2">
            Flow<span className="text-accent-warm">Space</span>
          </h1>
          <p className="text-text-secondary text-sm">Your personal mental operating system</p>
        </div>

        {/* Card */}
        <div className="card border-border-default">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === 'login' ? 'bg-accent-warm text-bg-primary' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === 'signup' ? 'bg-accent-warm text-bg-primary' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Create Account
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="label mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAuth()}
                placeholder="you@example.com"
                className="input"
              />
            </div>
            <div>
              <label className="label mb-1.5 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAuth()}
                placeholder="••••••••"
                className="input"
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs bg-red-400/10 px-3 py-2 rounded-lg">{error}</p>
            )}

            <button
              onClick={handleAuth}
              disabled={loading || !email || !password}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Enter FlowSpace' : 'Create Account'}
            </button>

            <div className="relative my-2">
              <div className="border-t border-border-subtle" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-bg-card px-2 text-text-muted text-xs">or</span>
            </div>

            <button
              onClick={handleDemo}
              className="btn-secondary w-full"
            >
              Continue with Demo (Offline)
            </button>
          </div>
        </div>

        <p className="text-center text-text-muted text-xs mt-6">
          Demo mode stores everything locally. No account needed.
        </p>
      </div>
    </div>
  )
}
