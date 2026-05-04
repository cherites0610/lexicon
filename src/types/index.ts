export type ModelType = 'gemini' | 'openai-compatible'

export interface GeminiModel {
  id: string
  name: string
  apiKey: string
  modelName: string
  createdAt: string
  type?: ModelType
  apiUrl?: string
}

export interface TranslationResult {
  corrected: string | null
  english: string
  chinese: string
  pinyin: string
  ipa: string
}

export interface SessionEntry {
  id: string
  query: string
  queryKey: string
  translation: string
  sourceLang: string
  targetLang: string
  count: number
  firstQueriedAt: string
  lastQueriedAt: string
}
