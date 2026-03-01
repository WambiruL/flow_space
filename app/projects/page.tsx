'use client'

import { useState } from 'react'
import { useStore } from '@/store'
import { cn, CATEGORY_COLORS, STATUS_COLORS, formatDate } from '@/lib/utils'
import { Plus, Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import type { Project, Category, ProjectStatus } from '@/types'

const CATEGORIES: Category[] = ['Creative', 'Career', 'Learning', 'Personal']
const STATUSES: ProjectStatus[] = ['Active', 'Paused', 'Completed']

const emptyForm = {
  title: '', description: '', category: 'Creative' as Category,
  deadline: '', status: 'Active' as ProjectStatus,
}

export default function ProjectsPage() {
  const { projects, addProject, updateProject, deleteProject, tasks } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [filter, setFilter] = useState<ProjectStatus | 'All'>('All')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = projects.filter(p => filter === 'All' || p.status === filter)

  const handleSubmit = () => {
    if (!form.title.trim()) return
    if (editingId) {
      updateProject(editingId, { ...form, deadline: form.deadline || null })
    } else {
      addProject({ ...form, deadline: form.deadline || null })
    }
    setForm(emptyForm)
    setShowForm(false)
    setEditingId(null)
  }

  const handleEdit = (project: Project) => {
    setForm({
      title: project.title,
      description: project.description,
      category: project.category,
      deadline: project.deadline || '',
      status: project.status,
    })
    setEditingId(project.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this project?')) deleteProject(id)
  }

  const getProjectTasks = (projectId: string) => tasks.filter(t => t.project_id === projectId)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">Projects</h1>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(emptyForm) }} className="btn-primary flex items-center gap-2">
          <Plus size={16} />New Project
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card border-accent-warm/30 animate-slide-up">
          <h3 className="text-text-primary font-medium mb-4">{editingId ? 'Edit Project' : 'New Project'}</h3>
          <div className="space-y-3">
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Project title" className="input" />
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Description (optional)" className="input resize-none h-20" />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label block mb-1">Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as Category }))} className="input">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="label block mb-1">Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as ProjectStatus }))} className="input">
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="label block mb-1">Deadline</label>
              <input type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} className="input" />
            </div>
            <div className="flex gap-2">
              <button onClick={handleSubmit} className="btn-primary">{editingId ? 'Save Changes' : 'Create Project'}</button>
              <button onClick={() => { setShowForm(false); setEditingId(null) }} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {(['All', ...STATUSES] as const).map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={cn('px-3 py-1.5 rounded-lg text-sm transition-colors',
              filter === s ? 'bg-accent-warm text-bg-primary' : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
            )}>
            {s}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      {filtered.length === 0 ? (
        <div className="card text-center py-12 text-text-muted">
          <p>No projects {filter !== 'All' ? `with status "${filter}"` : 'yet'}.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(project => {
            const ptasks = getProjectTasks(project.id)
            const isExpanded = expandedId === project.id
            return (
              <div key={project.id} className="card border-border-subtle hover:border-border-default transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={cn('badge', CATEGORY_COLORS[project.category])}>{project.category}</span>
                      <span className={cn('text-xs font-medium', STATUS_COLORS[project.status])}>{project.status}</span>
                    </div>
                    <h3 className="text-text-primary font-medium">{project.title}</h3>
                    {project.description && <p className="text-text-muted text-sm mt-0.5 line-clamp-2">{project.description}</p>}
                    
                    {/* Progress */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-text-muted mb-1">
                        <span>{ptasks.length} task{ptasks.length !== 1 ? 's' : ''}</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                        <div className="h-full bg-accent-warm rounded-full transition-all duration-500" style={{ width: `${project.progress}%` }} />
                      </div>
                    </div>

                    {project.deadline && (
                      <p className="text-text-muted text-xs mt-2">Deadline: {formatDate(project.deadline)}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => setExpandedId(isExpanded ? null : project.id)} className="btn-ghost">
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    <button onClick={() => handleEdit(project)} className="btn-ghost"><Edit2 size={14} /></button>
                    <button onClick={() => handleDelete(project.id)} className="btn-ghost text-red-400 hover:text-red-300"><Trash2 size={14} /></button>
                  </div>
                </div>

                {/* Expanded tasks */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-border-subtle">
                    <p className="label mb-2">Tasks</p>
                    {ptasks.length === 0 ? (
                      <p className="text-text-muted text-sm">No tasks linked. Add tasks from the Tasks page.</p>
                    ) : (
                      <div className="space-y-1.5">
                        {ptasks.map(task => (
                          <div key={task.id} className="flex items-center gap-2 text-sm">
                            <div className={cn('w-2 h-2 rounded-full flex-shrink-0', task.completed ? 'bg-status-active' : 'bg-border-strong')} />
                            <span className={cn(task.completed ? 'line-through text-text-muted' : 'text-text-secondary')}>{task.title}</span>
                            <span className="text-text-muted text-xs ml-auto">{task.priority}</span>
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
