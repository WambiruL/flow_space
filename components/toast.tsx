'use client'

/**
 * components/Toast.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Toast notification system — futuristic green theme.
 *
 * SETUP: <ToastProvider> is already in app/dashboard/layout.tsx.
 *
 * USAGE in any client component:
 *   import { useToast, TASK_TOASTS } from '@/components/Toast'
 *   const { toast } = useToast()
 *   toast(TASK_TOASTS.created('Write docs'))
 * ─────────────────────────────────────────────────────────────────────────────
 */

import {
  createContext, useContext, useState, useCallback,
  useEffect, useRef, type ReactNode,
} from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Types ─────────────────────────────────────────────────────────────────────
export type ToastType = 'success' | 'error' | 'info'

export interface ToastOptions {
  type?:        ToastType
  title:        string
  description?: string
  duration?:    number
}

interface ToastItem extends Required<Omit<ToastOptions, 'description'>> {
  id:          string
  description: string | undefined
  exiting:     boolean
}

interface ToastContextValue { toast: (opts: ToastOptions) => void }

// ── Context ───────────────────────────────────────────────────────────────────
const ToastCtx = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToast() must be inside <ToastProvider>')
  return ctx
}

// ── Individual toast ──────────────────────────────────────────────────────────
function ToastCard({ item, onDismiss }: { item: ToastItem; onDismiss: (id: string) => void }) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    timerRef.current = setTimeout(() => onDismiss(item.id), item.duration)
    return () => clearTimeout(timerRef.current)
  }, [item.id, item.duration, onDismiss])

  const pause  = () => clearTimeout(timerRef.current)
  const resume = () => { timerRef.current = setTimeout(() => onDismiss(item.id), 1500) }

  const meta: Record<ToastType, { icon: ReactNode; iconClass: string; accentColor: string; label: string }> = {
    success: {
      icon: <CheckCircle2 size={14} />,
      iconClass: 'toast-icon toast-icon-success',
      accentColor: '#56C596',
      label: 'Success',
    },
    error: {
      icon: <AlertCircle size={14} />,
      iconClass: 'toast-icon toast-icon-error',
      accentColor: '#F07070',
      label: 'Error',
    },
    info: {
      icon: <Info size={14} />,
      iconClass: 'toast-icon toast-icon-info',
      accentColor: '#7EC8E3',
      label: 'Info',
    },
  }

  const { icon, iconClass, accentColor } = meta[item.type]

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn('toast', item.exiting ? 'animate-toast-out' : 'animate-toast-in')}
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      {/* Left glow bar */}
      <div
        className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full"
        style={{ background: `linear-gradient(180deg, ${accentColor}, ${accentColor}60)` }}
      />

      {/* Ambient glow behind icon */}
      <div
        className="absolute top-0 left-0 w-24 h-full opacity-20 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at left, ${accentColor}30, transparent 70%)` }}
      />

      {/* Icon */}
      <div className={iconClass}>{icon}</div>

      {/* Text */}
      <div className="flex-1 min-w-0 pl-1">
        <p className="font-semibold text-text-primary text-sm leading-snug">{item.title}</p>
        {item.description && (
          <p className="text-text-muted text-xs mt-0.5 leading-relaxed">{item.description}</p>
        )}
      </div>

      {/* Dismiss */}
      <button
        onClick={() => onDismiss(item.id)}
        className="flex-shrink-0 p-1.5 rounded-lg text-text-muted hover:text-text-secondary hover:bg-bg-hover transition-colors"
        aria-label="Dismiss"
      >
        <X size={11} />
      </button>

      {/* Bottom shimmer progress */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${accentColor}70 50%, transparent 100%)`,
          backgroundSize: '200% 100%',
          animation: `shimmer ${item.duration}ms linear`,
        }}
      />
    </div>
  )
}

// ── Provider ──────────────────────────────────────────────────────────────────
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t))
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 300)
  }, [])

  const toast = useCallback((opts: ToastOptions) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    setToasts(prev => [...prev.slice(-4), {  // max 5 toasts
      id,
      type:        opts.type        ?? 'success',
      title:       opts.title,
      description: opts.description,
      duration:    opts.duration    ?? 4000,
      exiting:     false,
    }])
  }, [])

  return (
    <ToastCtx.Provider value={{ toast }}>
      {children}
      <div
        aria-label="Notifications"
        className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2.5 pointer-events-none"
      >
        {toasts.map(item => (
          <ToastCard key={item.id} item={item} onDismiss={dismiss} />
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

// ── Presets ───────────────────────────────────────────────────────────────────
export const TASK_TOASTS = {
  created: (title: string): ToastOptions => ({
    type: 'success',
    title: '✦ Task captured',
    description: `"${title.length > 44 ? title.slice(0, 44) + '…' : title}" is in your flow.`,
    duration: 4200,
  }),
  completed: (title: string): ToastOptions => ({
    type: 'success',
    title: '◉ Marked complete',
    description: `"${title.length > 44 ? title.slice(0, 44) + '…' : title}" — nice work.`,
    duration: 3500,
  }),
  deleted: (): ToastOptions => ({
    type: 'info',
    title: 'Task removed',
    duration: 2500,
  }),
}

export const PROJECT_TOASTS = {
  created: (title: string): ToastOptions => ({
    type: 'success',
    title: '◈ Project created',
    description: `"${title}" is now active.`,
    duration: 4000,
  }),
  updated: (): ToastOptions => ({
    type: 'success',
    title: 'Project saved',
    duration: 2800,
  }),
}