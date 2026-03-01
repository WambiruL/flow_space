'use client'

import { useState, useMemo } from 'react'
import { useStore } from '@/store'
import { cn } from '@/lib/utils'
import { Zap, Plus, Search, Tag, X, ArrowRight, Trash2 } from 'lucide-react'
import { format } from 'date-fns'

export default function VaultPage() {
  const { ideas, addIdea, updateIdea, deleteIdea, addTask, addProject, projects } = useStore()
  const [content, setContent] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [filterTag, setFilterTag] = useState('')
  const [convertingId, setConvertingId] = useState<string | null>(null)
  const [convertType, setConvertType] = useState<'task' | 'project' | null>(null)

  const allTags = useMemo(() => {
    const t = new Set<string>()
    ideas.forEach(i => i.tags.forEach(tag => t.add(tag)))
    return Array.from(t)
  }, [ideas])

  const filtered = useMemo(() => {
    return ideas.filter(idea => {
      const matchSearch = !search || idea.content.toLowerCase().includes(search.toLowerCase()) ||
        idea.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
      const matchTag = !filterTag || idea.tags.includes(filterTag)
      return matchSearch && matchTag
    })
  }, [ideas, search, filterTag])

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase()
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag])
    }
    setTagInput('')
  }

  const handleSubmit = () => {
    if (!content.trim()) return
    addIdea({ content: content.trim(), tags, converted_to: null, converted_id: null })
    setContent('')
    setTags([])
  }

  const handleConvert = (ideaId: string, type: 'task' | 'project') => {
    const idea = ideas.find(i => i.id === ideaId)
    if (!idea) return

    if (type === 'task') {
      const task = addTask({
        title: idea.content.slice(0, 80),
        project_id: null,
        priority: 'Medium',
        energy_cost: 3,
        due_date: null,
        completed: false,
      })
      updateIdea(ideaId, { converted_to: 'task', converted_id: task.id })
    } else {
      const project = addProject({
        title: idea.content.slice(0, 60),
        description: idea.content,
        category: 'Creative',
        deadline: null,
        status: 'Active',
      })
      updateIdea(ideaId, { converted_to: 'project', converted_id: project.id })
    }
    setConvertingId(null)
    setConvertType(null)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2">
        <Zap size={22} className="text-accent-warm" />
        <h1 className="font-display text-2xl">Brain Dump</h1>
      </div>
      <p className="text-text-secondary text-sm">Capture everything without judgment. Process later.</p>

      {/* Quick Capture */}
      <div className="card border-accent-warm/20">
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="What's in your head? An idea, observation, question, fear, opportunity..."
          className="input resize-none h-24 mb-3"
          onKeyDown={e => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit()
          }}
        />
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.map(tag => (
            <span key={tag} className="badge bg-accent-warm/10 text-accent-warm border border-accent-warm/20 flex items-center gap-1">
              {tag}
              <button onClick={() => setTags(tags.filter(t => t !== tag))}><X size={10} /></button>
            </span>
          ))}
          <div className="flex items-center gap-1">
            <input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => (e.key === 'Enter' || e.key === ',') && handleAddTag()}
              placeholder="Add tag..."
              className="bg-transparent border-none outline-none text-xs text-text-muted placeholder:text-text-muted w-20"
            />
            {tagInput && <button onClick={handleAddTag} className="text-accent-warm text-xs">+ Add</button>}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-text-muted text-xs">⌘+Enter to save</span>
          <button onClick={handleSubmit} disabled={!content.trim()} className="btn-primary disabled:opacity-50">
            Capture Idea
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search ideas..." className="input pl-8" />
        </div>
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 items-center">
            <Tag size={12} className="text-text-muted" />
            {allTags.map(tag => (
              <button key={tag} onClick={() => setFilterTag(filterTag === tag ? '' : tag)}
                className={cn('badge transition-colors',
                  filterTag === tag ? 'bg-accent-warm/20 text-accent-warm border border-accent-warm/30' : 'bg-bg-tertiary text-text-muted hover:text-text-primary'
                )}>
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Ideas Grid */}
      {filtered.length === 0 ? (
        <div className="card text-center py-12 text-text-muted">
          <Zap size={32} className="mx-auto mb-3 opacity-20" />
          <p className="text-sm">{search || filterTag ? 'No ideas match your search.' : 'Your vault is empty. Dump something in!'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map(idea => (
            <div key={idea.id} className={cn('card-hover flex flex-col gap-3', idea.converted_to && 'opacity-60')}>
              <p className="text-text-primary text-sm leading-relaxed flex-1">{idea.content}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {idea.tags.map(tag => (
                    <span key={tag} className="badge bg-bg-tertiary text-text-muted text-xs">{tag}</span>
                  ))}
                </div>
                <span className="text-text-muted text-xs flex-shrink-0">{format(new Date(idea.created_at), 'MMM d')}</span>
              </div>

              {idea.converted_to ? (
                <div className="flex items-center gap-1 text-xs text-status-active">
                  <span>✓ Converted to {idea.converted_to}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 pt-1 border-t border-border-subtle">
                  {convertingId === idea.id ? (
                    <div className="flex gap-2 w-full">
                      <button onClick={() => handleConvert(idea.id, 'task')} className="btn-secondary flex-1 flex items-center justify-center gap-1 text-xs">
                        <ArrowRight size={12} /> As Task
                      </button>
                      <button onClick={() => handleConvert(idea.id, 'project')} className="btn-secondary flex-1 flex items-center justify-center gap-1 text-xs">
                        <ArrowRight size={12} /> As Project
                      </button>
                      <button onClick={() => setConvertingId(null)} className="btn-ghost text-xs"><X size={12} /></button>
                    </div>
                  ) : (
                    <>
                      <button onClick={() => setConvertingId(idea.id)}
                        className="text-xs text-text-muted hover:text-accent-warm transition-colors flex items-center gap-1">
                        <ArrowRight size={12} /> Convert
                      </button>
                      <button onClick={() => deleteIdea(idea.id)}
                        className="text-xs text-text-muted hover:text-red-400 transition-colors ml-auto">
                        <Trash2 size={12} />
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
