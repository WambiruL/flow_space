'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useStore } from '@/store'
import {
  LayoutDashboard, FolderKanban, CheckSquare, Brain,
  BarChart2, Zap, Settings, Wifi, WifiOff, Menu, X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import OnlineSync from '@/components/OnlineSync'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/reflections', label: 'Inner Council', icon: Brain },
  { href: '/tracker', label: 'Mood & Focus', icon: BarChart2 },
  { href: '/vault', label: 'Brain Dump', icon: Zap },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { isOnline, setIsOnline } = useStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    setIsOnline(navigator.onLine)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [setIsOnline])

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-border-subtle">
        <h1 className="font-display text-xl text-text-primary">
          Flow<span className="text-accent-warm">Space</span>
        </h1>
        <p className="text-xs text-text-muted mt-0.5">Mental OS</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setSidebarOpen(false)}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150',
              pathname === href
                ? 'bg-accent-warm/10 text-accent-warm border border-accent-warm/20'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
            )}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Status */}
      <div className="px-4 py-3 border-t border-border-subtle">
        <div className="flex items-center gap-2 text-xs">
          {isOnline ? (
            <><Wifi size={12} className="text-status-active" /><span className="text-text-muted">Connected</span></>
          ) : (
            <><WifiOff size={12} className="text-status-paused" /><span className="text-status-paused">Offline</span></>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-bg-primary overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-56 flex-shrink-0 bg-bg-secondary border-r border-border-subtle flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-56 bg-bg-secondary border-r border-border-subtle flex flex-col animate-slide-up">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-text-secondary hover:text-text-primary"
            >
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-bg-secondary">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={20} className="text-text-secondary" />
          </button>
          <h1 className="font-display text-lg">Flow<span className="text-accent-warm">Space</span></h1>
          <div className="w-6" />
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 md:px-6 py-6">
            {children}
          </div>
        </main>
      </div>

      <OnlineSync />
    </div>
  )
}
