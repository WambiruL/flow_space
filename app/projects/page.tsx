'use client'

import { useState } from 'react'
import { useStore } from '@/store'
import { cn, formatDate } from '@/lib/utils'
import { Plus, Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import type { Project, Category, ProjectStatus } from '@/types'
import { PROJECT_TOASTS, ToastProvider, useToast } from '@/components/toast'

const CATEGORIES: Category[] = ['Creative', 'Career', 'Learning', 'Personal']
const STATUSES: ProjectStatus[] = ['Active', 'Paused', 'Completed']

const CAT: Record<Category, { bg: string; color: string }> = {
  Creative: { bg: '#F2F3AE15', color: '#F2F3AE' },
  Career:   { bg: '#D5893618', color: '#D58936'  },
  Learning: { bg: '#E8855A18', color: '#E8855A'  },
  Personal: { bg: '#C8C97A18', color: '#C8C97A'  },
}

const STAT: Record<ProjectStatus, { color: string; dot: string; glow: boolean }> = {
  Active:    { color: '#D58936', dot: '#D58936', glow: true  },
  Paused:    { color: '#C8C97A', dot: '#C8C97A', glow: false },
  Completed: { color: '#8A8A45', dot: '#8A8A45', glow: false },
}

const emptyForm = {
  title: '', description: '', category: 'Creative' as Category,
  deadline: '', status: 'Active' as ProjectStatus,
}

export default function ProjectsPage() {
  return (
      <ToastProvider>
        <ProjectsContent />
      </ToastProvider>
  )
}
function ProjectsContent(){
  const { projects, addProject, updateProject, deleteProject, tasks } = useStore()
  const { toast } = useToast()

  const [showForm,   setShowForm]   = useState(false)
  const [editingId,  setEditingId]  = useState<string | null>(null)
  const [form,       setForm]       = useState(emptyForm)
  const [filter,     setFilter]     = useState<ProjectStatus | 'All'>('All')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = projects.filter(p => filter === 'All' || p.status === filter)

  const handleSubmit = () => {
    const title = form.title
    if (!form.title.trim()) return
    if (editingId) updateProject(editingId, { ...form, deadline: form.deadline || null })
    else  addProject({ ...form, deadline: form.deadline || null })
    toast(PROJECT_TOASTS.created(title))
    setForm(emptyForm); setShowForm(false); setEditingId(null)
  }

  const handleEdit = (p: Project) => {
    setForm({ title: p.title, description: p.description, category: p.category, deadline: p.deadline || '', status: p.status })
    setEditingId(p.id); setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this project?')) deleteProject(id)
  }

  const ptasks = (id: string) => tasks.filter(t => t.project_id === id)

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl font-semibold" style={{ color: '#F2F3AE' }}>Projects</h1>
          <p className="text-sm mt-1" style={{ color: '#8A8A45' }}>
            {projects.length} project{projects.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <button onClick={() => { setShowForm(s => !s); setEditingId(null); setForm(emptyForm) }} className="btn-primary flex-shrink-0">
          <Plus size={15} /> New Project
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card-accent space-y-4 animate-slide-up">
          <div className="flex items-center gap-2.5">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0 animate-pulse-glow"
              style={{ background: '#A44200', boxShadow: '0 0 8px #A4420048' }}
            />
            <h3 className="font-display font-semibold text-lg" style={{ color: '#F2F3AE' }}>
              {editingId ? 'Edit project' : 'New project'}
            </h3>
          </div>

          <input autoFocus value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="Project title" className="input" />

          <textarea value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Description — what's this project about? (optional)"
            className="input resize-none h-20" />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label block mb-1.5">Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as Category }))} className="input">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label block mb-1.5">Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as ProjectStatus }))} className="input">
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="label block mb-1.5">Deadline <span className="normal-case font-normal" style={{ color: '#8A8A45' }}>(optional)</span></label>
            <input type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} className="input" />
          </div>

          <div className="flex gap-2 pt-1">
            <button onClick={handleSubmit} disabled={!form.title.trim()} className="btn-primary">
              <Plus size={14} />{editingId ? 'Save changes' : 'Create project'}
            </button>
            <button onClick={() => { setShowForm(false); setEditingId(null) }} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {(['All', ...STATUSES] as const).map(s => (
          <button key={s} onClick={() => setFilter(s)} className={cn('filter-pill', filter === s && 'active')}>{s}</button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">◈</div>
          <p className="empty-state-text">{filter !== 'All' ? `No ${filter.toLowerCase()} projects.` : 'No projects yet.'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((project, i) => {
            const ct = CAT[project.category]
            const st = STAT[project.status]
            const pt = ptasks(project.id)
            const isExp = expandedId === project.id
            return (
              <div key={project.id} className="card" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="flex items-start gap-3">
                  {/* Colour bar */}
                  <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ background: ct.color, opacity: 0.5 }} />

                  <div className="flex-1 min-w-0">
                    {/* Chips */}
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{ background: ct.bg, color: ct.color, border: `1px solid ${ct.color}25` }}
                      >
                        {project.category}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: st.dot, boxShadow: st.glow ? `0 0 6px ${st.dot}80` : 'none' }} />
                        <span className="text-xs font-medium" style={{ color: st.color }}>{project.status}</span>
                      </div>
                    </div>

                    <h3 className="font-semibold leading-snug" style={{ color: '#F2F3AE' }}>{project.title}</h3>

                    {project.description && (
                      <p className="text-sm mt-1 leading-relaxed line-clamp-2" style={{ color: '#8A8A45' }}>{project.description}</p>
                    )}

                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs" style={{ color: '#8A8A45' }}>
                          {pt.filter(t => t.completed).length}/{pt.length} tasks
                        </span>
                        <span className="text-xs font-semibold" style={{ color: '#8A8A45' }}>{project.progress}%</span>
                      </div>
                      <div className="progress-bar-track">
                        <div className="progress-bar-fill" style={{ width: `${project.progress}%` }} />
                      </div>
                    </div>

                    {project.deadline && (
                      <p className="text-xs mt-2.5" style={{ color: '#8A8A45' }}>📅 {formatDate(project.deadline)}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    <button onClick={() => setExpandedId(isExp ? null : project.id)} className="btn-ghost" aria-label="Toggle">
                      {isExp ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    <button onClick={() => handleEdit(project)} className="btn-ghost" aria-label="Edit"><Edit2 size={13} /></button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="btn-ghost"
                      style={{ color: '#8A8A45' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#E8855A')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#8A8A45')}
                      aria-label="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Expanded tasks */}
                {isExp && (
                  <div className="mt-4 pt-4 animate-slide-up" style={{ borderTop: '1px solid #6B2420' }}>
                    <p className="label mb-3">Linked tasks</p>
                    {pt.length === 0 ? (
                      <p className="text-sm" style={{ color: '#8A8A45' }}>No tasks linked. Add tasks from the Tasks page.</p>
                    ) : (
                      <div className="space-y-2">
                        {pt.map(task => (
                          <div key={task.id} className="flex items-center gap-2.5 text-sm py-0.5">
                            <div className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ background: task.completed ? '#D58936' : '#6B2420',
                                       boxShadow: task.completed ? '0 0 5px #D5893668' : 'none' }} />
                            <span className="flex-1" style={{
                              color: task.completed ? '#8A8A45' : '#C8C97A',
                              textDecoration: task.completed ? 'line-through' : 'none',
                            }}>
                              {task.title}
                            </span>
                            <span className="text-xs" style={{ color: '#8A8A45' }}>{task.priority}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}