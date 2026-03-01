'use client'

import { useState, useMemo } from 'react'
import { useStore } from '@/store'
import { format, subDays, parseISO, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, BarChart, Bar
} from 'recharts'
import { cn, MOOD_LABELS, ENERGY_LABELS } from '@/lib/utils'
import { Plus, BarChart2 } from 'lucide-react'

export default function TrackerPage() {
  const { moodEntries, addMoodEntry, updateMoodEntry } = useStore()
  const [view, setView] = useState<'log' | 'weekly' | 'monthly'>('log')

  const today = new Date().toISOString().split('T')[0]
  const todayEntry = moodEntries.find(e => e.date === today)

  const [mood, setMood] = useState(todayEntry?.mood || 3)
  const [focus, setFocus] = useState(todayEntry?.focus || 3)
  const [energy, setEnergy] = useState(todayEntry?.energy || 3)
  const [journal, setJournal] = useState(todayEntry?.journal || '')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    const data = { date: today, mood, focus, energy, journal }
    if (todayEntry) {
      updateMoodEntry(todayEntry.id, data)
    } else {
      addMoodEntry(data)
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  // Chart data
  const last30Days = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const date = format(subDays(new Date(), 29 - i), 'yyyy-MM-dd')
      const entry = moodEntries.find(e => e.date === date)
      return {
        date: format(parseISO(date), 'MMM d'),
        mood: entry?.mood || null,
        focus: entry?.focus || null,
        energy: entry?.energy || null,
      }
    }).filter(d => d.mood !== null)
  }, [moodEntries])

  const last7Days = last30Days.slice(-7)

  const customTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-bg-card border border-border-default rounded-lg px-3 py-2 text-xs">
        <p className="text-text-muted mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey} style={{ color: p.color }}>{p.name}: {p.value}</p>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2">
        <BarChart2 size={22} className="text-blue-400" />
        <h1 className="font-display text-2xl">Mood & Focus</h1>
      </div>

      {/* Tab Nav */}
      <div className="flex gap-2">
        {(['log', 'weekly', 'monthly'] as const).map(v => (
          <button key={v} onClick={() => setView(v)}
            className={cn('px-4 py-1.5 rounded-lg text-sm capitalize transition-colors',
              view === v ? 'bg-accent-warm text-bg-primary' : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
            )}>
            {v === 'log' ? "Today's Log" : v === 'weekly' ? '7 Days' : '30 Days'}
          </button>
        ))}
      </div>

      {view === 'log' && (
        <div className="space-y-5 animate-slide-up">
          <div className="card">
            <h3 className="font-medium text-text-primary mb-1">Log for {format(new Date(), 'MMMM d, yyyy')}</h3>
            {todayEntry && <p className="text-xs text-status-active mb-4">✓ Logged today</p>}

            <div className="space-y-5">
              <RatingInput label="Mood" value={mood} onChange={setMood} labels={MOOD_LABELS} color="text-purple-400" />
              <RatingInput label="Focus" value={focus} onChange={setFocus} labels={{ 1: 'Scattered', 2: 'Distracted', 3: 'Average', 4: 'Sharp', 5: 'Flow State' }} color="text-blue-400" />
              <RatingInput label="Energy" value={energy} onChange={setEnergy} labels={ENERGY_LABELS} color="text-accent-warm" />
              <div>
                <label className="label block mb-2">Journal Entry</label>
                <textarea value={journal} onChange={e => setJournal(e.target.value)}
                  placeholder="What's on your mind today? Any wins, frustrations, or observations?"
                  className="input resize-none h-28" />
              </div>
            </div>

            <button onClick={handleSave} className={cn('btn-primary mt-4', saved && 'bg-status-active')}>
              {saved ? '✓ Saved' : todayEntry ? 'Update Entry' : 'Save Entry'}
            </button>
          </div>

          {/* Recent entries */}
          <div>
            <h3 className="section-title mb-3">Recent Entries</h3>
            {moodEntries.length === 0 ? (
              <div className="card text-center py-8 text-text-muted text-sm">Start logging to build your history.</div>
            ) : (
              <div className="space-y-2">
                {moodEntries.slice(0, 7).map(entry => (
                  <div key={entry.id} className="card flex items-center gap-4">
                    <div className="text-text-muted text-sm w-20">{format(parseISO(entry.date), 'MMM d')}</div>
                    <div className="flex gap-3 text-sm">
                      <span className="text-purple-400">😐 {entry.mood}</span>
                      <span className="text-blue-400">🎯 {entry.focus}</span>
                      <span className="text-accent-warm">⚡ {entry.energy}</span>
                    </div>
                    {entry.journal && <p className="text-text-muted text-xs flex-1 truncate">{entry.journal}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {(view === 'weekly' || view === 'monthly') && (
        <div className="space-y-6 animate-slide-up">
          {last30Days.length === 0 ? (
            <div className="card text-center py-12 text-text-muted">
              Log a few days to see charts here.
            </div>
          ) : (
            <>
              <div className="card">
                <h3 className="text-text-secondary text-sm mb-4">Mood over time</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={view === 'weekly' ? last7Days : last30Days}>
                    <defs>
                      <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f1f2e" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#5a5a72' }} />
                    <YAxis domain={[1, 5]} tick={{ fontSize: 11, fill: '#5a5a72' }} />
                    <Tooltip content={customTooltip} />
                    <Area type="monotone" dataKey="mood" name="Mood" stroke="#a855f7" fill="url(#moodGrad)" strokeWidth={2} dot={false} connectNulls />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="card">
                <h3 className="text-text-secondary text-sm mb-4">Focus & Energy</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={view === 'weekly' ? last7Days : last30Days}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f1f2e" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#5a5a72' }} />
                    <YAxis domain={[1, 5]} tick={{ fontSize: 11, fill: '#5a5a72' }} />
                    <Tooltip content={customTooltip} />
                    <Line type="monotone" dataKey="focus" name="Focus" stroke="#60a5fa" strokeWidth={2} dot={false} connectNulls />
                    <Line type="monotone" dataKey="energy" name="Energy" stroke="#f0a050" strokeWidth={2} dot={false} connectNulls />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Avg Mood', value: avg(last30Days.map(d => d.mood)), color: 'text-purple-400' },
                  { label: 'Avg Focus', value: avg(last30Days.map(d => d.focus)), color: 'text-blue-400' },
                  { label: 'Avg Energy', value: avg(last30Days.map(d => d.energy)), color: 'text-accent-warm' },
                ].map(stat => (
                  <div key={stat.label} className="card text-center">
                    <div className={cn('text-2xl font-display', stat.color)}>{stat.value}</div>
                    <div className="text-text-muted text-xs mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function avg(nums: (number | null)[]): string {
  const valid = nums.filter(n => n !== null) as number[]
  if (!valid.length) return '—'
  return (valid.reduce((a, b) => a + b, 0) / valid.length).toFixed(1)
}

function RatingInput({ label, value, onChange, labels, color }: {
  label: string; value: number; onChange: (v: number) => void
  labels: Record<number, string>; color: string
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className={cn('label', color)}>{label}</label>
        <span className="text-text-muted text-xs">{labels[value]}</span>
      </div>
      <div className="flex gap-2">
        {[1,2,3,4,5].map(n => (
          <button key={n} onClick={() => onChange(n)}
            className={cn('flex-1 h-10 rounded-lg text-sm font-medium transition-all',
              value === n ? `bg-accent-warm text-bg-primary shadow-lg` : 'bg-bg-tertiary text-text-muted hover:text-text-primary'
            )}>
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}
