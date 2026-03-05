'use client'

import { useState, useMemo } from 'react'
import { useStore } from '@/store'
import { format, subDays, isAfter } from 'date-fns'
import { Brain, Plus, Search, ArrowLeft, Sparkles, ChevronRight, AlertCircle, Flame, Trash2 } from 'lucide-react'
import type { Reflection } from '@/types'

// ── Voice definitions ────────────────────────────────────────────────────────

const VOICES = [
  {
    key: 'ambition',
    label: 'Ambition',
    role: 'Drives you forward',
    color: '#D58936',
    dimColor: 'rgba(213,137,54,0.15)',
    border: 'rgba(213,137,54,0.30)',
    // SVG: flame / upward arrow
    icon: (active: boolean) => (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke={active ? '#D58936' : '#6B2420'} strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
  },
  {
    key: 'fear',
    label: 'Fear',
    role: 'Keeps you grounded',
    color: '#C9A8F5',
    dimColor: 'rgba(201,168,245,0.12)',
    border: 'rgba(201,168,245,0.28)',
    icon: (active: boolean) => (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke={active ? '#C9A8F5' : '#6B2420'} strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
  },
  {
    key: 'stoic',
    label: 'Stoic',
    role: 'Finds the facts',
    color: '#7EC8E3',
    dimColor: 'rgba(126,200,227,0.12)',
    border: 'rgba(126,200,227,0.28)',
    icon: (active: boolean) => (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke={active ? '#7EC8E3' : '#6B2420'} strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
  },
  {
    key: 'relationships',
    label: 'Relationships',
    role: 'Considers others',
    color: '#A8E6CF',
    dimColor: 'rgba(168,230,207,0.12)',
    border: 'rgba(168,230,207,0.28)',
    icon: (active: boolean) => (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke={active ? '#A8E6CF' : '#6B2420'} strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    key: 'creative',
    label: 'Creative Self',
    role: 'Opens new paths',
    color: '#E8855A',
    dimColor: 'rgba(232,133,90,0.12)',
    border: 'rgba(232,133,90,0.28)',
    icon: (active: boolean) => (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke={active ? '#E8855A' : '#6B2420'} strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
      </svg>
    ),
  },
] as const

type VoiceKey = typeof VOICES[number]['key']

// ── Context builder ─────────────────────────────────────────────────────────
// Builds a rich personal context string from the user's store data
// This is what makes the council feel genuinely personalised

function buildUserContext(store: {
  energyLevel: number
  moodEntries: any[]
  tasks: any[]
  projects: any[]
  ideas: any[]
  reflections: any[]
}): string {
  const { energyLevel, moodEntries, tasks, projects, ideas, reflections } = store

  const parts: string[] = []

  // Current energy
  const energyLabel = ['', 'Very Low', 'Low', 'Medium', 'Good', 'Peak'][energyLevel] || 'Medium'
  parts.push(`Current energy level: ${energyLabel} (${energyLevel}/5)`)

  // Recent mood entries (last 14 days)
  const recent = moodEntries
    .filter(e => isAfter(new Date(e.created_at), subDays(new Date(), 14)))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10)

  if (recent.length > 0) {
    const avgMood  = (recent.reduce((s, e) => s + e.mood,   0) / recent.length).toFixed(1)
    const avgEnergy= (recent.reduce((s, e) => s + e.energy, 0) / recent.length).toFixed(1)
    const avgFocus = (recent.reduce((s, e) => s + e.focus,  0) / recent.length).toFixed(1)
    parts.push(`Past 14-day averages — Mood: ${avgMood}/5, Energy: ${avgEnergy}/5, Focus: ${avgFocus}/5`)

    // Mood trend
    if (recent.length >= 3) {
      const firstHalf  = recent.slice(Math.floor(recent.length / 2))
      const secondHalf = recent.slice(0, Math.floor(recent.length / 2))
      const firstAvg   = firstHalf.reduce((s, e) => s + e.mood, 0) / firstHalf.length
      const secondAvg  = secondHalf.reduce((s, e) => s + e.mood, 0) / secondHalf.length
      const trend = secondAvg > firstAvg + 0.3 ? 'improving' : secondAvg < firstAvg - 0.3 ? 'declining' : 'stable'
      parts.push(`Mood trend over recent days: ${trend}`)
    }

    // Journal excerpts (last 3 that have content)
    const journals = recent.filter(e => e.journal?.trim()).slice(0, 3)
    if (journals.length > 0) {
      parts.push('Recent journal notes:')
      journals.forEach(e => {
        parts.push(`  - ${format(new Date(e.date), 'MMM d')}: "${e.journal.slice(0, 180)}${e.journal.length > 180 ? '…' : ''}"`)
      })
    }
  }

  // Active projects
  const activeProjects = projects.filter(p => p.status === 'Active')
  if (activeProjects.length > 0) {
    parts.push(`Active projects (${activeProjects.length}): ${activeProjects.map(p => `${p.title} (${p.progress}% done, ${p.category})`).join(', ')}`)
  }

  // Task patterns
  const allTasks = tasks
  const completedRecently = allTasks.filter(t =>
    t.completed && t.completed_at && isAfter(new Date(t.completed_at), subDays(new Date(), 7))
  )
  const overdue = allTasks.filter(t =>
    !t.completed && t.due_date && !isAfter(new Date(t.due_date), new Date())
  )
  const highEnergyTasks = allTasks.filter(t => !t.completed && t.energy_cost >= 4)

  if (completedRecently.length > 0)
    parts.push(`Tasks completed in last 7 days: ${completedRecently.length}`)
  if (overdue.length > 0)
    parts.push(`Overdue tasks: ${overdue.length} (${overdue.map(t => t.title).slice(0, 3).join(', ')}${overdue.length > 3 ? '…' : ''})`)
  if (highEnergyTasks.length > 0)
    parts.push(`High-energy tasks pending: ${highEnergyTasks.map(t => t.title).slice(0, 3).join(', ')}`)

  // Recent brain dumps (last 5)
  const recentIdeas = ideas
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)
  if (recentIdeas.length > 0) {
    parts.push('Recent brain dumps:')
    recentIdeas.forEach(i => {
      parts.push(`  - "${i.content.slice(0, 120)}${i.content.length > 120 ? '…' : ''}"`)
    })
  }

  // Past reflection themes
  if (reflections.length > 0) {
    parts.push(`Previous dilemmas explored (${reflections.length} total): ${reflections.slice(0, 3).map(r => `"${r.dilemma.slice(0, 60)}…"`).join(', ')}`)
  }

  return parts.join('\n')
}

// ── API call ──────────────────────────────────────────────────────────────────

async function callClaude(prompt: string): Promise<string> {
  const res = await fetch('api/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  if (!res.ok) throw new Error(`API error ${res.status}`)
  const data = await res.json()
  return data.content.map((b: any) => b.text || '').join('')
}

// ── Typing indicator ─────────────────────────────────────────────────────────

function TypingDots({ color }: { color: string }) {
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '4px 0' }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 5, height: 5, borderRadius: '50%',
          background: color,
          animation: `councilDot 1.3s ease-in-out ${i * 0.18}s infinite`,
        }} />
      ))}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ReflectionsPage() {
  const store = useStore()
  const { reflections, addReflection, deleteReflection, moodEntries, tasks, projects, ideas, energyLevel } = store

  const [mode, setMode]           = useState<'list' | 'new' | 'view'>('list')
  const [search, setSearch]       = useState('')
  const [dilemma, setDilemma]     = useState('')
  const [viewingId, setViewingId] = useState<string | null>(null)

  // Per-voice generation state
  const [responses, setResponses]   = useState<Partial<Record<VoiceKey, string>>>({})
  const [generating, setGenerating] = useState<Partial<Record<VoiceKey, boolean>>>({})
  const [errors, setErrors]         = useState<Partial<Record<VoiceKey, string>>>({})
  const [synthesis, setSynthesis]   = useState<string>('')
  const [synthLoading, setSynthLoading] = useState(false)
  const [sessionStarted, setSessionStarted] = useState(false)
  const [saving, setSaving]         = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Minimum check-ins for meaningful personalisation
  const MIN_CHECKINS   = 3
  const checkInCount   = moodEntries.length
  const hasEnoughData  = checkInCount >= MIN_CHECKINS

  const filtered = useMemo(() => {
    if (!search) return reflections
    const q = search.toLowerCase()
    return reflections.filter(r =>
      r.dilemma.toLowerCase().includes(q)
    )
  }, [reflections, search])

  const viewing = viewingId ? reflections.find(r => r.id === viewingId) : null

  // Build context once per session
  const userContext = useMemo(() => buildUserContext({
    energyLevel, moodEntries, tasks, projects, ideas, reflections,
  }), [energyLevel, moodEntries, tasks, projects, ideas, reflections])

  // Generate a single voice's perspective
  async function generateVoice(voiceKey: VoiceKey) {
    if (!dilemma.trim()) return
    const voice = VOICES.find(v => v.key === voiceKey)!

    setGenerating(g => ({ ...g, [voiceKey]: true }))
    setErrors(e => ({ ...e, [voiceKey]: undefined }))

    const voicePersona: Record<VoiceKey, string> = {
      ambition: `You are the user's inner Ambition voice. You are bold, optimistic, and always see the upside. You believe in the user's capacity to grow. You speak directly, personally, and with energy. Reference their actual data where relevant.`,
      fear: `You are the user's inner Fear voice. You are cautious, honest about risk, and care deeply about protecting the user from harm. You are not negative — you are wise. You speak gently but honestly. Reference their actual data where relevant.`,
      stoic: `You are the user's inner Stoic voice. You are calm, analytical, and focused on what is within the user's control. You cut through emotion to find clarity. Reference their actual data where relevant.`,
      relationships: `You are the user's inner Relationships voice. You consider how this decision affects the people around the user — family, colleagues, friends. You value connection and impact on others. Reference their actual data where relevant.`,
      creative: `You are the user's inner Creative Self. You see unexpected angles, reframe problems, and find the unconventional path. You ask "what if?" questions and challenge assumptions. Reference their actual data where relevant.`,
    }

    const prompt = `${voicePersona[voiceKey]}

Here is what you know about this person right now:
${userContext}

Their dilemma: "${dilemma}"

Respond as this inner voice in 3-5 sentences. Be specific to their actual data — don't give generic advice. Speak in first person as their inner voice (e.g. "I notice that..." or "What I see here is..."). Do not use bullet points. Be warm, direct, and personal.`

    try {
      const text = await callClaude(prompt)
      setResponses(r => ({ ...r, [voiceKey]: text.trim() }))
    } catch (err) {
      setErrors(e => ({ ...e, [voiceKey]: 'Could not reach the council. Check your connection.' }))
    } finally {
      setGenerating(g => ({ ...g, [voiceKey]: false }))
    }
  }

  // Generate synthesis after all voices have spoken
  async function generateSynthesis() {
    setSynthLoading(true)
    const voiceResponses = VOICES
      .filter(v => responses[v.key])
      .map(v => `${v.label}: ${responses[v.key]}`)
      .join('\n\n')

    const prompt = `You are synthesising five inner voices that have all weighed in on a personal dilemma.

The person's dilemma: "${dilemma}"

What each inner voice said:
${voiceResponses}

Write a synthesis of 3-4 sentences that holds the tension between all voices and offers one clear direction. Do not just summarise each voice — find the deeper truth they are collectively pointing toward. Be warm, honest, and specific. End with a single sentence that is the clearest possible recommendation.`

    try {
      const text = await callClaude(prompt)
      setSynthesis(text.trim())
    } catch {
      setSynthesis('Could not generate synthesis. Try again.')
    } finally {
      setSynthLoading(false)
    }
  }

  async function startSession() {
    if (!dilemma.trim()) return
    setSessionStarted(true)
    setResponses({})
    setSynthesis('')
    setErrors({})
    // Generate all 5 voices in parallel
    await Promise.all(VOICES.map(v => generateVoice(v.key as VoiceKey)))
  }

  const allVoicesDone = VOICES.every(v => responses[v.key as VoiceKey])
  const anyGenerating = VOICES.some(v => generating[v.key as VoiceKey])

  function handleSave() {
    if (!dilemma.trim()) return
    setSaving(true)
    addReflection({
      dilemma,
      ambition_prompt:       '',
      ambition_response:     responses.ambition     || '',
      fear_prompt:           '',
      fear_response:         responses.fear         || '',
      stoic_prompt:          '',
      stoic_response:        responses.stoic        || '',
      relationships_prompt:  '',
      relationships_response:responses.relationships || '',
      creative_prompt:       '',
      creative_response:     responses.creative     || '',
    })
    setSaving(false)
    resetNew()
    setMode('list')
  }

  function resetNew() {
    setDilemma('')
    setResponses({})
    setGenerating({})
    setErrors({})
    setSynthesis('')
    setSessionStarted(false)
  }

  // ── VIEW: past reflection ──────────────────────────────────────────────────
  if (mode === 'view' && viewing) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <style>{`
          @keyframes councilDot {
            0%, 60%, 100% { transform: translateY(0); opacity: 0.3; }
            30% { transform: translateY(-4px); opacity: 1; }
          }
          @keyframes voiceFadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        {/* Back row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => { setMode('list'); setViewingId(null) }}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#8A8A45', fontSize: 13,
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            <ArrowLeft size={14} /> Back
          </button>
          <span style={{ color: '#8A8A45', fontSize: 12, marginLeft: 'auto', fontFamily: "'Nunito', sans-serif" }}>
            {format(new Date(viewing.created_at), 'MMM d, yyyy')}
          </span>
        </div>

        {/* Dilemma */}
        <div style={{
          padding: '26px 28px', borderRadius: 18,
          background: 'rgba(52,16,18,0.60)',
          border: '1px solid rgba(107,36,32,0.40)',
        }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.10em', color: '#6B2420', fontFamily: "'Nunito', sans-serif", marginBottom: 12, textTransform: 'uppercase' }}>
            Dilemma
          </div>
          <p style={{ fontSize: 18, color: '#C8C97A', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', lineHeight: 1.7, maxWidth: '120ch' }}>
            "{viewing.dilemma}"
          </p>
        </div>

        {/* Voice responses */}
        {VOICES.map(v => {
          const response = viewing[`${v.key}_response` as keyof Reflection] as string
          if (!response) return null
          return (
            <div key={v.key} style={{
              padding: '28px 30px', borderRadius: 18,
              background: v.dimColor,
              border: `1px solid ${v.border}`,
              borderLeft: `3px solid ${v.color}88`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                {v.icon(true)}
                <span style={{ fontSize: 13, fontWeight: 700, color: v.color, fontFamily: "'Nunito', sans-serif", letterSpacing: '0.02em' }}>
                  {v.label}
                </span>
                <span style={{ fontSize: 12, color: '#A44200', fontFamily: "'Nunito', sans-serif", fontStyle: 'italic' }}>
                  — {v.role}
                </span>
              </div>
              <p style={{ fontSize: 14, color: '#C8C97A', fontFamily: "'Nunito', sans-serif", fontStyle: 'regular', lineHeight: 1.85, maxWidth: '120ch' }}>
                {response}
              </p>
            </div>
          )
        })}
      </div>
    )
  }

  // ── VIEW: new session ─────────────────────────────────────────────────────
  if (mode === 'new') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <style>{`
          @keyframes councilDot {
            0%, 60%, 100% { transform: translateY(0); opacity: 0.3; }
            30% { transform: translateY(-4px); opacity: 1; }
          }
          @keyframes voiceFadeIn {
            from { opacity: 0; transform: translateY(12px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes synthFadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => { setMode('list'); resetNew() }}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#8A8A45', fontSize: 13,
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            <ArrowLeft size={14} /> Back
          </button>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 22, fontWeight: 700, color: '#F2F3AE',
          }}>
            Inner Council
          </h1>
        </div>

        {/* Low data warning */}
        {!hasEnoughData && (
          <div style={{
            display: 'flex', gap: 12, alignItems: 'flex-start',
            padding: '14px 16px', borderRadius: 12,
            background: 'rgba(213,137,54,0.08)',
            border: '1px solid rgba(213,137,54,0.25)',
          }}>
            <AlertCircle size={15} style={{ color: '#D58936', flexShrink: 0, marginTop: 1 }} />
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#D58936', fontFamily: "'Nunito', sans-serif", marginBottom: 3 }}>
                The council is still learning you
              </p>
              <p style={{ fontSize: 12, color: '#8A8A45', fontFamily: "'Nunito', sans-serif", lineHeight: 1.6 }}>
                You have {checkInCount} of {MIN_CHECKINS} check-ins needed for personalised responses.
                The council will still speak, but will know you better with more data.
              </p>
            </div>
          </div>
        )}

        {/* Dilemma input */}
        <div style={{
          padding: '24px 26px', borderRadius: 18,
          background: 'rgba(52,16,18,0.70)',
          border: '1px solid rgba(107,36,32,0.45)',
        }}>
          <label style={{
            fontSize: 10, fontWeight: 800, letterSpacing: '0.10em',
            color: '#6B2420', fontFamily: "'Nunito', sans-serif",
            textTransform: 'uppercase', display: 'block', marginBottom: 12,
          }}>
            Your dilemma
          </label>
          <textarea
            value={dilemma}
            onChange={e => setDilemma(e.target.value)}
            disabled={sessionStarted}
            placeholder="What decision are you wrestling with? Speak freely..."
            rows={4}
            style={{
              width: '100%', background: 'transparent',
              border: 'none', outline: 'none', resize: 'none',
              fontSize: 17, color: '#C8C97A',
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: dilemma ? 'italic' : 'normal',
              lineHeight: 1.7,
              opacity: sessionStarted ? 0.7 : 1,
            }}
          />
          {!sessionStarted && (
            <button
              onClick={startSession}
              disabled={!dilemma.trim()}
              style={{
                marginTop: 16,
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '11px 22px', borderRadius: 12,
                background: dilemma.trim()
                  ? 'linear-gradient(135deg, #A44200, #D58936)'
                  : 'rgba(107,36,32,0.30)',
                border: 'none', cursor: dilemma.trim() ? 'pointer' : 'not-allowed',
                fontSize: 13, fontWeight: 700, color: '#F2F3AE',
                fontFamily: "'Nunito', sans-serif",
                letterSpacing: '0.02em',
                boxShadow: dilemma.trim() ? '0 0 22px #A4420040' : 'none',
                transition: 'all 0.25s ease',
              }}
            >
              <Sparkles size={14} />
              Summon the Council
            </button>
          )}
        </div>

        {/* Voice cards — appear one by one as they load */}
        {sessionStarted && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {VOICES.map((v, i) => {
              const response  = responses[v.key as VoiceKey]
              const isLoading = generating[v.key as VoiceKey]
              const error     = errors[v.key as VoiceKey]
              const hasContent = response || isLoading || error

              return (
                <div
                  key={v.key}
                  style={{
                    padding: '28px 30px', borderRadius: 18,
                    background: hasContent ? v.dimColor : 'rgba(42,12,14,0.40)',
                    border: `1px solid ${hasContent ? v.border : 'rgba(60,21,24,0.40)'}`,
                    borderLeft: hasContent ? `3px solid ${v.color}88` : '3px solid rgba(60,21,24,0.40)',
                    transition: 'all 0.4s ease',
                    animation: hasContent ? `voiceFadeIn 0.5s cubic-bezier(0.16,1,0.3,1) both` : 'none',
                  }}
                >
                  {/* Voice header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: hasContent ? 18 : 0 }}>
                    {v.icon(!!hasContent)}
                    <span style={{
                      fontSize: 13, fontWeight: 700,
                      color: hasContent ? v.color : '#4A1A1C',
                      fontFamily: "'Nunito', sans-serif",
                      transition: 'color 0.3s ease',
                      letterSpacing: '0.02em',
                    }}>
                      {v.label}
                    </span>
                    <span style={{
                      fontSize: 12, color: '#A44200',
                      fontFamily: "'Nunito', sans-serif",
                      fontStyle: 'italic',
                    }}>
                      — {v.role}
                    </span>
                    {isLoading && (
                      <div style={{ marginLeft: 'auto' }}>
                        <TypingDots color={v.color} />
                      </div>
                    )}
                    {error && (
                      <button
                        onClick={() => generateVoice(v.key as VoiceKey)}
                        style={{
                          marginLeft: 'auto', fontSize: 12, color: '#D58936',
                          background: 'none', border: 'none', cursor: 'pointer',
                          fontFamily: "'Nunito', sans-serif", textDecoration: 'underline',
                        }}
                      >
                        Retry
                      </button>
                    )}
                  </div>

                  {/* Response — larger, more readable */}
                  {response && (
                    <p style={{
                      fontSize: 14, color: '#C8C97A',
                      fontFamily: "'Nunito', sans-serif",
                      fontStyle: 'regular', lineHeight: 1.85, margin: 0,
                      maxWidth: '120ch',
                    }}>
                      {response}
                    </p>
                  )}

                  {error && (
                    <p style={{ fontSize: 13, color: '#E8855A', fontFamily: "'Nunito', sans-serif" }}>
                      {error}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Synthesis — appears after all voices done */}
        {allVoicesDone && !anyGenerating && (
          <div style={{
            padding: '30px 32px', borderRadius: 18,
            background: 'linear-gradient(145deg, rgba(164,66,0,0.12), rgba(82,26,16,0.20))',
            border: '1px solid rgba(164,66,0,0.35)',
            animation: 'synthFadeIn 0.6s cubic-bezier(0.16,1,0.3,1) both',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                background: 'linear-gradient(135deg, #A44200, #D58936)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 14px #A4420040',
              }}>
                <Flame size={15} color="#F2F3AE" strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#D58936', fontFamily: "'Nunito', sans-serif", letterSpacing: '0.02em' }}>
                Council Synthesis
              </span>
            </div>

            {!synthesis && !synthLoading && (
              <button
                onClick={generateSynthesis}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  padding: '11px 20px', borderRadius: 12,
                  background: 'rgba(164,66,0,0.18)',
                  border: '1px solid rgba(164,66,0,0.35)',
                  color: '#D58936', cursor: 'pointer',
                  fontSize: 14, fontWeight: 600,
                  fontFamily: "'Nunito', sans-serif",
                  transition: 'all 0.25s ease',
                }}
              >
                <Sparkles size={14} />
                Generate synthesis
              </button>
            )}

            {synthLoading && <TypingDots color="#D58936" />}

            {synthesis && (
              <p style={{
                fontSize: 16, color: '#F2F3AE',
                fontFamily: "'Nunito', sans-serif",
                fontStyle: 'regular', lineHeight: 1.85, margin: 0,
                maxWidth: '120ch',
              }}>
                {synthesis}
              </p>
            )}
          </div>
        )}

        {/* Save / Discard */}
        {allVoicesDone && !anyGenerating && (
          <div style={{ display: 'flex', gap: 10, animation: 'voiceFadeIn 0.4s ease both' }}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                padding: '11px 22px', borderRadius: 12,
                background: 'linear-gradient(135deg, #A44200, #D58936)',
                border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 700, color: '#F2F3AE',
                fontFamily: "'Nunito', sans-serif",
                boxShadow: '0 0 18px #A4420040',
                opacity: saving ? 0.6 : 1,
              }}
            >
              Save to council history
            </button>
            <button
              onClick={() => { setMode('list'); resetNew() }}
              style={{
                padding: '11px 18px', borderRadius: 12,
                background: 'transparent',
                border: '1px solid rgba(107,36,32,0.50)',
                color: '#8A8A45', cursor: 'pointer',
                fontSize: 13, fontFamily: "'Nunito', sans-serif",
              }}
            >
              Discard
            </button>
          </div>
        )}
      </div>
    )
  }

  // ── VIEW: list ────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <style>{`
        @keyframes councilDot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.3; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
        @keyframes listFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Brain size={20} style={{ color: '#D58936' }} />
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 24, fontWeight: 700, color: '#F2F3AE',
          }}>
            Inner Council
          </h1>
        </div>
        <button
          onClick={() => setMode('new')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '9px 18px', borderRadius: 12,
            background: 'linear-gradient(135deg, #A44200, #D58936)',
            border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 700, color: '#F2F3AE',
            fontFamily: "'Nunito', sans-serif",
            boxShadow: '0 0 16px #A4420035',
          }}
        >
          <Plus size={14} strokeWidth={2.5} />
          New session
        </button>
      </div>

      {/* Subtitle */}
      <p style={{
        fontSize: 14, color: '#A44200',
        fontFamily: "'Nunito', sans-serif",
        lineHeight: 1.65, marginTop: -10,
      }}>
        Five inner voices. One clearer path. The council draws from your energy, mood, and patterns
        to speak with genuine context about your life — not generic advice.
      </p>

      {/* Data readiness bar */}
      <div style={{
        padding: '14px 18px', borderRadius: 12,
        background: 'rgba(42,12,14,0.60)',
        border: '1px solid rgba(107,36,32,0.35)',
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        {/* Progress dots */}
        <div style={{ display: 'flex', gap: 5 }}>
          {Array.from({ length: Math.max(MIN_CHECKINS, checkInCount) > 10 ? 10 : Math.max(MIN_CHECKINS, 5) }).map((_, i) => (
            <div key={i} style={{
              width: 7, height: 7, borderRadius: '50%',
              background: i < checkInCount
                ? 'linear-gradient(135deg, #A44200, #D58936)'
                : 'rgba(107,36,32,0.35)',
              boxShadow: i < checkInCount ? '0 0 5px #A4420050' : 'none',
              transition: 'all 0.3s ease',
            }} />
          ))}
        </div>
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: checkInCount >= MIN_CHECKINS ? '#D58936' : '#8A8A45', fontFamily: "'Nunito', sans-serif" }}>
            {checkInCount >= MIN_CHECKINS
              ? `Council has ${checkInCount} check-ins to draw from`
              : `${checkInCount}/${MIN_CHECKINS} check-ins — council is still learning you`}
          </p>
          <p style={{ fontSize: 11, color: '#6B2420', fontFamily: "'Nunito', sans-serif", marginTop: 2 }}>
            {checkInCount >= MIN_CHECKINS
              ? 'Responses will reference your actual energy, mood, and patterns'
              : 'More check-ins = more personal, more accurate council responses'}
          </p>
        </div>
      </div>

      {/* Search */}
      {reflections.length > 0 && (
        <div style={{ position: 'relative' }}>
          <Search size={13} style={{
            position: 'absolute', left: 13,
            top: '50%', transform: 'translateY(-50%)',
            color: '#6B2420',
          }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search past sessions..."
            style={{
              width: '100%', paddingLeft: 36, paddingRight: 14,
              paddingTop: 11, paddingBottom: 11,
              borderRadius: 12, fontSize: 13,
              background: 'rgba(42,12,14,0.60)',
              border: '1px solid rgba(107,36,32,0.40)',
              color: '#C8C97A', outline: 'none',
              fontFamily: "'Nunito', sans-serif",
            }}
          />
        </div>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">◎</div>
          <p className="empty-state-text">
            {search
              ? 'No sessions match your search.'
              : 'No sessions yet. Bring your first dilemma to the council.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((r, i) => {
            const voicesAnswered = VOICES.filter(v => r[`${v.key}_response` as keyof Reflection])
            return (
              <button
                key={r.id}
                onClick={() => { setViewingId(r.id); setMode('view') }}
                style={{
                  display: 'flex', alignItems: 'center',
                  padding: '16px 18px', borderRadius: 14, width: '100%',
                  textAlign: 'left', cursor: 'pointer',
                  background: 'rgba(52,16,18,0.60)',
                  border: '1px solid rgba(107,36,32,0.35)',
                  gap: 14,
                  animation: `listFadeIn 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 0.04}s both`,
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = 'rgba(164,66,0,0.35)'
                  el.style.boxShadow = '0 0 16px rgba(164,66,0,0.06)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = 'rgba(107,36,32,0.35)'
                  el.style.boxShadow = 'none'
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: 14, fontWeight: 600, color: '#C8C97A',
                    fontFamily: "'Nunito', sans-serif",
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    marginBottom: 6,
                  }}>
                    {r.dilemma}
                  </p>
                  {/* Voice dots — which voices spoke */}
                  <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                    {VOICES.map(v => {
                      const spoke = !!(r[`${v.key}_response` as keyof Reflection] as string)
                      return (
                        <div key={v.key} style={{
                          width: 6, height: 6, borderRadius: '50%',
                          background: spoke ? v.color : 'rgba(107,36,32,0.30)',
                          opacity: spoke ? 1 : 0.3,
                        }} />
                      )
                    })}
                    <span style={{ fontSize: 11, color: '#6B2420', fontFamily: "'Nunito', sans-serif", marginLeft: 4 }}>
                      {voicesAnswered.length}/{VOICES.length} voices
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <span style={{ fontSize: 11, color: '#6B2420', fontFamily: "'Nunito', sans-serif" }}>
                    {format(new Date(r.created_at), 'MMM d')}
                  </span>

                  {/* Delete button */}
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      setDeletingId(r.id)
                    }}
                    title="Delete session"
                    style={{
                      width: 28, height: 28,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      borderRadius: 8, border: '1px solid transparent',
                      background: 'transparent', cursor: 'pointer',
                      color: '#6B2420',
                      transition: 'all 0.2s ease',
                      flexShrink: 0,
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.background = 'rgba(164,66,0,0.12)'
                      el.style.borderColor = 'rgba(164,66,0,0.30)'
                      el.style.color = '#E8855A'
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.background = 'transparent'
                      el.style.borderColor = 'transparent'
                      el.style.color = '#6B2420'
                    }}
                  >
                    <Trash2 size={13} strokeWidth={1.8} />
                  </button>

                  <ChevronRight size={14} style={{ color: '#6B2420' }} />
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* ── Delete confirmation modal ── */}
      {deletingId && (
        <div
          onClick={() => setDeletingId(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 50,
            background: 'rgba(20,6,8,0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24,
            animation: 'listFadeIn 0.2s ease both',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 380,
              borderRadius: 20,
              background: 'linear-gradient(160deg, rgba(58,16,18,0.98), rgba(36,10,12,0.99))',
              border: '1px solid rgba(164,66,0,0.30)',
              boxShadow: '0 0 60px rgba(0,0,0,0.6), 0 0 30px rgba(164,66,0,0.08)',
              padding: '28px 28px 24px',
              animation: 'listFadeIn 0.25s cubic-bezier(0.16,1,0.3,1) both',
            }}
          >
            {/* Icon */}
            <div style={{
              width: 44, height: 44, borderRadius: 14, marginBottom: 18,
              background: 'rgba(164,66,0,0.12)',
              border: '1px solid rgba(164,66,0,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Trash2 size={18} color="#E8855A" strokeWidth={1.8} />
            </div>

            <h3 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 20, fontWeight: 700, color: '#F2F3AE',
              marginBottom: 10, letterSpacing: '-0.01em',
            }}>
              Delete this session?
            </h3>
            <p style={{
              fontSize: 13, color: '#A44200', lineHeight: 1.65,
              fontFamily: "'Nunito', sans-serif", marginBottom: 24,
            }}>
              This council session will be permanently removed. The voices that spoke cannot be recovered.
            </p>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => {
                  deleteReflection(deletingId)
                  setDeletingId(null)
                }}
                style={{
                  flex: 1, padding: '11px 0', borderRadius: 12,
                  background: 'rgba(164,66,0,0.18)',
                  border: '1px solid rgba(164,66,0,0.35)',
                  color: '#E8855A', cursor: 'pointer',
                  fontSize: 13, fontWeight: 700,
                  fontFamily: "'Nunito', sans-serif",
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'rgba(164,66,0,0.28)'
                  el.style.borderColor = 'rgba(232,133,90,0.50)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'rgba(164,66,0,0.18)'
                  el.style.borderColor = 'rgba(164,66,0,0.35)'
                }}
              >
                Delete
              </button>
              <button
                onClick={() => setDeletingId(null)}
                style={{
                  flex: 1, padding: '11px 0', borderRadius: 12,
                  background: 'transparent',
                  border: '1px solid rgba(107,36,32,0.45)',
                  color: '#8A8A45', cursor: 'pointer',
                  fontSize: 13, fontWeight: 600,
                  fontFamily: "'Nunito', sans-serif",
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = 'rgba(107,36,32,0.70)'
                  el.style.color = '#C8C97A'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = 'rgba(107,36,32,0.45)'
                  el.style.color = '#8A8A45'
                }}
              >
                Keep it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
