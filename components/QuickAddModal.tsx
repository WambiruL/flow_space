'use client'

import { useState } from 'react'
import { useStore } from '@/store'
import { cn } from '@/lib/utils'
import { X, Plus } from 'lucide-react'
import type { Priority } from '@/types'

interface QuickAddModalProps {
  open: boolean
  onClose: () => void
}

type Mode = 'task' | 'project' | 'idea'

export default function QuickAddModal({ open, onClose }: QuickAddModalProps) {
  const { addTask, addProject, addIdea, projects } = useStore()
  const [mode, setMode] = useState<Mode>('task')
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('Medium')
  const [projectId, setProjectId] = useState('')
  const [dueDate, setDueDate] = useState('')

  if (!open) return null

  const handleSubmit = () => {
    if (!title.trim()) return
    if (mode === 'task') {
      addTask({
        title: title.trim(),
        project_id: projectId || null,
        priority,
        energy_cost: 3,
        due_date: dueDate || null,
        completed: false,
      })
    } else if (mode === 'project') {
      addProject({
        title: title.trim(),
        description: '',
        category: 'Creative',
        deadline: dueDate || null,
        status: 'Active',
      })
    } else {
      addIdea({
        content: title.trim(),
        tags: [],
        converted_to: null,
        converted_id: null,
      })
    }
    setTitle('')
    setPriority('Medium')
    setProjectId('')
    setDueDate('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative bg-bg-card border border-border-default rounded-2xl w-full max-w-md p-5 animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg text-text-primary">Quick Add</h2>
          <button onClick={onClose} className="btn-ghost p-1"><X size={16} /></button>
        </div>

        {/* Mode selector */}
        <div className="flex gap-1.5 mb-4 bg-bg-tertiary p-1 rounded-lg">
          {(['task', 'project', 'idea'] as Mode[]).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={cn('flex-1 py-1.5 rounded-md text-sm capitalize transition-colors',
                mode === m ? 'bg-accent-warm text-bg-primary font-medium' : 'text-text-secondary hover:text-text-primary'
              )}>
              {m}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <input
            autoFocus
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder={mode === 'task' ? 'Task title...' : mode === 'project' ? 'Project name...' : 'Capture your idea...'}
            className="input"
          />

          {mode === 'task' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label block mb-1">Priority</label>
                  <select value={priority} onChange={e => setPriority(e.target.value as Priority)} className="input">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
                <div>
                  <label className="label block mb-1">Due Date</label>
                  <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="input" />
                </div>
              </div>
              <div>
                <label className="label block mb-1">Project</label>
                <select value={projectId} onChange={e => setProjectId(e.target.value)} className="input">
                  <option value="">No project</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
              </div>
            </>
          )}

          {mode === 'project' && (
            <div>
              <label className="label block mb-1">Deadline</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="input" />
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button onClick={handleSubmit} disabled={!title.trim()} className="btn-primary flex-1 disabled:opacity-50">
              <Plus size={14} className="inline mr-1" />Add {mode}
            </button>
            <button onClick={onClose} className="btn-secondary">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}
