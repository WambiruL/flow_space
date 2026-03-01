import type { Task, MoodEntry } from '@/types'

export interface TaskSuggestion {
  task: Task
  reason: string
  score: number
}

export interface SystemAlert {
  type: 'overload' | 'reflect' | 'energy_mismatch'
  message: string
  severity: 'info' | 'warning' | 'critical'
}

/**
 * Score tasks based on current energy level, priority, due date, and energy cost.
 * 
 * Algorithm:
 * 1. Base score from priority (High=30, Medium=20, Low=10)
 * 2. Urgency boost: tasks due today +25, this week +15, overdue +35
 * 3. Energy compatibility: if energy is low (1-2), prefer low-energy-cost tasks
 *    - energy_cost <= 2 gets +20, energy_cost >= 4 gets -20
 *    if energy is high (4-5), prefer high-impact (high priority) tasks
 *    - High priority gets +15 extra
 * 4. Sort descending by score
 */
export function recommendTasks(
  tasks: Task[],
  energyLevel: number,
  limit = 5
): TaskSuggestion[] {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekEnd = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

  const incomplete = tasks.filter(t => !t.completed)

  const scored = incomplete.map(task => {
    let score = 0
    let reasons: string[] = []

    // Priority base score
    const priorityScore = { High: 30, Medium: 20, Low: 10 }[task.priority] || 10
    score += priorityScore

    // Urgency from due date
    if (task.due_date) {
      const due = new Date(task.due_date)
      if (due < today) {
        score += 35
        reasons.push('overdue')
      } else if (due.getTime() === today.getTime()) {
        score += 25
        reasons.push('due today')
      } else if (due <= weekEnd) {
        score += 15
        reasons.push('due this week')
      }
    }

    // Energy compatibility
    if (energyLevel <= 2) {
      // Low energy: prefer low-cost tasks
      if (task.energy_cost <= 2) {
        score += 20
        reasons.push('matches your low energy')
      } else if (task.energy_cost >= 4) {
        score -= 20
      }
    } else if (energyLevel >= 4) {
      // High energy: prefer high priority
      if (task.priority === 'High') {
        score += 15
        reasons.push('high impact')
      }
      if (task.energy_cost >= 3) {
        score += 5
      }
    } else {
      // Medium energy: balanced
      if (task.energy_cost === 3 || task.energy_cost === energyLevel) {
        score += 10
        reasons.push('energy match')
      }
    }

    const reason = reasons.length > 0
      ? reasons.join(', ')
      : `${task.priority.toLowerCase()} priority`

    return { task, score, reason: `Recommended: ${reason}` }
  })

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

/**
 * Detect system-level alerts:
 * - Overload: more than 5 high-priority incomplete tasks
 * - Reflect prompt: mood has been low (<=2) for 3+ consecutive days
 * - Energy mismatch: high energy but only low-energy tasks queued
 */
export function detectAlerts(
  tasks: Task[],
  moodEntries: MoodEntry[],
  energyLevel: number
): SystemAlert[] {
  const alerts: SystemAlert[] = []
  const incomplete = tasks.filter(t => !t.completed)

  // Overload detection
  const highPriority = incomplete.filter(t => t.priority === 'High')
  if (highPriority.length > 5) {
    alerts.push({
      type: 'overload',
      message: `You have ${highPriority.length} high-priority tasks. Consider delegating or rescheduling some.`,
      severity: 'warning',
    })
  }

  // Low mood streak
  const recentMoods = moodEntries
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)

  if (recentMoods.length >= 3 && recentMoods.every(m => m.mood <= 2)) {
    alerts.push({
      type: 'reflect',
      message: 'Your mood has been low for 3+ days. Consider a reflection session to process what\'s weighing on you.',
      severity: 'critical',
    })
  }

  return alerts
}

/**
 * Generate Inner Council prompts for a given dilemma.
 * These are structured, perspective-based prompts.
 */
export function generateCouncilPrompts(dilemma: string): Record<string, string> {
  return {
    ambition: `From your most ambitious self: What does success look like if you pursue "${dilemma}" fully? What would you regret NOT doing in 10 years?`,
    fear: `From your cautious inner voice: What are you most afraid will happen? What's the worst case scenario, and is it truly catastrophic?`,
    stoic: `From a Stoic perspective: What in this situation is within your control? What isn't? What would Marcus Aurelius say about "${dilemma}"?`,
    relationships: `From your relational self: How does this decision affect the people you love and who love you? What would they say if they knew everything?`,
    creative: `From your creative self: What's the unconventional path no one is suggesting? Is there a third option beyond the obvious two?`,
  }
}
