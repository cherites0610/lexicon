import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SessionEntry } from '../types'

export const useSessionStore = defineStore('session', () => {
  const entries = ref<SessionEntry[]>([])

  function addOrUpdate(query: string, translation: string): void {
    const queryKey = query.toLowerCase().trim()
    const existing = entries.value.find((e) => e.queryKey === queryKey)

    if (existing) {
      existing.count++
      existing.lastQueriedAt = new Date().toISOString()
      existing.translation = translation
    } else {
      entries.value.push({
        id: crypto.randomUUID(),
        query,
        queryKey,
        translation,
        sourceLang: 'en',
        targetLang: 'zh-TW',
        count: 1,
        firstQueriedAt: new Date().toISOString(),
        lastQueriedAt: new Date().toISOString(),
      })
    }
  }

  function removeEntry(id: string): void {
    entries.value = entries.value.filter((e) => e.id !== id)
  }

  function clearAll(): void {
    entries.value = []
  }

  return { entries, addOrUpdate, removeEntry, clearAll }
})
