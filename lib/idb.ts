
import type { Project, Task, Reflection, MoodEntry, BrainDumpIdea } from '@/types'

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
// ── Projects ──────────────────────────────────────────────────────────────────

export async function fetchProjects(userId: string): Promise<Project[]> {
  const { data } = await sb.from('projects').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  return (data as Project[]) || []
}

export async function upsertProject(project: Project): Promise<void> {
  await sb.from('projects').upsert(project)
}

export async function removeProject(id: string): Promise<void> {

  await sb.from('projects').delete().eq('id', id)
}

// ── Tasks ─────────────────────────────────────────────────────────────────────

export async function fetchTasks(userId: string): Promise<Task[]> {

  const { data } = await sb.from('tasks').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  return (data as Task[]) || []
}

export async function upsertTask(task: Task): Promise<void> {

  await sb.from('tasks').upsert(task)
}

export async function removeTask(id: string): Promise<void> {

  await sb.from('tasks').delete().eq('id', id)
}

// ── Reflections ───────────────────────────────────────────────────────────────

export async function fetchReflections(userId: string): Promise<Reflection[]> {

  const { data } = await sb.from('reflections').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  return (data as Reflection[]) || []
}

export async function upsertReflection(reflection: Reflection): Promise<void> {

  await sb.from('reflections').upsert(reflection)
}

export async function removeReflection(id: string): Promise<void> {

  await sb.from('reflections').delete().eq('id', id)
}

// ── Mood entries ──────────────────────────────────────────────────────────────

export async function fetchMoodEntries(userId: string): Promise<MoodEntry[]> {

  const { data } = await sb.from('mood_entries').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  return (data as MoodEntry[]) || []
}

export async function upsertMoodEntry(entry: MoodEntry): Promise<void> {
 
  await sb.from('mood_entries').upsert(entry)
}

// ── Ideas ─────────────────────────────────────────────────────────────────────

export async function fetchIdeas(userId: string): Promise<BrainDumpIdea[]> {

  const { data } = await sb.from('ideas').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  return (data as BrainDumpIdea[]) || []
}

export async function upsertIdea(idea: BrainDumpIdea): Promise<void> {

  await sb.from('ideas').upsert(idea)
}

export async function removeIdea(id: string): Promise<void> {

  await sb.from('ideas').delete().eq('id', id)
}