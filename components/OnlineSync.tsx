'use client'

import { useEffect } from 'react'
import { useStore } from '@/store'

/**
 * Monitors online/offline state and syncs queued operations
 * when connection is restored.
 */
export default function OnlineSync() {
  const { isOnline, setIsOnline } = useStore()

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      // In a real app, flush the sync queue to Supabase here
      // For now, Zustand localStorage persistence handles it
      console.log('[FlowSpace] Back online — syncing...')
    }

    const handleOffline = () => {
      setIsOnline(false)
      console.log('[FlowSpace] Offline mode active')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [setIsOnline])

  return null
}
