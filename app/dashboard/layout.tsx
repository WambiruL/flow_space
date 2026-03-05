'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useStore } from '@/store'
import {
  LayoutDashboard, FolderKanban, CheckSquare, Brain,
  BarChart2, Zap, WifiOff, Menu, X, Flame,
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
  const pathname = usePathname()
  const { isOnline, setIsOnline } = useStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
      <div className="px-5 pt-6 pb-5" style={{ borderBottom: '1px solid #6B2420' }}>
        <div className="flex items-center gap-2.5 mb-1">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #A44200, #D58936)',
              boxShadow: '0 0 12px #A4420038',
            }}
          >
            <Flame size={13} style={{ color: '#F2F3AE' }} />
          </div>
          <h1 className="font-display text-xl font-semibold" style={{ color: '#F2F3AE' }}>
            Flow
            <span style={{
              background: 'linear-gradient(135deg, #D58936, #F2F3AE)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Space
            </span>
          </h1>
        </div>
        <p className="text-xs pl-9" style={{ color: '#8A8A45' }}>Personal Mental OS</p>
      </div>

      {/* Nav */}
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
                background: 'linear-gradient(135deg, #A44200 0%, #C05020 100%)',
                color: '#F2F3AE',
                fontWeight: 600,
                boxShadow: '0 0 12px #A4420030',
              } : {
                color: '#8A8A45',
              }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = '#C8C97A' }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = '#8A8A45' }}
            >
              <Icon size={15} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4" style={{ borderTop: '1px solid #6B2420' }}>
        <div className="flex items-center gap-2 text-xs">
          {isOnline ? (
            <>
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: '#D58936', boxShadow: '0 0 5px #D5893668' }}
              />
              <span style={{ color: '#8A8A45' }}>Everything synced</span>
            </>
          ) : (
            <>
              <WifiOff size={11} style={{ color: '#E8855A' }} />
              <span style={{ color: '#E8855A' }} className="font-medium">Offline</span>
            </>
          )}
        </div>
      </div>

    </div>
  )

  return (
    <ToastProvider>
      <div className="flex h-screen overflow-hidden" style={{ background: '#3C1518' }}>

        {/* Desktop sidebar */}
        <aside
          className="hidden md:flex flex-shrink-0 flex-col"
          style={{
            width: '228px',
            background: 'linear-gradient(180deg, #451A1D 0%, #3C1518 100%)',
            borderRight: '1px solid #6B2420',
          }}
        >
          <SidebarContent />
        </aside>

        {/* Mobile drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 backdrop-blur-sm"
              style={{ background: 'rgba(60,21,24,0.75)' }}
              onClick={() => setSidebarOpen(false)}
            />
            <aside
              className="absolute left-0 top-0 bottom-0 w-56 flex flex-col animate-slide-up"
              style={{
                background: 'linear-gradient(180deg, #451A1D 0%, #3C1518 100%)',
                borderRight: '1px solid #6B2420',
              }}
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 transition-colors"
                style={{ color: '#8A8A45' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#C8C97A')}
                onMouseLeave={e => (e.currentTarget.style.color = '#8A8A45')}
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
              <SidebarContent />
            </aside>
          </div>
        )}

        {/* Main */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Mobile header */}
          <header
            className="md:hidden flex items-center justify-between px-4 py-3"
            style={{
              background: '#451A1D',
              borderBottom: '1px solid #6B2420',
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
            <span className="font-display text-lg font-semibold" style={{ color: '#F2F3AE' }}>
              Flow
              <span style={{
                background: 'linear-gradient(135deg, #D58936, #F2F3AE)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Space
              </span>
            </span>
            <div className="w-6" />
          </header>

          <main className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-4 md:px-7 py-7">
              {children}
            </div>
          </main>

        </div>

        <OnlineSync />
      </div>
    </ToastProvider>
  )
}