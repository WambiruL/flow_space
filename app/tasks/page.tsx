'use client'

import { useState, useMemo } from 'react'
import { useStore } from '@/store'
import { cn, formatDate, isOverdue, ENERGY_LABELS } from '@/lib/utils'
import { Plus, Trash2, Zap, Sparkles } from 'lucide-react'
import type { Task, Priority } from '@/types'
import { recommendTasks } from '@/lib/ai-engine'
import { useToast, TASK_TOASTS, ToastProvider } from '@/components/toast'

const PRIORITIES: Priority[] = ['Low', 'Medium', 'High']

const EMPTY_FORM = {
  title: '', project_id: '', priority: 'Medium' as Priority, energy_cost: 3, due_date: '',
}

const P_STYLE: Record<Priority, { color: string; bg: string }> = {
  High:   { color: '#E8855A', bg: '#A4420020' },
  Medium: { color: '#D58936', bg: '#D5893618' },
  Low:    { color: '#C8C97A', bg: '#C8C97A15' },
}

export default function TasksPage() {

  return (
    <ToastProvider>
      <TasksContent />
    </ToastProvider>
  )
}  


function TasksContent(){
  const { tasks, projects, addTask, deleteTask, toggleTask, energyLevel } = useStore()
  const { toast } = useToast()

  const [showForm,   setShowForm]   = useState(false)
  const [form,       setForm]       = useState(EMPTY_FORM)
  const [filter,     setFilter]     = useState<'all' | 'today' | 'overdue' | 'completed'>('all')
  const [pFilter,    setPFilter]    = useState<Priority | 'All'>('All')
  const [showSmart,  setShowSmart]  = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const today       = new Date().toISOString().split('T')[0]
  const suggestions = useMemo(() => recommendTasks(tasks, energyLevel, 5), [tasks, energyLevel])

  const filtered = useMemo(() => {
    let r = [...tasks]
    if      (filter === 'today')     r = r.filter(t =>  t.due_date?.split('T')[0] === today && !t.completed)
    else if (filter === 'overdue')   r = r.filter(t =>  t.due_date && isOverdue(t.due_date) && !t.completed)
    else if (filter === 'completed') r = r.filter(t =>  t.completed)
    else                             r = r.filter(t => !t.completed)
    if (pFilter !== 'All')           r = r.filter(t =>  t.priority === pFilter)
    return r.sort((a, b) => ({ High: 0, Medium: 1, Low: 2 }[a.priority] - { High: 0, Medium: 1, Low: 2 }[b.priority]))
  }, [tasks, filter, pFilter, today])

  const handleSubmit = () => {
    const title = form.title.trim()
    if (!title || submitting) return
    setSubmitting(true)
    addTask({ title, project_id: form.project_id || null, priority: form.priority, energy_cost: form.energy_cost, due_date: form.due_date || null, completed: false })
    toast(TASK_TOASTS.created(title))
    setForm(EMPTY_FORM); setShowForm(false); setSubmitting(false)
  }

  const handleToggle = (task: Task) => {
    toggleTask(task.id)
    if (!task.completed) toast(TASK_TOASTS.completed(task.title))
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this task?')) { deleteTask(id); toast(TASK_TOASTS.deleted()) }
  }

  const activeCt    = tasks.filter(t => !t.completed).length
  const completedCt = tasks.filter(t =>  t.completed).length

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl font-semibold" style={{ color: '#F2F3AE' }}>Tasks</h1>
          <p className="text-sm mt-1" style={{ color: '#8A8A45' }}>{activeCt} active · {completedCt} done</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => setShowSmart(s => !s)}
            className="btn-secondary flex items-center gap-1.5"
            style={showSmart ? { borderColor: '#D58936', color: '#D58936' } : {}}
          >
            <Zap size={14} style={showSmart ? { color: '#D58936' } : {}} /> Smart
          </button>
          <button onClick={() => { setShowForm(s => !s); setForm(EMPTY_FORM) }} className="btn-primary">
            <Plus size={16} /> New Task
          </button>
        </div>
      </div>

      {/* Smart suggestions */}
      {showSmart && (
        <div className="card-accent space-y-3 animate-slide-up">
          <div className="flex items-center gap-2">
            <Sparkles size={14} style={{ color: '#D58936' }} />
            <span className="text-sm font-medium" style={{ color: '#C8C97A' }}>
              Energy-matched — Level {energyLevel}: {ENERGY_LABELS[energyLevel]}
            </span>
          </div>
          {suggestions.length === 0 ? (
            <p className="text-sm" style={{ color: '#8A8A45' }}>Nothing to suggest — the board is clear 🕯️</p>
          ) : (
            <div className="space-y-2">
              {suggestions.map(({ task, reason }) => (
                <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: '#451A1D', border: '1px solid #6B2420' }}>
                  <Checkbox task={task} onToggle={handleToggle} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm" style={{ color: task.completed ? '#8A8A45' : '#F2F3AE',
                      textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#8A8A45' }}>{reason}</p>
                  </div>
                  <EnergyDots cost={task.energy_cost} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* New task form */}
      {showForm && (
        <div className="card-accent space-y-4 animate-slide-up">
          <div className="flex items-center gap-2.5">
            <span className="relative flex-shrink-0">
              <span className="w-2.5 h-2.5 rounded-full block animate-pulse-glow"
                style={{ background: '#A44200', boxShadow: '0 0 8px #A4420048' }} />
              <span className="absolute inset-0 w-2.5 h-2.5 rounded-full animate-ping opacity-40"
                style={{ background: '#A44200' }} />
            </span>
            <h3 className="font-display font-semibold text-lg" style={{ color: '#F2F3AE' }}>New Task</h3>
          </div>

          <input autoFocus value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="What needs doing?" className="input" />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label block mb-1.5">Project</label>
              <select value={form.project_id} onChange={e => setForm(f => ({ ...f, project_id: e.target.value }))} className="input">
                <option value="">No project</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>
            <div>
              <label className="label block mb-1.5">Priority</label>
              <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as Priority }))} className="input">
                {PRIORITIES.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label block mb-1.5">Energy cost</label>
              <div className="flex gap-1.5">
                {[1,2,3,4,5].map(n => (
                  <button key={n} type="button"
                    onClick={() => setForm(f => ({ ...f, energy_cost: n }))}
                    className="flex-1 h-9 rounded-xl text-sm font-semibold transition-all duration-200"
                    style={form.energy_cost === n ? {
                      background: 'linear-gradient(135deg, #A44200, #D58936)',
                      color: '#F2F3AE',
                      boxShadow: '0 0 10px #D5893630',
                    } : {
                      background: '#451A1D',
                      color: '#8A8A45',
                      border: '1px solid #6B2420',
                    }}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label block mb-1.5">Due date</label>
              <input type="date" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} className="input" />
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button onClick={handleSubmit} disabled={!form.title.trim() || submitting} className="btn-primary">
              <Plus size={15} />{submitting ? 'Saving…' : 'Create task'}
            </button>
            <button onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-1.5">
          {(['all','today','overdue','completed'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={cn('filter-pill capitalize', filter === f && 'active')}>
              {f === 'all' ? 'Active' : f}
            </button>
          ))}
        </div>
        <span className="w-1 h-1 rounded-full hidden sm:block" style={{ background: '#6B2420' }} />
        <div className="flex gap-1.5">
          {(['All', ...PRIORITIES] as const).map(p => (
            <button key={p} onClick={() => setPFilter(p)} className={cn('filter-pill', pFilter === p && 'active')}>{p}</button>
          ))}
        </div>
      </div>

      {/* Task list */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">{filter === 'completed' ? '✓' : '◌'}</div>
            <p className="empty-state-text">
              {filter === 'completed' ? 'No completed tasks yet.' : 'Nothing here. The space is clear.'}
            </p>
          </div>
        ) : (
          filtered.map(task => {
            const proj = projects.find(p => p.id === task.project_id)
            const over = !task.completed && isOverdue(task.due_date)
            return (
              <div key={task.id}
                className="card-hover flex items-start gap-3 group"
                style={over ? { borderColor: '#A4420040' } : {}}>
                <Checkbox task={task} onToggle={handleToggle} />
                <div className="flex-1 min-w-0 py-0.5">
                  <p className="text-sm leading-snug" style={{
                    color: task.completed ? '#8A8A45' : '#F2F3AE',
                    textDecoration: task.completed ? 'line-through' : 'none',
                  }}>
                    {task.title}
                  </p>
                  <div className="flex items-center flex-wrap gap-2 mt-1.5">
                    {proj && (
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ color: '#8A8A45', background: '#451A1D', border: '1px solid #6B2420' }}>
                        {proj.title}
                      </span>
                    )}
                    {task.due_date && (
                      <span className="text-xs" style={{ color: over ? '#E8855A' : '#8A8A45', fontWeight: over ? 600 : 400 }}>
                        {over ? '⚠ Overdue · ' : ''}{formatDate(task.due_date)}
                      </span>
                    )}
                    <EnergyDots cost={task.energy_cost} />
                  </div>
                </div>
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5"
                  style={{ color: P_STYLE[task.priority].color, background: P_STYLE[task.priority].bg,
                           border: `1px solid ${P_STYLE[task.priority].color}28` }}>
                  {task.priority}
                </span>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="btn-ghost mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: '#8A8A45' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#E8855A')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#8A8A45')}
                  aria-label="Delete">
                  <Trash2 size={13} />
                </button>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

function Checkbox({ task, onToggle }: { task: Task; onToggle: (t: Task) => void }) {
  return (
    <button
      onClick={() => onToggle(task)}
      className="w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center transition-all duration-200 mt-0.5"
      style={task.completed ? {
        background: 'linear-gradient(135deg, #A44200, #D58936)',
        boxShadow: '0 0 8px #A4420048',
        border: 'none',
      } : {
        border: '1px solid #7D2D20',
      }}
      onMouseEnter={e => { if (!task.completed) (e.currentTarget as HTMLElement).style.borderColor = '#A44200' }}
      onMouseLeave={e => { if (!task.completed) (e.currentTarget as HTMLElement).style.borderColor = '#7D2D20' }}
    >
      {task.completed && <span className="text-xs font-bold leading-none" style={{ color: '#F2F3AE' }}>✓</span>}
    </button>
  )
}

function EnergyDots({ cost }: { cost: number }) {
  return (
    <span className="flex gap-0.5 items-center" title={`Energy cost: ${cost}/5`}>
      {[1,2,3,4,5].map(n => <span key={n} className={n <= cost ? 'e-dot-on' : 'e-dot-off'} />)}
    </span>
  )
}