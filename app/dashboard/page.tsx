'use client'

import { useStore } from '@/store'
// import { useRouter } from 'next/navigation'
import { useEffect, useState, JSX } from 'react'
import { recommendTasks, detectAlerts } from '@/lib/ai-engine'
import { cn, ENERGY_LABELS, formatDate } from '@/lib/utils'
import { Plus, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const GREET_ICON: Record<string, JSX.Element> = {
  morning: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D58936" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
      <circle cx="12" cy="12" r="4" fill="#D5893620"/>
    </svg>
  ),
  afternoon: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F2A74B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" fill="#F2A74B20"/>
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
  ),
  evening: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C9A8F5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#C9A8F520"/>
    </svg>
  ),
}

const ENERGY_ICONS: Record<number, JSX.Element> = {
  1: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 18a5 5 0 0 0-10 0"/>
      <line x1="12" y1="2" x2="12" y2="9"/>
      <line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/>
      <line x1="1" y1="18" x2="3" y2="18"/>
      <line x1="21" y1="18" x2="23" y2="18"/>
      <line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/>
      <line x1="23" y1="22" x2="1" y2="22"/>
      <polyline points="16 5 12 9 8 5"/>
    </svg>
  ),
  2: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="8" y1="15" x2="16" y2="15"/>
      <line x1="9" y1="9" x2="9.01" y2="9"/>
      <line x1="15" y1="9" x2="15.01" y2="9"/>
    </svg>
  ),
  3: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M8 13s1.5 2 4 2 4-2 4-2"/>
      <line x1="9" y1="9" x2="9.01" y2="9"/>
      <line x1="15" y1="9" x2="15.01" y2="9"/>
    </svg>
  ),
  4: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M8 13s1.5 3 4 3 4-3 4-3"/>
      <line x1="9" y1="9" x2="9.01" y2="9"/>
      <line x1="15" y1="9" x2="15.01" y2="9"/>
    </svg>
  ),
  5: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>
  ),
}

// Category colours mapped to the new palette
const CAT_STYLE: Record<string, { bg: string; color: string }> = {
  Creative: { bg: '#F2F3AE15', color: '#F2F3AE' },
  Career:   { bg: '#D5893618', color: '#D58936'  },
  Learning: { bg: '#E8855A18', color: '#E8855A'  },
  Personal: { bg: '#C8C97A18', color: '#C8C97A'  },
}

const PRIORITY_STYLE: Record<string, { bg: string; color: string }> = {
  High:   { bg: '#A4420020', color: '#E8855A' },
  Medium: { bg: '#D5893618', color: '#D58936'  },
  Low:    { bg: '#C8C97A15', color: '#C8C97A'  },
}

