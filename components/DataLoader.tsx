'use client'

import { useEffect } from 'react'
import { useStore } from '@/store'
import {
  fetchProjects, fetchTasks, fetchReflections,
  fetchMoodEntries, fetchIdeas,
} from '@/lib/idb'

export default function DataLoader() {
  const { userId, setProjects, setTasks, setReflections, setMoodEntries, setIdeas } = useStore()

  useEffect(() => {
    if (!userId || userId === 'local') return

    async function load() {
      const [projects, tasks, reflections, moodEntries, ideas] = await Promise.all([
        fetchProjects(userId!),
        fetchTasks(userId!),
        fetchReflections(userId!),
        fetchMoodEntries(userId!),
        fetchIdeas(userId!),
      ])
      setProjects(projects)
      setTasks(tasks)
      setReflections(reflections)
      setMoodEntries(moodEntries)
      setIdeas(ideas)
    }

    load()
  }, [userId])

  return null
}