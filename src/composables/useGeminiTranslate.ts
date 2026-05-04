import type { TranslationResult } from '../types'
import { useModelsStore } from '../stores/models'
import { useTranslationStore } from '../stores/translation'
import { useSessionStore } from '../stores/session'

const PROMPT = (text: string) =>
  `You are an English-to-Traditional-Chinese translator with spell correction.

Input: "${text}"

1. If the input looks like a misspelled English word or phrase, identify the correct spelling.
2. Translate the (corrected) English to Traditional Chinese (繁體中文).
3. Provide pinyin with tone marks for the Chinese.
4. Provide IPA notation for the English.

Return ONLY valid JSON in this exact shape:
{
  "corrected": "<corrected spelling>" | null,
  "english": "<correct English>",
  "chinese": "<Traditional Chinese>",
  "pinyin": "<pinyin with tones>",
  "ipa": "<IPA>"
}

"corrected" must be null if the input had no spelling errors.`

function parseJson(raw: string): TranslationResult {
  const cleaned = raw.replace(/^```(?:json)?\s*/im, '').replace(/\s*```\s*$/m, '').trim()
  return JSON.parse(cleaned) as TranslationResult
}

async function callGemini(apiKey: string, modelName: string, text: string): Promise<TranslationResult> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: PROMPT(text) }] }] }),
    },
  )

  if (!response.ok) {
    const err = (await response.json().catch(() => ({}))) as { error?: { message?: string } }
    throw new Error(`API 錯誤 ${response.status}：${err.error?.message ?? response.statusText}`)
  }

  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
  }
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? ''
  return parseJson(raw)
}

async function callOpenAICompatible(
  apiUrl: string,
  apiKey: string,
  modelName: string,
  text: string,
): Promise<TranslationResult> {
  const base = apiUrl.replace(/\/$/, '')
  const response = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: modelName,
      messages: [{ role: 'user', content: PROMPT(text) }],
    }),
  })

  if (!response.ok) {
    const err = (await response.json().catch(() => ({}))) as { error?: { message?: string } }
    throw new Error(`API 錯誤 ${response.status}：${err.error?.message ?? response.statusText}`)
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }
  const raw = data.choices?.[0]?.message?.content?.trim() ?? ''
  return parseJson(raw)
}

export function useGeminiTranslate() {
  const modelsStore = useModelsStore()
  const translationStore = useTranslationStore()
  const sessionStore = useSessionStore()

  async function translate(text: string): Promise<void> {
    const activeModel = modelsStore.activeModel

    if (!activeModel) {
      translationStore.setError('請先在模型設定中新增並選擇模型')
      return
    }

    if (!text.trim()) return

    translationStore.setLoading(true)
    translationStore.clear()

    try {
      const trimmed = text.trim()
      let result: TranslationResult

      if (activeModel.type === 'openai-compatible' && activeModel.apiUrl) {
        result = await callOpenAICompatible(activeModel.apiUrl, activeModel.apiKey, activeModel.modelName, trimmed)
      } else {
        result = await callGemini(activeModel.apiKey, activeModel.modelName, trimmed)
      }

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