export default function DashboardPage() {
  const { projects, tasks, moodEntries, energyLevel, setEnergyLevel} = useStore()
  // const router = useRouter()
  const [todayMood, setTodayMood] = useState<any>(null)
  const [userName, setUserName]   = useState<string>('')

  // useEffect(() => { if (!userId) router.push('/auth') }, [userId, router])
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    setTodayMood(moodEntries.find(e => e.date === today) || null)
  }, [moodEntries])

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    supabase.auth.getUser().then(({ data: { user } }) => {
      const name = user?.user_metadata?.name || user?.email?.split('@')[0] || ''
      setUserName(name)
    })
  }, [])

  const tod        = getTimeOfDay()
  const activeProj = projects.filter(p => p.status === 'Active')
  const suggestions = recommendTasks(tasks, energyLevel, 5)
  const alerts     = detectAlerts(tasks, moodEntries, energyLevel)
  const todayTasks = tasks.filter(t =>
    !t.completed &&
    t.due_date &&
    new Date(t.due_date).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]
  )


  return (
    <div className="space-y-7 animate-fade-in">

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-3 mb-1">
            {GREET_ICON[tod]}
            <h1 className="font-display text-4xl font-semibold" style={{ color: '#F2F3AE' }}>
              Good {tod}{userName ? `, ${userName.split(' ')[0]}` : ''}
            </h1>
          </div>
          <p className="text-sm mt-1" style={{ color: '#8A8A45' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link href="/tasks" className="btn-primary flex-shrink-0">
          <Plus size={15} /> New Task
        </Link>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2.5">
          {alerts.map((alert, i) => (
            <div
              key={i}
              className="flex items-start gap-3 px-4 py-3.5 rounded-xl text-sm border animate-slide-up"
              style={{
                animationDelay: `${i * 0.06}s`,
                background:  alert.severity === 'critical' ? '#A4420015' : '#D5893612',
                borderColor: alert.severity === 'critical' ? '#A4420038' : '#D5893630',
                color:       alert.severity === 'critical' ? '#E8855A'   : '#D58936',
              }}
            >
              <AlertTriangle size={15} className="mt-0.5 flex-shrink-0 opacity-80" />
              <p className="flex-1 leading-relaxed">{alert.message}</p>
              {alert.type === 'reflect' && (
                <Link href="/reflections" className="text-xs underline underline-offset-2 flex-shrink-0 opacity-75 hover:opacity-100">
                  Reflect →
                </Link>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Energy + Mood */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Energy */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
              style={{ background: '#D5893622', border: '1px solid #D5893630' }}
            >
              ⚡
            </div>
            <span className="label">Energy level</span>
          </div>
          <div className="flex gap-2">
            {[1,2,3,4,5].map(n => (
              <button
                key={n}
                onClick={() => setEnergyLevel(n)}
                title={ENERGY_LABELS[n]}
                className="flex-1 h-11 rounded-xl transition-all duration-200 flex items-center justify-center"
                style={energyLevel === n ? {
                  background: 'linear-gradient(135deg, #A44200, #D58936)',
                  color: '#F2F3AE',
                  boxShadow: '0 0 14px #D5893640',
                } : {
                  background: '#451A1D',
                  color: '#8A8A45',
                  border: '1px solid #6B2420',
                }}
                onMouseEnter={e => { if (energyLevel !== n) (e.currentTarget as HTMLElement).style.borderColor = '#7D2D20' }}
                onMouseLeave={e => { if (energyLevel !== n) (e.currentTarget as HTMLElement).style.borderColor = '#6B2420' }}
              >
                {ENERGY_ICONS[n]}
              </button>
            ))}
          </div>
          <p className="text-xs mt-2.5 text-center" style={{ color: '#8A8A45' }}>
            {ENERGY_LABELS[energyLevel]} — Level {energyLevel}
          </p>
        </div>

        {/* Mood */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                style={{ background: '#A4420018', border: '1px solid #A4420028' }}
              >
                🌡
              </div>
              <span className="label">Today's mood</span>
            </div>
            <Link href="/tracker" className="section-link">Log it →</Link>
          </div>

          {todayMood ? (
            <div>
              <div className="flex items-end gap-2 mb-2">
                <span className="font-display text-5xl font-semibold text-gradient">
                  {todayMood.mood}
                </span>
                <span className="text-sm mb-1.5" style={{ color: '#8A8A45' }}>/5</span>
              </div>
              <div className="flex gap-4 text-xs" style={{ color: '#8A8A45' }}>
                <span>Focus <span className="font-semibold" style={{ color: '#C8C97A' }}>{todayMood.focus}/5</span></span>
                <span>Energy <span className="font-semibold" style={{ color: '#D58936' }}>{todayMood.energy}/5</span></span>
              </div>
              {todayMood.journal && (
                <p className="text-xs mt-2 line-clamp-1 italic" style={{ color: '#8A8A45' }}>
                  "{todayMood.journal}"
                </p>
              )}
            </div>
          ) : (
            <Link href="/tracker" className="flex items-center gap-2 text-sm group">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-dashed transition-colors"
                style={{ borderColor: '#7D2D20' }}
              >
                <Plus size={14} style={{ color: '#8A8A45' }} />
              </div>
              <span className="transition-colors" style={{ color: '#8A8A45' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#C8C97A')}
                onMouseLeave={e => (e.currentTarget.style.color = '#8A8A45')}
              >
                Log today's mood & focus
              </span>
            </Link>
          )}
        </div>

      </div>

      {/* Active Projects */}
      <section>
        <div className="section-header">
          <h2 className="section-title">Active Projects</h2>
          <Link href="/projects" className="section-link">View all →</Link>
        </div>
        {activeProj.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">◈</div>
            <p className="empty-state-text">No active projects yet.</p>
            <Link href="/projects" className="text-sm mt-2 block" style={{ color: '#D58936' }}>
              Create your first project →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeProj.slice(0, 4).map((project, i) => {
              const cs = CAT_STYLE[project.category] || CAT_STYLE.Personal
              return (
                <Link
                  key={project.id}
                  href="/projects"
                  className="card-hover group block"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0 pr-2">
                      <span
                        className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{ background: cs.bg, color: cs.color, border: `1px solid ${cs.color}25` }}
                      >
                        {project.category}
                      </span>
                      <h3 className="text-sm font-medium mt-1.5 leading-snug transition-colors" style={{ color: '#F2F3AE' }}>
                        {project.title}
                      </h3>
                    </div>
                    <span className="text-xs font-semibold flex-shrink-0 mt-0.5" style={{ color: '#8A8A45' }}>
                      {project.progress}%
                    </span>
                  </div>
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{ width: `${project.progress}%` }} />
                  </div>
                  {project.deadline && (
                    <p className="text-xs mt-2.5" style={{ color: '#8A8A45' }}>
                      Due {formatDate(project.deadline)}
                    </p>
                  )}
                </Link>
              )
            })}
          </div>
        )}
      </section>

      {/* Today's Focus */}
      <section>
        <div className="section-header">
          <h2 className="section-title">Today's focus</h2>
          <Link href="/tasks" className="section-link">All tasks →</Link>
        </div>
        <TaskList
          tasks={todayTasks.length > 0 ? todayTasks : suggestions.map(s => s.task)}
          showSuggested={todayTasks.length === 0}
          priorityStyle={PRIORITY_STYLE}
        />
      </section>

      {/* Recommended next */}
      {suggestions.length > 0 && todayTasks.length > 0 && (
        <section>
          <div className="section-header">
            <h2 className="section-title">Recommended next</h2>
          </div>
          <div className="space-y-2">
            {suggestions.slice(0, 3).map(({ task, reason }, i) => (
              <div
                key={task.id}
                className="card-hover flex items-start gap-3"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <DashCheckbox task={task} />
                <div className="flex-1 min-w-0 py-0.5">
                  <p className="text-sm leading-snug" style={{ color: task.completed ? '#8A8A45' : '#F2F3AE',
                    textDecoration: task.completed ? 'line-through' : 'none' }}>
                    {task.title}
                  </p>
                  <p className="text-xs mt-0.5 italic" style={{ color: '#8A8A45' }}>{reason}</p>
                </div>
                <PriorityBadge priority={task.priority} ps={PRIORITY_STYLE} />
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  )
}

function getTimeOfDay() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}

function TaskList({ tasks, showSuggested, priorityStyle }: {
  tasks: any[]; showSuggested?: boolean
  priorityStyle: Record<string, { bg: string; color: string }>
}) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🕯️</div>
        <p className="empty-state-text">No tasks due today — enjoy the flow.</p>
      </div>
    )
  }
  return (
    <div className="space-y-2">
      {showSuggested && (
        <p className="text-xs mb-2 italic" style={{ color: '#8A8A45' }}>
          Nothing due today — here's what matches your energy:
        </p>
      )}
      {tasks.slice(0, 5).map((task, i) => (
        <div key={task.id} className="card-hover flex items-start gap-3" style={{ animationDelay: `${i * 0.05}s` }}>
          <DashCheckbox task={task} />
          <div className="flex-1 min-w-0 py-0.5">
            <p className="text-sm leading-snug" style={{
              color: task.completed ? '#8A8A45' : '#F2F3AE',
              textDecoration: task.completed ? 'line-through' : 'none',
            }}>
              {task.title}
            </p>
            {task.due_date && <p className="text-xs mt-0.5" style={{ color: '#8A8A45' }}>{formatDate(task.due_date)}</p>}
          </div>
          <PriorityBadge priority={task.priority} ps={priorityStyle} />
        </div>
      ))}
    </div>
  )
}

function PriorityBadge({ priority, ps }: { priority: string; ps: Record<string, { bg: string; color: string }> }) {
  const s = ps[priority] || ps.Low
  return (
    <span
      className="flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full mt-0.5"
      style={{ color: s.color, background: s.bg, border: `1px solid ${s.color}28` }}
    >
      {priority}
    </span>
  )
}

function DashCheckbox({ task }: { task: any }) {
  const toggleTask = useStore(s => s.toggleTask)
  return (
    <button
      onClick={() => toggleTask(task.id)}
      className="w-5 h-5 rounded-md border flex-shrink-0 flex items-center justify-center transition-all duration-200 mt-0.5"
      style={task.completed ? {
        background: 'linear-gradient(135deg, #A44200, #D58936)',
        border: 'none',
        boxShadow: '0 0 8px #A4420048',
      } : {
        borderColor: '#7D2D20',
      }}
      onMouseEnter={e => { if (!task.completed) (e.currentTarget as HTMLElement).style.borderColor = '#A44200' }}
      onMouseLeave={e => { if (!task.completed) (e.currentTarget as HTMLElement).style.borderColor = '#7D2D20' }}
    >
      {task.completed && <span className="text-xs font-bold leading-none" style={{ color: '#F2F3AE' }}>✓</span>}
    </button>
  )
}