import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, isToday, isTomorrow, isPast } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | null): string {
  if (!date) return '—'
  const d = new Date(date)
  if (isToday(d))    return 'Today'
  if (isTomorrow(d)) return 'Tomorrow'
  return format(d, 'MMM d')
}

export function isOverdue(date: string | null): boolean {
  if (!date) return false
  return isPast(new Date(date)) && !isToday(new Date(date))
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export const ENERGY_LABELS: Record<number, string> = {
  1: 'Exhausted',
  2: 'Low energy',
  3: 'Moderate',
  4: 'Energised',
  5: 'Peak',
}

export const MOOD_LABELS: Record<number, string> = {
  1: 'Rough',
  2: 'Meh',
  3: 'Okay',
  4: 'Good',
  5: 'Great',
}

// Used in older dashboard page — kept for compatibility
export const CATEGORY_COLORS: Record<string, string> = {
  Creative: 'text-purple-300 bg-purple-400/10',
  Career:   'text-amber-300  bg-amber-400/10',
  Learning: 'text-sky-300    bg-sky-400/10',
  Personal: 'text-green-mid  bg-green-mid/10',
}

export const PRIORITY_COLORS: Record<string, string> = {
  Low:    'text-green-mid  bg-green-vivid/10',
  Medium: 'text-amber-soft bg-amber-soft/10',
  High:   'text-red-300    bg-red-400/10',
}

export const STATUS_COLORS: Record<string, string> = {
  Active:    'text-status-active',
  Paused:    'text-status-paused',
  Completed: 'text-text-muted',
}