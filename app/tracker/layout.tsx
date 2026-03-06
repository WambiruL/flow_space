'use client'

/**
 * app/dashboard/layout.tsx
 */

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useStore } from '@/store'
import { createClient } from '@supabase/supabase-js'
import {
  LayoutDashboard, FolderKanban, CheckSquare, Brain,
  BarChart2, Zap, Wifi, WifiOff, Menu, X, LogOut, Flame
} from 'lucide-react'
import { cn } from '@/lib/utils'
import OnlineSync from '@/components/OnlineSync'
import { ToastProvider } from '@/components/toast'

const NAV = [
  { href: '/dashboard',   label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/projects',    label: 'Projects',      icon: FolderKanban    },
  { href: '/tasks',       label: 'Tasks',         icon: CheckSquare     },
  { href: '/reflections', label: 'Inner Council', icon: Brain           },
  { href: '/tracker',     label: 'Mood & Focus',  icon: BarChart2       },
  { href: '/vault',       label: 'Brain Dump',    icon: Zap             },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname                             = usePathname()
  const router                               = useRouter()
  const { isOnline, setIsOnline, setUserId } = useStore()
  const [sidebarOpen, setSidebarOpen]        = useState(false)
  const [loggingOut,  setLoggingOut]         = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      // DataLoader's onAuthStateChange fires here and handles the redirect
      await supabase.auth.signOut()
    } catch (e) {
      // signOut failed — force it anyway
    } finally {
      setUserId(null)
      // Clear localStorage so persisted store doesn't rehydrate on next visit
      localStorage.removeItem('flowspace-store')
      // Hard redirect — clears all in-memory state, router.push is not enough
      window.location.href = '/auth'
    }
  }

  useEffect(() => {
    const on  = () => setIsOnline(true)
    const off = () => setIsOnline(false)
    setIsOnline(navigator.onLine)
    window.addEventListener('online',  on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online',  on)
      window.removeEventListener('offline', off)
    }
  }, [setIsOnline])

  const SidebarContent = () => (
    <div className="flex flex-col h-full">

      {/* Logo */}
      <div className="px-5 pt-6 pb-5" style={{  borderBottom: '1px solid #6B2420' }}>
        <Link href="/" className="flex items-center gap-2.5 mb-1">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background:'linear-gradient(135deg, #A44200, #D58936)', boxShadow: '0 0 12px #A4420038' }}
          >
            <Flame size={13} style={{ color: '#F2F3AE' }} />
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold" style={{ color: '#F2F3AE' }}>
              Flow<span style={{
                background: 'linear-gradient(135deg, #D58936, #F2F3AE)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Space</span>
            </h1>
            <p className="text-xs" style={{ color: '#8A8A45' }}>Personal Mental OS</p>
          </div>
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200',
                !active && 'hover:bg-bg-hover',
              )}
              style={active ? {
                background: 'linear-gradient(135deg, #A44200 0%, #D58936 100%)',
                color: '#F2F3AE',
                fontWeight: 600,
                boxShadow: '0 0 12px #A4420030',
              } : {
                color: '#8A8A45',
              }}
              onMouseEnter={e => {
                if (!active) (e.currentTarget as HTMLElement).style.color = '#C8C97A'
              }}
              onMouseLeave={e => {
                if (!active) (e.currentTarget as HTMLElement).style.color = '#8A8A45'
              }}
            >
              <Icon size={15} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer — online status + logout */}
      <div className="px-3 py-3 space-y-1" style={{ borderTop: '1px solid rgba(107,36,32,0.40)' }}>

        {/* Online status */}
        <div className="flex items-center gap-2 px-3 py-1.5 text-xs">
          {isOnline ? (
            <>
              <Wifi size={11} style={{ color: '#D58936' }} />
              <span style={{ color: '#D58936' }}>Connected</span>
            </>
          ) : (
            <>
              <WifiOff size={11} style={{ color: '#E8855A' }} />
              <span style={{ color: '#E8855A', fontWeight: 600 }}>Offline</span>
            </>
          )}
        </div>

        {/* Sign out */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm transition-all duration-150 disabled:opacity-50"
          style={{ color: '#8A8A45' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#C8C97A')}
          onMouseLeave={e => (e.currentTarget.style.color = '#8A8A45')}
        >
          <LogOut size={13} />
          {loggingOut ? 'Signing out…' : 'Sign out'}
        </button>

      </div>
    </div>
  )

  return (
    <ToastProvider>
      <div className="flex h-screen overflow-hidden" style={{ background: '#3C1518' }}>

        {/* Desktop sidebar */}
        <aside
          className="hidden md:flex w-56 flex-shrink-0 flex-col"
          style={{
            background: 'linear-gradient(180deg, #3A1214 0%, #2E0F11 100%)',
            borderRight: '1px solid #6B2420',
          }}
        >
          <SidebarContent />
        </aside>

        

        {/* Mobile sidebar drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <aside
              className="absolute left-0 top-0 bottom-0 w-56 flex flex-col animate-slide-up"
              style={{
                background: 'linear-gradient(180deg, #2E1012 0%, #250D0F 100%)',
                borderRight: '1px solid rgba(107,36,32,0.40)',
              }}
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 transition-colors"
                style={{ color: '#6B2420' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#C8C97A')}
                onMouseLeave={e => (e.currentTarget.style.color = '#6B2420')}
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
              <SidebarContent />
            </aside>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Mobile top bar */}
          <header
            className="md:hidden flex items-center justify-between px-4 py-3"
            style={{
              background: '#2E1012',
              borderBottom: '1px solid rgba(107,36,32,0.40)',
            }}
          >
            <button
              onClick={() => setSidebarOpen(true)}
              style={{ color: '#8A8A45' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#C8C97A')}
              onMouseLeave={e => (e.currentTarget.style.color = '#8A8A45')}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <Link href="/" className="font-display text-lg" style={{ color: '#F2F3AE' }}>
              Flow<span style={{
                background: 'linear-gradient(135deg, #D58936, #F2F3AE)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Space</span>
            </Link>
            <div className="w-6" />
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-5xl mx-auto px-4 md:px-6 py-6">
              {children}
            </div>
          </main>

        </div>

        <OnlineSync />
      </div>
    </ToastProvider>
  )
}