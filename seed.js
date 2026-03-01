/**
 * FlowSpace Seed Data
 * 
 * This seeds the Zustand store via localStorage for demo purposes.
 * Run this in the browser console to populate demo data.
 * 
 * Or: The app will automatically show demo data when using Demo Mode.
 */

const SEED_USER_ID = 'demo-user'

const now = new Date().toISOString()
const today = new Date().toISOString().split('T')[0]
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]
const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]

const projects = [
  {
    id: 'proj-1',
    user_id: SEED_USER_ID,
    title: 'Personal Brand Site',
    description: 'Design and develop my portfolio showcasing creative + engineering work',
    category: 'Creative',
    deadline: nextWeek,
    status: 'Active',
    progress: 35,
    created_at: now,
    updated_at: now,
  },
  {
    id: 'proj-2',
    user_id: SEED_USER_ID,
    title: 'Senior Dev Job Search',
    description: 'Apply to senior roles at design-forward tech companies',
    category: 'Career',
    deadline: nextWeek,
    status: 'Active',
    progress: 60,
    created_at: now,
    updated_at: now,
  },
  {
    id: 'proj-3',
    user_id: SEED_USER_ID,
    title: 'Learn Rust Deeply',
    description: 'Work through The Book and build a CLI tool for personal use',
    category: 'Learning',
    deadline: null,
    status: 'Paused',
    progress: 20,
    created_at: now,
    updated_at: now,
  },
]

const tasks = [
  {
    id: 'task-1',
    user_id: SEED_USER_ID,
    project_id: 'proj-1',
    title: 'Write hero section copy',
    priority: 'High',
    energy_cost: 4,
    due_date: today,
    completed: false,
    completed_at: null,
    created_at: now,
    updated_at: now,
  },
  {
    id: 'task-2',
    user_id: SEED_USER_ID,
    project_id: 'proj-2',
    title: 'Tailor resume for Stripe application',
    priority: 'High',
    energy_cost: 3,
    due_date: tomorrow,
    completed: false,
    completed_at: null,
    created_at: now,
    updated_at: now,
  },
  {
    id: 'task-3',
    user_id: SEED_USER_ID,
    project_id: 'proj-1',
    title: 'Collect 5 project screenshots',
    priority: 'Medium',
    energy_cost: 2,
    due_date: tomorrow,
    completed: false,
    completed_at: null,
    created_at: now,
    updated_at: now,
  },
  {
    id: 'task-4',
    user_id: SEED_USER_ID,
    project_id: null,
    title: 'Do 15 min meditation',
    priority: 'Low',
    energy_cost: 1,
    due_date: today,
    completed: true,
    completed_at: now,
    created_at: now,
    updated_at: now,
  },
  {
    id: 'task-5',
    user_id: SEED_USER_ID,
    project_id: 'proj-2',
    title: 'Research company culture at Linear',
    priority: 'Medium',
    energy_cost: 2,
    due_date: nextWeek,
    completed: false,
    completed_at: null,
    created_at: now,
    updated_at: now,
  },
]

const moodEntries = [
  { id: 'mood-1', user_id: SEED_USER_ID, date: today, mood: 4, focus: 3, energy: 4, journal: 'Good morning. Feeling motivated but slightly scattered.', created_at: now },
]

const ideas = [
  { id: 'idea-1', user_id: SEED_USER_ID, content: 'Build a CLI tool that summarizes my daily task completions into a weekly digest', tags: ['tools', 'productivity'], converted_to: null, converted_id: null, created_at: now },
  { id: 'idea-2', user_id: SEED_USER_ID, content: 'Write a blog post about designing for your own mental health', tags: ['writing', 'mental-health'], converted_to: null, converted_id: null, created_at: now },
  { id: 'idea-3', user_id: SEED_USER_ID, content: 'Explore Framer Motion for the portfolio site animations', tags: ['portfolio', 'animation'], converted_to: null, converted_id: null, created_at: now },
]

// Inject into Zustand localStorage store
const currentStore = JSON.parse(localStorage.getItem('flowspace-store') || '{"state":{}}')
currentStore.state = {
  ...currentStore.state,
  projects,
  tasks,
  moodEntries,
  ideas,
  userId: SEED_USER_ID,
  energyLevel: 4,
}
localStorage.setItem('flowspace-store', JSON.stringify(currentStore))
console.log('✅ FlowSpace seed data loaded! Refresh the page.')
