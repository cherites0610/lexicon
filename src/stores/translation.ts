import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { TranslationResult } from '../types'

export const useTranslationStore = defineStore('translation', () => {
  const result = ref<TranslationResult | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const translationHistory = ref<Map<string, TranslationResult>>(new Map())

  function setResult(data: TranslationResult) {
    if (translationHistory.value.has(data.english)) {
      translationHistory.value.delete(data.english)
    }
    translationHistory.value.set(data.english, data)
    result.value = data
    error.value = null
  }

  function setError(message: string) {
    error.value = message
  }

  function setLoading(loading: boolean) {
    isLoading.value = loading
  }

  function clear() {
    result.value = null
    error.value = null
  }

  function clearHistory() {
    translationHistory.value = new Map();
  }

  return { translationHistory, result, isLoading, error, setResult, setError, setLoading, clear, clearHistory }
})
