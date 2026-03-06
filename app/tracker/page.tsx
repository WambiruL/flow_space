'use client'

import { useState, useMemo } from 'react'
import { useStore } from '@/store'
import { format, subDays, parseISO } from 'date-fns'
import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { cn, MOOD_LABELS, ENERGY_LABELS } from '@/lib/utils'
import { Check } from 'lucide-react'

const TABS = [
  { id: 'log',     label: "Today's Log" },
  { id: 'weekly',  label: '7 Days'      },
  { id: 'monthly', label: '30 Days'     },
] as const
type Tab = typeof TABS[number]['id']

export default function TrackerPage() {
  const { moodEntries, addMoodEntry, updateMoodEntry } = useStore()
  const [view, setView] = useState<Tab>('log')

  const today      = new Date().toISOString().split('T')[0]
  const todayEntry = moodEntries.find(e => e.date === today)

  const [mood,    setMood]    = useState(todayEntry?.mood    ?? 3)
  const [focus,   setFocus]   = useState(todayEntry?.focus   ?? 3)
  const [energy,  setEnergy]  = useState(todayEntry?.energy  ?? 3)
  const [journal, setJournal] = useState(todayEntry?.journal ?? '')
  const [saved,   setSaved]   = useState(false)

  const handleSave = () => {
    const data = { date: today, mood, focus, energy, journal }
    if (todayEntry) updateMoodEntry(todayEntry.id, data)
    else             addMoodEntry(data)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const last30 = useMemo(() => Array.from({ length: 30 }, (_, i) => {
    const date  = format(subDays(new Date(), 29 - i), 'yyyy-MM-dd')
    const entry = moodEntries.find(e => e.date === date)
    return {
      date:   format(parseISO(date), 'MMM d'),
      mood:   entry?.mood   ?? null,
      focus:  entry?.focus  ?? null,
      energy: entry?.energy ?? null,
    }
  }).filter(d => d.mood !== null), [moodEntries])

  const chartData = view === 'weekly' ? last30.slice(-7) : last30

  const ChartTip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
      <div className="rounded-xl px-3 py-2.5 text-xs"
        style={{ background: '#4A1A1C', border: '1px solid #7D2D20', boxShadow: '0 4px 16px #00000060' }}>
        <p className="font-semibold mb-1.5" style={{ color: '#C8C97A' }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey} className="mb-0.5" style={{ color: p.color }}>
            {p.name}: <span className="font-bold">{p.value}</span>
          </p>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">

      <div>
          <h1 className="font-display text-4xl font-semibold" style={{ color: '#F2F3AE' }}>Mood & Focus</h1>
        <p className="text-sm mt-1" style={{ color: '#8A8A45' }}>Track how you're doing — patterns reveal a lot.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-0" style={{ borderBottom: '1px solid #6B2420' }}>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setView(tab.id)}
            className={cn('px-5 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 -mb-px',
              view === tab.id ? 'border-rust-vivid' : 'border-transparent')}
            style={{ color: view === tab.id ? '#F2F3AE' : '#8A8A45',
                     borderBottomColor: view === tab.id ? '#A44200' : 'transparent' }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Log view */}
      {view === 'log' && (
        <div className="space-y-5 animate-slide-up">
          <div className="card-accent space-y-6">

            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-sm" style={{ color: '#F2F3AE', fontFamily: "'Nunito', sans-serif"}}>
                {format(new Date(), 'MMMM d, yyyy')}
              </h3>
              {todayEntry && (
                <span className="text-xs font-medium flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                  style={{ background: '#D5893622', color: '#E8B84B', border: '1px solid #D5893630' }}>
                  <Check size={10} strokeWidth={3} /> Logged today
                </span>
              )}
            </div>

            <RatingRow label="Mood"   emoji="🌡" value={mood}   onChange={setMood}
              labelMap={MOOD_LABELS}
              activeColor="#F2F3AE" activeGrad="linear-gradient(135deg, #C8C97A, #F2F3AE)" />
            <RatingRow label="Focus"  emoji="🎯" value={focus}  onChange={setFocus}
              labelMap={{ 1:'Scattered', 2:'Distracted', 3:'Average', 4:'Sharp', 5:'Flow State' }}
              activeColor="#D58936" activeGrad="linear-gradient(135deg, #A44200, #D58936)" />
            <RatingRow label="Energy" emoji="⚡" value={energy} onChange={setEnergy}
              labelMap={ENERGY_LABELS}
              activeColor="#E8B84B" activeGrad="linear-gradient(135deg, #D58936, #E8B84B)" />

            <div>
              <label className="label block mb-2">
                Journal entry <span className="normal-case font-normal" style={{ color: '#8A8A45' }}>(optional)</span>
              </label>
              <textarea value={journal} onChange={e => setJournal(e.target.value)}
                placeholder="What's on your mind? Any wins, stuck points, or observations for today…"
                className="input resize-none h-28 leading-relaxed" />
            </div>

            <button onClick={handleSave} className={saved ? 'btn-secondary' : 'btn-primary'}
              style={saved ? { color: '#D58936', borderColor: '#D5893640' } : {}}>
              {saved ? <><Check size={14} strokeWidth={3} /> Saved!</> : todayEntry ? 'Update entry' : 'Save entry'}
            </button>
          </div>

          {moodEntries.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🕯️</div>
              <p className="empty-state-text">Start logging to build your history.</p>
            </div>
          ) : (
            <div>
              <h3 className="section-title mb-3">Recent entries</h3>
              <div className="space-y-2">
                {moodEntries.slice(0, 7).map(entry => (
                  <div key={entry.id} className="card-hover flex items-center gap-4">
                    <div className="text-sm font-semibold w-14 flex-shrink-0" style={{ color: '#8A8A45' }}>
                      {format(parseISO(entry.date), 'MMM d')}
                    </div>
                    <div className="flex gap-4 text-sm">
                      <span style={{ color: '#C8C97A' }}>🌡 <span className="font-bold">{entry.mood}</span></span>
                      <span style={{ color: '#D58936' }}>🎯 <span className="font-bold">{entry.focus}</span></span>
                      <span style={{ color: '#E8B84B' }}>⚡ <span className="font-bold">{entry.energy}</span></span>
                    </div>
                    {entry.journal && (
                      <p className="text-xs flex-1 truncate italic hidden sm:block" style={{ color: '#8A8A45' }}>
                        "{entry.journal}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Charts view */}
      {(view === 'weekly' || view === 'monthly') && (
        <div className="space-y-5 animate-slide-up">
          {chartData.length < 2 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📈</div>
              <p className="empty-state-text">Log a few days to see your charts here.</p>
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3" style={{ color: '#F2F3AE', fontFamily: "'Nunito', sans-serif"}}>
                {[
                  { label: 'Avg Mood',   value: avg(chartData.map(d => d.mood)),   color: '#F2F3AE', emoji: '🌡' },
                  { label: 'Avg Focus',  value: avg(chartData.map(d => d.focus)),  color: '#D58936', emoji: '🎯' },
                  { label: 'Avg Energy', value: avg(chartData.map(d => d.energy)), color: '#E8B84B', emoji: '⚡' },
                ].map(s => (
                  <div key={s.label} className="stat-card">
                    <div className="text-xl mb-1.5">{s.emoji}</div>
                    <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                    <div className="stat-label">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Mood chart */}
              <div className="card">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#8A8A45' }}>Mood over time</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#F2F3AE' }} />
                    <span className="text-xs" style={{ color: '#8A8A45' }}>Mood</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={190}>
                  <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="moodFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#F2F3AE" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#F2F3AE" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#6B2420" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#8A8A45' }} tickLine={false} axisLine={false} />
                    <YAxis domain={[1,5]} ticks={[1,2,3,4,5]} tick={{ fontSize: 10, fill: '#8A8A45' }} tickLine={false} axisLine={false} />
                    <Tooltip content={<ChartTip />} />
                    <Area type="monotone" dataKey="mood" name="Mood" stroke="#F2F3AE" fill="url(#moodFill)" strokeWidth={2.5} dot={false} connectNulls />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Focus + Energy chart */}
              <div className="card">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#8A8A45' }}>Focus & Energy</h3>
                  <div className="flex items-center gap-4">
                    {[{ color: '#D58936', label: 'Focus' }, { color: '#E8B84B', label: 'Energy' }].map(l => (
                      <div key={l.label} className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
                        <span className="text-xs" style={{ color: '#8A8A45' }}>{l.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={190}>
                  <LineChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#6B2420" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#8A8A45' }} tickLine={false} axisLine={false} />
                    <YAxis domain={[1,5]} ticks={[1,2,3,4,5]} tick={{ fontSize: 10, fill: '#8A8A45' }} tickLine={false} axisLine={false} />
                    <Tooltip content={<ChartTip />} />
                    <Line type="monotone" dataKey="focus"  name="Focus"  stroke="#D58936" strokeWidth={2.5} dot={false} connectNulls />
                    <Line type="monotone" dataKey="energy" name="Energy" stroke="#E8B84B" strokeWidth={2.5} dot={false} connectNulls />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      )}

    </div>
  )
}

function avg(nums: (number | null)[]): string {
  const v = nums.filter(n => n !== null) as number[]
  if (!v.length) return '—'
  return (v.reduce((a, b) => a + b, 0) / v.length).toFixed(1)
}

function RatingRow({ label, emoji, value, onChange, labelMap, activeColor, activeGrad }: {
  label: string; emoji: string; value: number; onChange: (n: number) => void
  labelMap: Record<number, string>; activeColor: string; activeGrad: string
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span>{emoji}</span>
          <span className="label" style={{ color: activeColor }}>{label}</span>
        </div>
        <span className="text-xs" style={{ color: '#8A8A45' }}>{labelMap[value]}</span>
      </div>
      <div className="flex gap-2">
        {[1,2,3,4,5].map(n => (
          <button key={n} onClick={() => onChange(n)}
            className="flex-1 h-11 rounded-xl text-sm font-semibold transition-all duration-200"
            style={value === n ? {
              background: activeGrad, color: '#3C1518',
              boxShadow: `0 0 16px ${activeColor}35`,
            } : {
              background: '#451A1D', color: '#8A8A45', border: '1px solid #6B2420',
            }}
            onMouseEnter={e => { if (value !== n) (e.currentTarget as HTMLElement).style.borderColor = '#7D2D20' }}
            onMouseLeave={e => { if (value !== n) (e.currentTarget as HTMLElement).style.borderColor = '#6B2420' }}>
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}