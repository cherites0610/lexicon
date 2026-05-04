import { ref } from 'vue'
import type { GeminiModel } from '../types'

type TestPayload = Pick<GeminiModel, 'apiKey' | 'modelName' | 'type' | 'apiUrl'>

export function useModelTest() {
  const testing = ref(false)
  const testResult = ref<'success' | 'error' | null>(null)
  const testError = ref('')

  async function testConnection(payload: TestPayload): Promise<void> {
    testing.value = true
    testResult.value = null
    testError.value = ''

    try {
      if (payload.type === 'openai-compatible' && payload.apiUrl) {
        const base = payload.apiUrl.replace(/\/$/, '')
        const res = await fetch(`${base}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.apiKey}`,
          },
          body: JSON.stringify({
            model: payload.modelName,
            messages: [{ role: 'user', content: 'hi' }],
            max_tokens: 5,
          }),
        })
        if (!res.ok) {
          const err = (await res.json().catch(() => ({}))) as { error?: { message?: string } }
          throw new Error(err.error?.message ?? `HTTP ${res.status}`)
        }
      } else {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${payload.modelName}:generateContent?key=${payload.apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: 'hi' }] }] }),
          },
        )
        if (!res.ok) {
          const err = (await res.json().catch(() => ({}))) as { error?: { message?: string } }
          throw new Error(err.error?.message ?? `HTTP ${res.status}`)
        }
      }
      testResult.value = 'success'
    } catch (e) {
      testResult.value = 'error'
      testError.value = e instanceof Error ? e.message : '連接失敗'
    } finally {
      testing.value = false
    }
  }

  function reset() {
    testResult.value = null
    testError.value = ''
  }

  return { testing, testResult, testError, testConnection, reset }
}
