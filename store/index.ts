import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Project, Task, Reflection, MoodEntry, BrainDumpIdea } from '@/types'
import { generateId } from '@/lib/utils'
import {
  upsertProject, removeProject,
  upsertTask,    removeTask,
  upsertReflection, removeReflection,
  upsertMoodEntry,
  upsertIdea,    removeIdea,
} from '@/lib/idb'

interface AppState {
  energyLevel: number
  setEnergyLevel: (level: number) => void

  projects: Project[]
  setProjects: (projects: Project[]) => void
  addProject: (project: Omit<Project, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'progress'>) => Project
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void

  tasks: Task[]
  setTasks: (tasks: Task[]) => void
  addTask: (task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'completed_at'>) => Task
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  toggleTask: (id: string) => void

  reflections: Reflection[]
  setReflections: (reflections: Reflection[]) => void
  addReflection: (reflection: Omit<Reflection, 'id' | 'user_id' | 'created_at'>) => Reflection
  updateReflection: (id: string, updates: Partial<Reflection>) => void
  deleteReflection: (id: string) => void

  moodEntries: MoodEntry[]
  setMoodEntries: (entries: MoodEntry[]) => void
  addMoodEntry: (entry: Omit<MoodEntry, 'id' | 'user_id' | 'created_at'>) => MoodEntry
  updateMoodEntry: (id: string, updates: Partial<MoodEntry>) => void

  ideas: BrainDumpIdea[]
  setIdeas: (ideas: BrainDumpIdea[]) => void
  addIdea: (idea: Omit<BrainDumpIdea, 'id' | 'user_id' | 'created_at'>) => BrainDumpIdea
  updateIdea: (id: string, updates: Partial<BrainDumpIdea>) => void
  deleteIdea: (id: string) => void

  isOnline: boolean
  setIsOnline: (online: boolean) => void

  userId: string | null
  setUserId: (id: string | null) => void

  recalcProjectProgress: (projectId: string) => void
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      energyLevel: 3,
      setEnergyLevel: (level) => set({ energyLevel: level }),

      // ── Projects ────────────────────────────────────────────────────────────
      projects: [],
      setProjects: (projects) => set({ projects }),
      addProject: (project) => {
        const now = new Date().toISOString()
        const newProject: Project = {
          id: generateId(),
          user_id: get().userId || 'local',
          progress: 0,
          created_at: now,
          updated_at: now,
          ...project,
        }
        set(s => ({ projects: [newProject, ...s.projects] }))
        upsertProject(newProject)
        return newProject
      },
      updateProject: (id, updates) => {
        const updated = { ...get().projects.find(p => p.id === id)!, ...updates, updated_at: new Date().toISOString() }
        set(s => ({ projects: s.projects.map(p => p.id === id ? updated : p) }))
        upsertProject(updated)
      },
      deleteProject: (id) => {
        set(s => ({ projects: s.projects.filter(p => p.id !== id) }))
        removeProject(id)
      },

      // ── Tasks ────────────────────────────────────────────────────────────────
      tasks: [],
      setTasks: (tasks) => set({ tasks }),
      addTask: (task) => {
        const now = new Date().toISOString()
        const newTask: Task = {
          id: generateId(),
          user_id: get().userId || 'local',
          // completed: false,
          completed_at: null,
          created_at: now,
          updated_at: now,
          ...task,
        }
        set(s => ({ tasks: [newTask, ...s.tasks] }))
        upsertTask(newTask)
        if (newTask.project_id) get().recalcProjectProgress(newTask.project_id)
        return newTask
      },
      updateTask: (id, updates) => {
        const updated = { ...get().tasks.find(t => t.id === id)!, ...updates, updated_at: new Date().toISOString() }
        set(s => ({ tasks: s.tasks.map(t => t.id === id ? updated : t) }))
        upsertTask(updated)
        if (updated.project_id) get().recalcProjectProgress(updated.project_id)
      },
      deleteTask: (id) => {
        const task = get().tasks.find(t => t.id === id)
        set(s => ({ tasks: s.tasks.filter(t => t.id !== id) }))
        removeTask(id)
        if (task?.project_id) get().recalcProjectProgress(task.project_id)
      },
      toggleTask: (id) => {
        const task = get().tasks.find(t => t.id === id)
        if (!task) return
        const completed = !task.completed
        const updated = { ...task, completed, completed_at: completed ? new Date().toISOString() : null, updated_at: new Date().toISOString() }
        set(s => ({ tasks: s.tasks.map(t => t.id === id ? updated : t) }))
        upsertTask(updated)
        if (task.project_id) get().recalcProjectProgress(task.project_id)
      },

