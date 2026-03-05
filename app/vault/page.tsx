'use client'

import { useState, useMemo } from 'react'
import { useStore } from '@/store'
import { cn } from '@/lib/utils'
import { Plus, Search, Tag, X, ArrowRight, Trash2, Flame } from 'lucide-react'
import { format } from 'date-fns'

export default function VaultPage() {
  const { ideas, addIdea, updateIdea, deleteIdea, addTask, addProject } = useStore()

  const [content,      setContent]      = useState('')
  const [tagInput,     setTagInput]      = useState('')
  const [tags,         setTags]          = useState<string[]>([])
  const [search,       setSearch]        = useState('')
  const [filterTag,    setFilterTag]     = useState('')
  const [convertingId, setConvertingId] = useState<string | null>(null)

  const allTags = useMemo(() => {
    const t = new Set<string>()
    ideas.forEach(i => i.tags.forEach(tag => t.add(tag)))
    return Array.from(t)
  }, [ideas])

  const filtered = useMemo(() => ideas.filter(idea => {
    const ms = !search    || idea.content.toLowerCase().includes(search.toLowerCase()) ||
               idea.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    const mt = !filterTag || idea.tags.includes(filterTag)
    return ms && mt
  }), [ideas, search, filterTag])

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase()
    if (tag && !tags.includes(tag)) setTags(t => [...t, tag])
    setTagInput('')
  }

  const handleSubmit = () => {
    if (!content.trim()) return
    addIdea({ content: content.trim(), tags, converted_to: null, converted_id: null })
    setContent(''); setTags([])
  }

  const handleConvert = (ideaId: string, type: 'task' | 'project') => {
    const idea = ideas.find(i => i.id === ideaId)
    if (!idea) return
    if (type === 'task') {
      const task = addTask({ title: idea.content.slice(0, 80), project_id: null, priority: 'Medium', energy_cost: 3, due_date: null, completed: false })
      updateIdea(ideaId, { converted_to: 'task', converted_id: task.id })
    } else {
      const proj = addProject({ title: idea.content.slice(0, 60), description: idea.content, category: 'Creative', deadline: null, status: 'Active' })
      updateIdea(ideaId, { converted_to: 'project', converted_id: proj.id })
    }
    setConvertingId(null)
  }

  return (
    <div className="space-y-6 animate-fade-in">

      <div>
        <h1 className="font-display text-4xl font-semibold text-gradient">Brain Dump</h1>
        <p className="text-sm mt-1" style={{ color: '#8A8A45' }}>Capture everything without judgment. Process later.</p>
      </div>

      {/* Capture */}
      <div className="card-accent space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Flame size={14} style={{ color: '#D58936' }} />
          <span className="text-sm font-medium" style={{ color: '#C8C97A' }}>What's in your head right now?</span>
        </div>

        <textarea value={content} onChange={e => setContent(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit() }}
          placeholder="An idea, observation, question, fear, opportunity, fragment… anything at all."
          className="input resize-none h-28 leading-relaxed" autoFocus />

        <div className="flex flex-wrap items-center gap-1.5 min-h-[28px]">
          {tags.map(tag => (
            <span key={tag} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ background: '#D5893620', color: '#D58936', border: '1px solid #D5893630' }}>
              {tag}
              <button onClick={() => setTags(tags.filter(t => t !== tag))} className="opacity-60 hover:opacity-100"><X size={9} /></button>
            </span>
          ))}
          <div className="flex items-center gap-1">
            <input value={tagInput} onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => (e.key === 'Enter' || e.key === ',') && addTag()}
              placeholder={tags.length === 0 ? '+ add tags' : '+ more'}
              className="bg-transparent border-none outline-none text-xs w-20"
              style={{ color: '#C8C97A' }} />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs" style={{ color: '#8A8A45' }}>⌘↵ to capture</span>
          <button onClick={handleSubmit} disabled={!content.trim()} className="btn-primary">
            <Plus size={14} /> Capture idea
          </button>
        </div>
      </div>

      {/* Search + tag filters */}
      {ideas.length > 0 && (
        <div className="space-y-3">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8A8A45' }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search your vault…" className="input pl-9" />
          </div>
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 items-center">
              <Tag size={11} style={{ color: '#8A8A45' }} />
              {allTags.map(tag => (
                <button key={tag} onClick={() => setFilterTag(filterTag === tag ? '' : tag)}
                  className={cn('filter-pill', filterTag === tag && 'active')}>
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Ideas grid */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔥</div>
          <p className="empty-state-text">
            {search || filterTag ? 'No ideas match your search.' : 'Your vault is empty — dump something in!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((idea, i) => (
            <div key={idea.id} className="card flex flex-col gap-3"
              style={{ opacity: idea.converted_to ? 0.55 : 1, animationDelay: `${i * 0.04}s` }}>

              <p className="text-sm leading-relaxed flex-1" style={{ color: '#F2F3AE' }}>{idea.content}</p>

              <div className="flex items-center gap-2 flex-wrap">
                {idea.tags.map(tag => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: '#D5893614', color: '#D5893688', border: '1px solid #D5893822' }}>
                    {tag}
                  </span>
                ))}
                <span className="text-xs ml-auto flex-shrink-0" style={{ color: '#8A8A45' }}>
                  {format(new Date(idea.created_at), 'MMM d')}
                </span>
              </div>

              {idea.converted_to ? (
                <p className="text-xs flex items-center gap-1 font-medium" style={{ color: '#D58936' }}>
                  ✓ Converted to {idea.converted_to}
                </p>
              ) : (
                <div className="flex items-center gap-2 pt-2" style={{ borderTop: '1px solid #6B2420' }}>
                  {convertingId === idea.id ? (
                    <div className="flex gap-2 w-full">
                      <button onClick={() => handleConvert(idea.id, 'task')} className="btn-secondary flex-1 justify-center text-xs gap-1.5">
                        <ArrowRight size={11} /> As task
                      </button>
                      <button onClick={() => handleConvert(idea.id, 'project')} className="btn-secondary flex-1 justify-center text-xs gap-1.5">
                        <ArrowRight size={11} /> As project
                      </button>
                      <button onClick={() => setConvertingId(null)} className="btn-ghost"><X size={12} /></button>
                    </div>
                  ) : (
                    <>
                      <button onClick={() => setConvertingId(idea.id)}
                        className="text-xs flex items-center gap-1 transition-colors"
                        style={{ color: '#8A8A45' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#D58936')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#8A8A45')}>
                        <ArrowRight size={11} /> Convert to task / project
                      </button>
                      <button onClick={() => deleteIdea(idea.id)}
                        className="ml-auto transition-colors"
                        style={{ color: '#8A8A45' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#E8855A')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#8A8A45')}
                        aria-label="Delete idea">
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