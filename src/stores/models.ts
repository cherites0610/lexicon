import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GeminiModel } from '../types'
import { getStorage, setStorage, STORAGE_KEYS } from '../utils/localStorage'

export const useModelsStore = defineStore('models', () => {
  const models = ref<GeminiModel[]>(getStorage<GeminiModel[]>(STORAGE_KEYS.MODELS, []))
  const activeModelId = ref<string | null>(
    getStorage<string | null>(STORAGE_KEYS.ACTIVE_MODEL_ID, null),
  )

  const activeModel = computed(
    () => models.value.find((m) => m.id === activeModelId.value) ?? null,
  )

  function addModel(data: Omit<GeminiModel, 'id' | 'createdAt'>): void {
    const newModel: GeminiModel = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    models.value.push(newModel)
    if (models.value.length === 1) {
      activeModelId.value = newModel.id
      setStorage(STORAGE_KEYS.ACTIVE_MODEL_ID, newModel.id)
    }
    setStorage(STORAGE_KEYS.MODELS, models.value)
  }

  function updateModel(id: string, data: Partial<Omit<GeminiModel, 'id' | 'createdAt'>>): void {
    const index = models.value.findIndex((m) => m.id === id)
    if (index !== -1) {
      models.value[index] = { ...models.value[index], ...data }
      setStorage(STORAGE_KEYS.MODELS, models.value)
    }
  }

  function removeModel(id: string): void {
    models.value = models.value.filter((m) => m.id !== id)
    if (activeModelId.value === id) {
      activeModelId.value = models.value[0]?.id ?? null
      setStorage(STORAGE_KEYS.ACTIVE_MODEL_ID, activeModelId.value)
    }
    setStorage(STORAGE_KEYS.MODELS, models.value)
  }

  function setActiveModel(id: string): void {
    activeModelId.value = id
    setStorage(STORAGE_KEYS.ACTIVE_MODEL_ID, id)
  }

  return { models, activeModelId, activeModel, addModel, updateModel, removeModel, setActiveModel }
})