      // ── Reflections ──────────────────────────────────────────────────────────
      reflections: [],
      setReflections: (reflections) => set({ reflections }),
      addReflection: (reflection) => {
        const newReflection: Reflection = {
          id: generateId(),
          user_id: get().userId || 'local',
          created_at: new Date().toISOString(),
          ...reflection,
        }
        set(s => ({ reflections: [newReflection, ...s.reflections] }))
        upsertReflection(newReflection)
        return newReflection
      },
      updateReflection: (id, updates) => {
        const updated = { ...get().reflections.find(r => r.id === id)!, ...updates }
        set(s => ({ reflections: s.reflections.map(r => r.id === id ? updated : r) }))
        upsertReflection(updated)
      },
      deleteReflection: (id) => {
        set(s => ({ reflections: s.reflections.filter(r => r.id !== id) }))
        removeReflection(id)
      },

      // ── Mood entries ─────────────────────────────────────────────────────────
      moodEntries: [],
      setMoodEntries: (moodEntries) => set({ moodEntries }),
      addMoodEntry: (entry) => {
        const newEntry: MoodEntry = {
          id: generateId(),
          user_id: get().userId || 'local',
          created_at: new Date().toISOString(),
          ...entry,
        }
        set(s => ({ moodEntries: [newEntry, ...s.moodEntries] }))
        upsertMoodEntry(newEntry)
        return newEntry
      },
      updateMoodEntry: (id, updates) => {
        const updated = { ...get().moodEntries.find(e => e.id === id)!, ...updates }
        set(s => ({ moodEntries: s.moodEntries.map(e => e.id === id ? updated : e) }))
        upsertMoodEntry(updated)
      },

      // ── Ideas ────────────────────────────────────────────────────────────────
      ideas: [],
      setIdeas: (ideas) => set({ ideas }),
      addIdea: (idea) => {
        const newIdea: BrainDumpIdea = {
          id: generateId(),
          user_id: get().userId || 'local',
          created_at: new Date().toISOString(),
          ...idea,
        }
        set(s => ({ ideas: [newIdea, ...s.ideas] }))
        upsertIdea(newIdea)
        return newIdea
      },
      updateIdea: (id, updates) => {
        const updated = { ...get().ideas.find(i => i.id === id)!, ...updates }
        set(s => ({ ideas: s.ideas.map(i => i.id === id ? updated : i) }))
        upsertIdea(updated)
      },
      deleteIdea: (id) => {
        set(s => ({ ideas: s.ideas.filter(i => i.id !== id) }))
        removeIdea(id)
      },

      isOnline: true,
      setIsOnline: (isOnline) => set({ isOnline }),

      userId: null,
      setUserId: (userId) => set({ userId }),

      recalcProjectProgress: (projectId) => {
        const tasks = get().tasks.filter(t => t.project_id === projectId)
        if (tasks.length === 0) return
        const progress = Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)
        const updated = { ...get().projects.find(p => p.id === projectId)!, progress }
        set(s => ({ projects: s.projects.map(p => p.id === projectId ? updated : p) }))
        upsertProject(updated)
      },
    }),
    {
      name: 'flowspace-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        energyLevel: state.energyLevel,
        projects: state.projects,
        tasks: state.tasks,
        reflections: state.reflections,
        moodEntries: state.moodEntries,
        ideas: state.ideas,
        userId: state.userId,
      }),
    }
  )
)