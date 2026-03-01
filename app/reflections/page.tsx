'use client'

import { useState, useMemo } from 'react'
import { useStore } from '@/store'
import { generateCouncilPrompts } from '@/lib/ai-engine'
import { cn } from '@/lib/utils'
import { Brain, Plus, Search, ChevronDown, ChevronUp, Sparkles } from 'lucide-react'
import { format } from 'date-fns'
import type { Reflection } from '@/types'

const PERSPECTIVES = [
  { key: 'ambition', label: 'Ambition', color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20', icon: '🔥' },
  { key: 'fear', label: 'Fear', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20', icon: '🌊' },
  { key: 'stoic', label: 'Stoic', color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20', icon: '⚖️' },
  { key: 'relationships', label: 'Relationships', color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/20', icon: '🤝' },
  { key: 'creative', label: 'Creative Self', color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/20', icon: '✨' },
] as const

export default function ReflectionsPage() {
  const { reflections, addReflection, updateReflection } = useStore()
  const [mode, setMode] = useState<'list' | 'new' | 'view'>('list')
  const [search, setSearch] = useState('')
  const [dilemma, setDilemma] = useState('')
  const [prompts, setPrompts] = useState<Record<string, string>>({})
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [viewingId, setViewingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const filtered = useMemo(() => {
    if (!search) return reflections
    const q = search.toLowerCase()
    return reflections.filter(r =>
      r.dilemma.toLowerCase().includes(q) ||
      Object.values(r).some(v => typeof v === 'string' && v.toLowerCase().includes(q))
    )
  }, [reflections, search])

  const handleGeneratePrompts = () => {
    if (!dilemma.trim()) return
    setPrompts(generateCouncilPrompts(dilemma))
    setResponses({})
  }

  const handleSave = () => {
    if (!dilemma.trim()) return
    setSaving(true)
    addReflection({
      dilemma,
      ambition_prompt: prompts.ambition || '',
      ambition_response: responses.ambition || '',
      fear_prompt: prompts.fear || '',
      fear_response: responses.fear || '',
      stoic_prompt: prompts.stoic || '',
      stoic_response: responses.stoic || '',
      relationships_prompt: prompts.relationships || '',
      relationships_response: responses.relationships || '',
      creative_prompt: prompts.creative || '',
      creative_response: responses.creative || '',
    })
    setSaving(false)
    setMode('list')
    setDilemma('')
    setPrompts({})
    setResponses({})
  }

  const viewing = viewingId ? reflections.find(r => r.id === viewingId) : null

  if (mode === 'new') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <button onClick={() => setMode('list')} className="btn-ghost">← Back</button>
          <h1 className="font-display text-2xl">Inner Council</h1>
        </div>

        {/* Dilemma Input */}
        <div className="card border-purple-400/20">
          <label className="label block mb-2">What's your dilemma or decision?</label>
          <textarea
            value={dilemma}
            onChange={e => setDilemma(e.target.value)}
            placeholder="e.g. Should I leave my job to freelance full-time? Should I move cities? How do I handle this conflict with..."
            className="input resize-none h-24"
          />
          <button
            onClick={handleGeneratePrompts}
            disabled={!dilemma.trim()}
            className="btn-primary mt-3 flex items-center gap-2 disabled:opacity-50"
          >
            <Sparkles size={14} />
            Summon the Council
          </button>
        </div>

        {/* Council Perspectives */}
        {Object.keys(prompts).length > 0 && (
          <div className="space-y-4 animate-slide-up">
            {PERSPECTIVES.map(({ key, label, color, bg, icon }) => (
              <div key={key} className={cn('card border', bg)}>
                <div className="flex items-center gap-2 mb-2">
                  <span>{icon}</span>
                  <span className={cn('font-medium text-sm', color)}>{label}</span>
                </div>
                <p className="text-text-secondary text-sm mb-3 leading-relaxed">{prompts[key as keyof typeof prompts]}</p>
                <textarea
                  value={responses[key] || ''}
                  onChange={e => setResponses(r => ({ ...r, [key]: e.target.value }))}
                  placeholder={`Your ${label.toLowerCase()} perspective...`}
                  className="input resize-none h-24"
                />
              </div>
            ))}

            <div className="flex gap-2">
              <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
                Save Reflection
              </button>
              <button onClick={() => setMode('list')} className="btn-secondary">Discard</button>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (mode === 'view' && viewing) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <button onClick={() => { setMode('list'); setViewingId(null) }} className="btn-ghost">← Back</button>
          <h1 className="font-display text-2xl">Reflection</h1>
          <span className="text-text-muted text-sm ml-auto">{format(new Date(viewing.created_at), 'MMM d, yyyy')}</span>
        </div>
        <div className="card">
          <p className="label mb-1">Dilemma</p>
          <p className="text-text-primary">{viewing.dilemma}</p>
        </div>
        {PERSPECTIVES.map(({ key, label, color, bg, icon }) => {
          const prompt = viewing[`${key}_prompt` as keyof Reflection] as string
          const response = viewing[`${key}_response` as keyof Reflection] as string
          if (!prompt && !response) return null
          return (
            <div key={key} className={cn('card border', bg)}>
              <div className="flex items-center gap-2 mb-2">
                <span>{icon}</span>
                <span className={cn('font-medium text-sm', color)}>{label}</span>
              </div>
              {prompt && <p className="text-text-secondary text-sm mb-2 italic">{prompt}</p>}
              {response ? (
                <p className="text-text-primary text-sm leading-relaxed">{response}</p>
              ) : (
                <p className="text-text-muted text-sm italic">No response recorded.</p>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain size={22} className="text-purple-400" />
          <h1 className="font-display text-2xl">Inner Council</h1>
        </div>
        <button onClick={() => setMode('new')} className="btn-primary flex items-center gap-2">
          <Plus size={16} />New Reflection
        </button>
      </div>

      <p className="text-text-secondary text-sm">
        Bring your hardest decisions and dilemmas to the council. Five inner voices. One clearer path.
      </p>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search reflections..." className="input pl-8" />
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="card text-center py-12 text-text-muted">
          <Brain size={32} className="mx-auto mb-3 opacity-30" />
          <p>{search ? 'No reflections found.' : 'No reflections yet. Bring your first dilemma to the council.'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(reflection => (
            <button
              key={reflection.id}
              onClick={() => { setViewingId(reflection.id); setMode('view') }}
              className="card-hover w-full text-left"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-text-primary font-medium line-clamp-2">{reflection.dilemma}</p>
                  <div className="flex gap-1 mt-2">
                    {PERSPECTIVES.map(({ key, icon }) => {
                      const hasResponse = !!(reflection[`${key}_response` as keyof Reflection] as string)
                      return (
                        <span key={key} className={cn('text-sm', hasResponse ? 'opacity-100' : 'opacity-20')}>{icon}</span>
                      )
                    })}
                  </div>
                </div>
                <span className="text-text-muted text-xs flex-shrink-0">{format(new Date(reflection.created_at), 'MMM d')}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
