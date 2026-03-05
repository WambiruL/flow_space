'use client'

import { useStore } from '@/store'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { recommendTasks, detectAlerts } from '@/lib/ai-engine'
import { cn, ENERGY_LABELS, formatDate } from '@/lib/utils'
import { Plus, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

const ENERGY_ICONS: Record<number, string> = { 1: '😴', 2: '😐', 3: '🙂', 4: '😄', 5: '🔥' }
const GREET_EMOJI: Record<string, string>  = { morning: '🌅', afternoon: '☀️', evening: '🕯️' }

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
  const { projects, tasks, moodEntries, energyLevel, setEnergyLevel, userId } = useStore()
  const router = useRouter()
  const [todayMood, setTodayMood] = useState<any>(null)

  useEffect(() => { if (!userId) router.push('/auth') }, [userId, router])
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    setTodayMood(moodEntries.find(e => e.date === today) || null)
  }, [moodEntries])

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
          <h1 className="font-display text-4xl font-semibold" style={{ color: '#F2F3AE' }}>
            {GREET_EMOJI[tod]} Good {tod}
          </h1>
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
                className="flex-1 h-11 rounded-xl text-base transition-all duration-200"
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