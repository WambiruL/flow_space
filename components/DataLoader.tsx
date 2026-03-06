'use client'

import { useEffect } from 'react'
import { useStore } from '@/store'
import { createClient } from '@supabase/supabase-js'
import { useRouter, usePathname } from 'next/navigation'
import {
  fetchProjects, fetchTasks, fetchReflections,
  fetchMoodEntries, fetchIdeas,
} from '@/lib/idb'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function DataLoader() {
  const router   = useRouter()
  const pathname = usePathname()
  const {
    userId, setUserId,
    setProjects, setTasks, setReflections, setMoodEntries, setIdeas,
  } = useStore()

  useEffect(() => {
    // Listen for auth state changes — single source of truth for routing
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const id = session?.user?.id || null
      setUserId(id)

      if (!id) {
        // Signed out — go to auth, clear store
        localStorage.removeItem('flowspace-store')
        router.replace('/auth')
      } else if (pathname === '/auth') {
        // Signed in but on auth page — go to dashboard
        router.replace('/dashboard')
      }
    })

    return () => subscription.unsubscribe()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Load data when userId is set
  useEffect(() => {
    if (!userId || userId === 'demo-user') return

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
  }, [userId]) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}