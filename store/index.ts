import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Project, Task, Reflection, MoodEntry, BrainDumpIdea } from '@/types'
import { generateId } from '@/lib/utils'

interface AppState {
  // Energy
  energyLevel: number
  setEnergyLevel: (level: number) => void

  // Projects
  projects: Project[]
  setProjects: (projects: Project[]) => void
  addProject: (project: Omit<Project, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'progress'>) => Project
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void

  // Tasks
  tasks: Task[]
  setTasks: (tasks: Task[]) => void
  addTask: (task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'completed_at'>) => Task
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  toggleTask: (id: string) => void

  // Reflections
  reflections: Reflection[]
  setReflections: (reflections: Reflection[]) => void
  addReflection: (reflection: Omit<Reflection, 'id' | 'user_id' | 'created_at'>) => Reflection
  updateReflection: (id: string, updates: Partial<Reflection>) => void
  deleteReflection: (id: string) => void

  // Mood
  moodEntries: MoodEntry[]
  setMoodEntries: (entries: MoodEntry[]) => void
  addMoodEntry: (entry: Omit<MoodEntry, 'id' | 'user_id' | 'created_at'>) => MoodEntry
  updateMoodEntry: (id: string, updates: Partial<MoodEntry>) => void

  // Brain Dump
  ideas: BrainDumpIdea[]
  setIdeas: (ideas: BrainDumpIdea[]) => void
  addIdea: (idea: Omit<BrainDumpIdea, 'id' | 'user_id' | 'created_at'>) => BrainDumpIdea
  updateIdea: (id: string, updates: Partial<BrainDumpIdea>) => void
  deleteIdea: (id: string) => void

  // Online status
  isOnline: boolean
  setIsOnline: (online: boolean) => void

  // User
  userId: string | null
  setUserId: (id: string | null) => void

  // Recalculate project progress
  recalcProjectProgress: (projectId: string) => void
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      energyLevel: 3,
      setEnergyLevel: (level) => set({ energyLevel: level }),

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
        return newProject
      },
      updateProject: (id, updates) => set(s => ({
        projects: s.projects.map(p => p.id === id
          ? { ...p, ...updates, updated_at: new Date().toISOString() }
          : p
        ),
      })),
      deleteProject: (id) => set(s => ({ projects: s.projects.filter(p => p.id !== id) })),

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
        if (newTask.project_id) get().recalcProjectProgress(newTask.project_id)
        return newTask
      },
      updateTask: (id, updates) => {
        set(s => ({
          tasks: s.tasks.map(t => t.id === id
            ? { ...t, ...updates, updated_at: new Date().toISOString() }
            : t
          ),
        }))
        const task = get().tasks.find(t => t.id === id)
        if (task?.project_id) get().recalcProjectProgress(task.project_id)
      },
      deleteTask: (id) => {
        const task = get().tasks.find(t => t.id === id)
        set(s => ({ tasks: s.tasks.filter(t => t.id !== id) }))
        if (task?.project_id) get().recalcProjectProgress(task.project_id)
      },
      toggleTask: (id) => {
        const task = get().tasks.find(t => t.id === id)
        if (!task) return
        const completed = !task.completed
        set(s => ({
          tasks: s.tasks.map(t => t.id === id
            ? { ...t, completed, completed_at: completed ? new Date().toISOString() : null, updated_at: new Date().toISOString() }
            : t
          ),
        }))
        if (task.project_id) get().recalcProjectProgress(task.project_id)
      },

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
        return newReflection
      },
      updateReflection: (id, updates) => set(s => ({
        reflections: s.reflections.map(r => r.id === id ? { ...r, ...updates } : r),
      })),
      deleteReflection: (id) => set(s => ({
        reflections: s.reflections.filter(r => r.id !== id),
      })),

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
        return newEntry
      },
      updateMoodEntry: (id, updates) => set(s => ({
        moodEntries: s.moodEntries.map(e => e.id === id ? { ...e, ...updates } : e),
      })),

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
        return newIdea
      },
      updateIdea: (id, updates) => set(s => ({
        ideas: s.ideas.map(i => i.id === id ? { ...i, ...updates } : i),
      })),
      deleteIdea: (id) => set(s => ({ ideas: s.ideas.filter(i => i.id !== id) })),

      isOnline: true,
      setIsOnline: (isOnline) => set({ isOnline }),

      userId: null,
      setUserId: (userId) => set({ userId }),

      recalcProjectProgress: (projectId) => {
        const tasks = get().tasks.filter(t => t.project_id === projectId)
        if (tasks.length === 0) return
        const completed = tasks.filter(t => t.completed).length
        const progress = Math.round((completed / tasks.length) * 100)
        set(s => ({
          projects: s.projects.map(p => p.id === projectId ? { ...p, progress } : p),
        }))
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
