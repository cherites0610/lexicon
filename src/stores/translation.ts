import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { TranslationResult } from '../types'

export const useTranslationStore = defineStore('translation', () => {
  const result = ref<TranslationResult | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  function setResult(data: TranslationResult) {
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

  return { result, isLoading, error, setResult, setError, setLoading, clear }
})
