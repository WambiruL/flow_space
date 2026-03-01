'use client'

import { useState, useMemo } from 'react'
import { useStore } from '@/store'
import { cn, PRIORITY_COLORS, formatDate, isOverdue, ENERGY_LABELS } from '@/lib/utils'
import { Plus, Trash2, Filter, Zap } from 'lucide-react'
import type { Task, Priority } from '@/types'
import { recommendTasks } from '@/lib/ai-engine'

const PRIORITIES: Priority[] = ['Low', 'Medium', 'High']

const emptyForm = {
  title: '', project_id: '', priority: 'Medium' as Priority,
  energy_cost: 3, due_date: '', completed: false,
}

export default function TasksPage() {
  const { tasks, projects, addTask, updateTask, deleteTask, toggleTask, energyLevel } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [filter, setFilter] = useState<'all' | 'today' | 'overdue' | 'completed'>('all')
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'All'>('All')
  const [showSuggested, setShowSuggested] = useState(false)

  const today = new Date().toISOString().split('T')[0]
  const suggestions = useMemo(() => recommendTasks(tasks, energyLevel, 5), [tasks, energyLevel])

  const filtered = useMemo(() => {
    let result = tasks
    if (filter === 'today') result = result.filter(t => t.due_date?.split('T')[0] === today && !t.completed)
    else if (filter === 'overdue') result = result.filter(t => t.due_date && isOverdue(t.due_date) && !t.completed)
    else if (filter === 'completed') result = result.filter(t => t.completed)
    else result = result.filter(t => !t.completed)
    if (priorityFilter !== 'All') result = result.filter(t => t.priority === priorityFilter)
    return result.sort((a, b) => {
      const pOrder = { High: 0, Medium: 1, Low: 2 }
      return pOrder[a.priority] - pOrder[b.priority]
    })
  }, [tasks, filter, priorityFilter, today])

  const handleSubmit = () => {
    if (!form.title.trim()) return
    addTask({ ...form, project_id: form.project_id || null, due_date: form.due_date || null })
    setForm(emptyForm)
    setShowForm(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this task?')) deleteTask(id)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">Tasks</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowSuggested(!showSuggested)}
            className={cn('btn-secondary flex items-center gap-1.5', showSuggested && 'border-accent-warm/50 text-accent-warm')}>
            <Zap size={14} />Smart
          </button>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
            <Plus size={16} />New Task
          </button>
        </div>
      </div>

      {/* Smart Suggestions Panel */}
      {showSuggested && (
        <div className="card border-accent-warm/20 animate-slide-up">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={14} className="text-accent-warm" />
            <span className="text-sm text-accent-warm font-medium">Energy-matched suggestions (Level {energyLevel} — {ENERGY_LABELS[energyLevel]})</span>
          </div>
          <div className="space-y-2">
            {suggestions.map(({ task, reason }) => (
              <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg bg-bg-tertiary">
                <TaskCheckbox taskId={task.id} completed={task.completed} />
                <div className="flex-1">
                  <p className="text-sm text-text-primary">{task.title}</p>
                  <p className="text-xs text-text-muted">{reason}</p>
                </div>
                <EnergyDots cost={task.energy_cost} />
              </div>
            ))}
            {suggestions.length === 0 && <p className="text-text-muted text-sm">No tasks to suggest. All done? 🎉</p>}
          </div>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="card border-accent-warm/30 animate-slide-up">
          <h3 className="font-medium text-text-primary mb-4">New Task</h3>
          <div className="space-y-3">
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Task title" className="input" onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label block mb-1">Project</label>
                <select value={form.project_id} onChange={e => setForm(f => ({ ...f, project_id: e.target.value }))} className="input">
                  <option value="">No project</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
              </div>
              <div>
                <label className="label block mb-1">Priority</label>
                <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as Priority }))} className="input">
                  {PRIORITIES.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label block mb-1">Energy Cost (1-5)</label>
                <div className="flex gap-1.5">
                  {[1,2,3,4,5].map(n => (
                    <button key={n} onClick={() => setForm(f => ({ ...f, energy_cost: n }))}
                      className={cn('w-8 h-8 rounded-md text-sm transition-colors',
                        form.energy_cost === n ? 'bg-accent-warm text-bg-primary' : 'bg-bg-tertiary text-text-muted hover:text-text-primary'
                      )}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label block mb-1">Due Date</label>
                <input type="date" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} className="input" />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleSubmit} className="btn-primary">Create Task</button>
              <button onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex gap-1.5">
          {(['all', 'today', 'overdue', 'completed'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={cn('px-3 py-1.5 rounded-lg text-sm capitalize transition-colors',
                filter === f ? 'bg-accent-warm text-bg-primary' : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
              )}>
              {f}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5 ml-2">
          {(['All', ...PRIORITIES] as const).map(p => (
            <button key={p} onClick={() => setPriorityFilter(p)}
              className={cn('px-2.5 py-1 rounded-md text-xs transition-colors',
                priorityFilter === p ? 'bg-bg-hover border border-border-strong text-text-primary' : 'text-text-muted hover:text-text-secondary'
              )}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="card text-center py-10 text-text-muted">
            <p className="text-sm">{filter === 'completed' ? 'No completed tasks yet.' : 'No tasks here. Create one!'}</p>
          </div>
        ) : (
          filtered.map(task => {
            const project = projects.find(p => p.id === task.project_id)
            const overdue = !task.completed && isOverdue(task.due_date)
            return (
              <div key={task.id} className={cn('card-hover flex items-start gap-3', overdue && 'border-red-500/20')}>
                <TaskCheckbox taskId={task.id} completed={task.completed} />
                <div className="flex-1 min-w-0">
                  <p className={cn('text-sm', task.completed ? 'line-through text-text-muted' : 'text-text-primary')}>{task.title}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {project && <span className="text-xs text-text-muted">{project.title}</span>}
                    {task.due_date && (
                      <span className={cn('text-xs', overdue ? 'text-red-400' : 'text-text-muted')}>
                        {overdue ? 'Overdue · ' : ''}{formatDate(task.due_date)}
                      </span>
                    )}
                    <EnergyDots cost={task.energy_cost} />
                  </div>
                </div>
                <span className={cn('badge text-xs flex-shrink-0 mt-0.5', PRIORITY_COLORS[task.priority])}>{task.priority}</span>
                <button onClick={() => handleDelete(task.id)} className="btn-ghost text-text-muted hover:text-red-400 mt-0.5">
                  <Trash2 size={12} />
                </button>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

function TaskCheckbox({ taskId, completed }: { taskId: string; completed: boolean }) {
  const toggleTask = useStore(s => s.toggleTask)
  return (
    <button onClick={() => toggleTask(taskId)}
      className={cn('w-5 h-5 rounded-md border flex-shrink-0 flex items-center justify-center transition-all mt-0.5',
        completed ? 'bg-accent-warm border-accent-warm text-bg-primary' : 'border-border-strong hover:border-accent-warm'
      )}>
      {completed && <span className="text-xs">✓</span>}
    </button>
  )
}

function EnergyDots({ cost }: { cost: number }) {
  return (
    <span className="flex gap-0.5">
      {[1,2,3,4,5].map(n => (
        <span key={n} className={cn('w-1.5 h-1.5 rounded-full', n <= cost ? 'bg-accent-warm' : 'bg-bg-tertiary')} />
      ))}
    </span>
  )
}
