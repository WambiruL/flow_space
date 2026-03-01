'use client'

import { useStore } from '@/store'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { recommendTasks, detectAlerts } from '@/lib/ai-engine'
import { cn, ENERGY_LABELS, formatDate, CATEGORY_COLORS, PRIORITY_COLORS } from '@/lib/utils'
import { Plus, Zap, TrendingUp, AlertTriangle, Brain, ChevronRight } from 'lucide-react'
import QuickAddModal from '@/components/QuickAddModal'
import Link from 'next/link'

export default function DashboardPage() {
  const { projects, tasks, moodEntries, energyLevel, setEnergyLevel, userId } = useStore()
  const router = useRouter()
  const [quickAddOpen, setQuickAddOpen] = useState(false)
  const [todayMood, setTodayMood] = useState<any>(null)

  useEffect(() => {
    if (!userId) router.push('/auth')
  }, [userId, router])

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    const entry = moodEntries.find(e => e.date === today)
    setTodayMood(entry)
  }, [moodEntries])

  const activeProjects = projects.filter(p => p.status === 'Active')
  const suggestions = recommendTasks(tasks, energyLevel, 5)
  const alerts = detectAlerts(tasks, moodEntries, energyLevel)

  const incompleteTasks = tasks.filter(t => !t.completed)
  const todayTasks = incompleteTasks.filter(t => {
    if (!t.due_date) return false
    return new Date(t.due_date).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]
  })

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl text-text-primary">Good {getTimeOfDay()}</h1>
          <p className="text-text-secondary text-sm mt-0.5">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <button onClick={() => setQuickAddOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          Quick Add
        </button>
      </div>

      {/* Alerts */}
      {alerts.map((alert, i) => (
        <div key={i} className={cn(
          'flex items-start gap-3 px-4 py-3 rounded-xl border text-sm animate-slide-up',
          alert.severity === 'critical' ? 'bg-red-500/10 border-red-500/30 text-red-300' :
          alert.severity === 'warning' ? 'bg-accent-warm/10 border-accent-warm/30 text-accent-warm' :
          'bg-blue-500/10 border-blue-500/30 text-blue-300'
        )}>
          <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
          <p>{alert.message}</p>
          {alert.type === 'reflect' && (
            <Link href="/reflections" className="ml-auto text-xs underline flex-shrink-0">Reflect now</Link>
          )}
        </div>
      ))}

      {/* Energy + Mood row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Energy Input */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={16} className="text-accent-warm" />
            <span className="label">Current Energy</span>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(level => (
              <button
                key={level}
                onClick={() => setEnergyLevel(level)}
                className={cn(
                  'flex-1 h-10 rounded-lg text-sm font-medium transition-all duration-150',
                  energyLevel === level
                    ? 'bg-accent-warm text-bg-primary shadow-lg shadow-accent-warm/20'
                    : 'bg-bg-tertiary text-text-muted hover:text-text-primary hover:bg-bg-hover'
                )}
              >
                {level}
              </button>
            ))}
          </div>
          <p className="text-text-muted text-xs mt-2 text-center">{ENERGY_LABELS[energyLevel]}</p>
        </div>

        {/* Quick Mood */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Brain size={16} className="text-purple-400" />
              <span className="label">Today's Mood</span>
            </div>
            <Link href="/tracker" className="text-xs text-text-muted hover:text-accent-warm transition-colors">Log it →</Link>
          </div>
          {todayMood ? (
            <div className="flex items-center gap-3">
              <div className="text-3xl font-display text-text-primary">{todayMood.mood}/5</div>
              <div>
                <div className="text-text-secondary text-sm">Focus: {todayMood.focus}/5</div>
                {todayMood.journal && <p className="text-text-muted text-xs mt-0.5 line-clamp-1">{todayMood.journal}</p>}
              </div>
            </div>
          ) : (
            <Link href="/tracker" className="flex items-center gap-2 text-text-muted text-sm hover:text-accent-warm transition-colors">
              <Plus size={14} />
              Log today's mood & focus
            </Link>
          )}
        </div>
      </div>

      {/* Active Projects */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title flex items-center gap-2">
            <TrendingUp size={18} className="text-accent-warm" />
            Active Projects
          </h2>
          <Link href="/projects" className="text-xs text-text-muted hover:text-accent-warm transition-colors">View all →</Link>
        </div>
        {activeProjects.length === 0 ? (
          <div className="card text-center py-8 text-text-muted">
            <p className="text-sm">No active projects yet.</p>
            <Link href="/projects" className="text-accent-warm text-sm hover:underline mt-1 block">Create your first project</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeProjects.slice(0, 4).map(project => (
              <Link key={project.id} href="/projects" className="card-hover group">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className={cn('badge text-xs mb-1', CATEGORY_COLORS[project.category])}>{project.category}</span>
                    <h3 className="text-text-primary text-sm font-medium group-hover:text-accent-warm transition-colors">{project.title}</h3>
                  </div>
                  <span className="text-text-muted text-xs">{project.progress}%</span>
                </div>
                {/* Progress bar */}
                <div className="h-1 bg-bg-tertiary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent-warm rounded-full transition-all duration-500"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                {project.deadline && (
                  <p className="text-text-muted text-xs mt-2">Due {formatDate(project.deadline)}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Today's Focus Tasks */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title">Today's Focus</h2>
          <Link href="/tasks" className="text-xs text-text-muted hover:text-accent-warm transition-colors">All tasks →</Link>
        </div>
        <TaskList tasks={todayTasks.length > 0 ? todayTasks : suggestions.map(s => s.task)} showSuggested={todayTasks.length === 0} />
      </div>

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <div>
          <h2 className="section-title mb-3">Recommended Next</h2>
          <div className="space-y-2">
            {suggestions.slice(0, 3).map(({ task, reason }) => (
              <div key={task.id} className="card-hover flex items-center gap-3">
                <TaskCheckbox task={task} />
                <div className="flex-1 min-w-0">
                  <p className={cn('text-sm', task.completed ? 'line-through text-text-muted' : 'text-text-primary')}>{task.title}</p>
                  <p className="text-xs text-text-muted mt-0.5">{reason}</p>
                </div>
                <span className={cn('badge text-xs flex-shrink-0', PRIORITY_COLORS[task.priority])}>{task.priority}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <QuickAddModal open={quickAddOpen} onClose={() => setQuickAddOpen(false)} />
    </div>
  )
}

function getTimeOfDay() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}

function TaskList({ tasks, showSuggested }: { tasks: any[]; showSuggested?: boolean }) {
  if (tasks.length === 0) {
    return (
      <div className="card text-center py-8 text-text-muted">
        <p className="text-sm">No tasks due today. Enjoy the flow.</p>
      </div>
    )
  }
  return (
    <div className="space-y-2">
      {showSuggested && (
        <p className="text-xs text-text-muted mb-1">No tasks due today — here's what we suggest based on your energy:</p>
      )}
      {tasks.slice(0, 5).map(task => (
        <div key={task.id} className="card-hover flex items-center gap-3">
          <TaskCheckbox task={task} />
          <div className="flex-1 min-w-0">
            <p className={cn('text-sm', task.completed ? 'line-through text-text-muted' : 'text-text-primary')}>{task.title}</p>
            {task.due_date && <p className="text-xs text-text-muted">{formatDate(task.due_date)}</p>}
          </div>
          <span className={cn('badge text-xs flex-shrink-0', PRIORITY_COLORS[task.priority])}>{task.priority}</span>
        </div>
      ))}
    </div>
  )
}

function TaskCheckbox({ task }: { task: any }) {
  const toggleTask = useStore(s => s.toggleTask)
  return (
    <button
      onClick={() => toggleTask(task.id)}
      className={cn(
        'w-5 h-5 rounded-md border flex-shrink-0 flex items-center justify-center transition-all',
        task.completed
          ? 'bg-accent-warm border-accent-warm text-bg-primary'
          : 'border-border-strong hover:border-accent-warm'
      )}
    >
      {task.completed && <span className="text-xs">✓</span>}
    </button>
  )
}
