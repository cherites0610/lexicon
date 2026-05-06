export interface TranslationResult {
  corrected: string | null
  english: string
  chinese: string
  pinyin: string
  ipa: string
}

export interface User {
  id: string
  googleId: string
  googleName: string
  googleEmail: string
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
