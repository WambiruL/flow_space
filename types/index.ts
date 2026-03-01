export type Category = 'Creative' | 'Career' | 'Learning' | 'Personal'
export type ProjectStatus = 'Active' | 'Paused' | 'Completed'
export type Priority = 'Low' | 'Medium' | 'High'

export interface Project {
  id: string
  user_id: string
  title: string
  description: string
  category: Category
  deadline: string | null
  status: ProjectStatus
  progress: number
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  user_id: string
  project_id: string | null
  title: string
  priority: Priority
  energy_cost: number // 1-5
  due_date: string | null
  completed: boolean
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface Reflection {
  id: string
  user_id: string
  dilemma: string
  ambition_prompt: string
  ambition_response: string
  fear_prompt: string
  fear_response: string
  stoic_prompt: string
  stoic_response: string
  relationships_prompt: string
  relationships_response: string
  creative_prompt: string
  creative_response: string
  created_at: string
}

export interface MoodEntry {
  id: string
  user_id: string
  date: string
  mood: number // 1-5
  focus: number // 1-5
  journal: string
  energy: number // 1-5
  created_at: string
}

export interface BrainDumpIdea {
  id: string
  user_id: string
  content: string
  tags: string[]
  converted_to: 'task' | 'project' | null
  converted_id: string | null
  created_at: string
}

export interface UserSettings {
  energy_level: number
  last_energy_update: string
}
