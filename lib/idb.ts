'use client'

import { openDB, IDBPDatabase } from 'idb'

const DB_NAME = 'flowspace'
const DB_VERSION = 1

let db: IDBPDatabase | null = null

export async function getDB() {
  if (db) return db
  db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(database) {
      const stores = ['projects', 'tasks', 'reflections', 'mood_entries', 'brain_dump', 'sync_queue']
      for (const store of stores) {
        if (!database.objectStoreNames.contains(store)) {
          database.createObjectStore(store, { keyPath: 'id' })
        }
      }
    },
  })
  return db
}

export async function localGet<T>(store: string, id: string): Promise<T | undefined> {
  const database = await getDB()
  return database.get(store, id)
}

export async function localGetAll<T>(store: string): Promise<T[]> {
  const database = await getDB()
  return database.getAll(store)
}

export async function localPut<T>(store: string, value: T): Promise<void> {
  const database = await getDB()
  await database.put(store, value)
}

export async function localDelete(store: string, id: string): Promise<void> {
  const database = await getDB()
  await database.delete(store, id)
}

export async function queueSync(operation: { type: 'create' | 'update' | 'delete'; store: string; data: any }) {
  const database = await getDB()
  await database.put('sync_queue', {
    id: `${Date.now()}-${Math.random()}`,
    ...operation,
    queued_at: new Date().toISOString(),
  })
}

export async function getSyncQueue() {
  const database = await getDB()
  return database.getAll('sync_queue')
}

export async function clearSyncItem(id: string) {
  const database = await getDB()
  await database.delete('sync_queue', id)
}
