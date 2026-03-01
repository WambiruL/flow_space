import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, isToday, isTomorrow, isPast } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | null): string {
  if (!date) return '—'
  const d = new Date(date)
  if (isToday(d)) return 'Today'
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
  2: 'Low',
  3: 'Moderate',
  4: 'Energized',
  5: 'Peak',
}

export const MOOD_LABELS: Record<number, string> = {
  1: 'Rough',
  2: 'Meh',
  3: 'Okay',
  4: 'Good',
  5: 'Great',
}

export const CATEGORY_COLORS: Record<string, string> = {
  Creative: 'text-purple-400 bg-purple-400/10',
  Career: 'text-accent-warm bg-accent-warm/10',
  Learning: 'text-blue-400 bg-blue-400/10',
  Personal: 'text-green-400 bg-green-400/10',
}

export const PRIORITY_COLORS: Record<string, string> = {
  Low: 'text-status-low bg-status-low/10',
  Medium: 'text-status-paused bg-status-paused/10',
  High: 'text-status-high bg-status-high/10',
}

export const STATUS_COLORS: Record<string, string> = {
  Active: 'text-status-active',
  Paused: 'text-status-paused',
  Completed: 'text-status-completed',
}
