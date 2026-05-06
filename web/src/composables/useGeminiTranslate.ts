import type { TranslationResult } from '../types'
import { useTranslationStore } from '../stores/translation'
import { useSessionStore } from '../stores/session'
import request from '../utils/request'

export function useGeminiTranslate() {
  const translationStore = useTranslationStore()
  const sessionStore = useSessionStore()

  async function translate(text: string): Promise<void> {
    if (!text.trim()) return

    translationStore.setLoading(true)
    translationStore.clear()

    try {
      const trimmed = text.trim()
      const result = await request.post<unknown, TranslationResult>('/util/translate', { text: trimmed })
      translationStore.setResult(result)
      sessionStore.addOrUpdate(trimmed, result.chinese)
    } catch (e) {
      translationStore.setError(e instanceof Error ? e.message : '翻譯失敗，請稍後再試')
    } finally {
      translationStore.setLoading(false)
    }
  }

  return { translate }
}
