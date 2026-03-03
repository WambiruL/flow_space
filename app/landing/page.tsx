'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'


const FEATURES = [
  { icon: '⬡', name: 'Dashboard',     desc: 'A calm morning briefing: energy check-in, active projects at a glance, and tasks matched to how you feel right now.' },
  { icon: '◫', name: 'Projects',      desc: 'Track every project — creative, career, learning, personal — with progress auto-calculated from linked tasks.' },
  { icon: '◻', name: 'Smart Tasks',   desc: 'Energy-aware task engine. Low energy? Light tasks surface. High energy? Your highest-impact work comes forward.' },
  { icon: '◈', name: 'Inner Council', desc: 'Five inner voices — Ambition, Fear, Stoic, Relationships, Creative — to help you think through any hard decision.' },
  { icon: '◌', name: 'Mood Tracker',  desc: 'Log your daily mood, focus, and energy. Spot patterns over time with clean weekly and monthly charts.' },
  { icon: '⚡', name: 'Brain Dump',   desc: 'A low-friction vault for everything unprocessed. Tag, search, and convert any idea into a task or project.' },
]

const STEPS = [
  { n: '01', name: 'Check in with yourself',    desc: 'Set your energy level each day. FlowSpace uses this to filter and rank what deserves your attention first.' },
  { n: '02', name: 'See your landscape',         desc: 'Projects, tasks, and patterns on one calm screen. No noise, no clutter. Just what matters.' },
  { n: '03', name: 'Work with intention',        desc: 'The smart task engine surfaces the right work for your current state. Overloaded? It will tell you before you burn out.' },
  { n: '04', name: 'Process the hard things',   desc: 'When a decision weighs on you, the Inner Council walks you through five structured perspectives to find clarity.' },
]

export default function LandingPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)  
  useEffect(() => {
  const checkUser = async () => {
    const {
      data: { user }
    } = await supabase.auth.getUser()

    setUser(user ?? null)
    setLoading(false)
    }
    checkUser()
    const { data: listener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
        setUser(session?.user ?? null)
        }
    )
    return () => {
        listener.subscription.unsubscribe()
    }
    }, [])
    const router = useRouter()

  return (
    <div className="min-h-screen bg-bg-primary font-body">

      {/* Nav */}
      <nav className="sticky top-0 z-10 bg-bg-primary border-b border-border-default flex items-center justify-between px-12 py-5">
        <span className="font-display text-lg text-text-primary">
          Flow<em className="not-italic text-accent-warm">Space</em>
        </span>
        <div className="flex items-center gap-2">
        {!loading && user ? (
            <>
            <button
                onClick={() => router.push('/dashboard')}
                className="btn-primary"
            >
                Go to dashboard
            </button>
            <button
                onClick={async () => {
                await supabase.auth.signOut()
                router.refresh()
                }}
                className="btn-ghost"
            >
                Sign out
            </button>
            </>
        ) : (
            <>
            <button
                onClick={() => router.push('/auth')}
                className="btn-ghost"
            >
                Sign in
            </button>
            <button
                onClick={() => router.push('/auth?mode=signup')}
                className="btn-primary"
            >
                Get started
            </button>
            </>
        )}
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto text-center px-6 py-24">
        <div className="inline-block text-xs font-medium uppercase tracking-widest text-accent-warm bg-accent-warm-glow border border-accent-warm/20 px-4 py-1.5 rounded-full mb-8">
          Personal mental operating system
        </div>
        <h1 className="font-display text-5xl text-text-primary leading-tight tracking-tight mb-6">
          Think clearly.<br />
          Work with <em className="text-accent-warm">intention.</em><br />
          Feel less overwhelmed.
        </h1>
        <p className="text-text-secondary text-lg font-light leading-relaxed max-w-xl mx-auto mb-10">
          FlowSpace is a private, calm space for creative professionals who are juggling too much.
          Structure for your projects, intelligence for your tasks, and reflection for your decisions.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={() => router.push(user ? '/dashboard':'/auth?mode=signup')} className="btn-primary px-7 py-3 text-base">
            Start for free
          </button>
          <button onClick={() => router.push('/auth?demo=true')} className="btn-secondary px-7 py-3 text-base">
            Try the demo first
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <p className="text-center text-xs font-medium uppercase tracking-widest text-text-muted mb-3">What's inside</p>
        <h2 className="font-display text-3xl text-text-primary text-center mb-12">
          Everything your mind needs,<br />nothing it doesn't
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(f => (
            <div key={f.name} className="card-hover">
              <div className="w-10 h-10 bg-bg-secondary rounded-xl flex items-center justify-center text-lg mb-4">
                {f.icon}
              </div>
              <div className="font-display text-base text-text-primary mb-2">{f.name}</div>
              <div className="text-text-secondary text-sm font-light leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-bg-secondary border-y border-border-default py-20 px-6">
        <div className="max-w-xl mx-auto">
          <h2 className="font-display text-3xl text-text-primary text-center mb-12">How FlowSpace works</h2>
          {STEPS.map(s => (
            <div key={s.n} className="flex gap-5 mb-8">
              <div className="font-display text-2xl text-accent-warm flex-shrink-0 w-8 pt-0.5">{s.n}</div>
              <div>
                <div className="text-sm font-medium text-text-primary mb-1">{s.name}</div>
                <div className="text-sm text-text-secondary font-light leading-relaxed">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-lg mx-auto text-center px-6 py-20">
        <h2 className="font-display text-3xl text-text-primary mb-4">
          Your mind deserves<br />a better operating system.
        </h2>
        <p className="text-text-muted text-sm font-light leading-relaxed mb-8">
          No ads. No noise. No data sent anywhere.<br />
          Everything lives privately in your browser.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={() => router.push('/auth?mode=signup')} className="btn-primary px-7 py-3 text-base">
            Create your space
          </button>
          <button onClick={() => router.push('/auth?demo=true')} className="btn-secondary px-7 py-3 text-base">
            Explore the demo
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-default px-12 py-6 flex items-center justify-between text-xs text-text-muted">
        <span className="font-display text-sm text-text-primary">
          Flow<em className="not-italic text-accent-warm">Space</em>
        </span>
        <span>All data stored privately in your browser.</span>
      </footer>

    </div>
  )
}