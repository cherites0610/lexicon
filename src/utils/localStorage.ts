export const STORAGE_KEYS = {
  MODELS: 'lexicon:models',
  ACTIVE_MODEL_ID: 'lexicon:active-model-id',
  LANGUAGE_PREFERENCE: 'lexicon:lang',
  TRANSLATION_SETTINGS: 'lexicon:translation',
} as const

export function getStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.warn(`[localStorage] 寫入失敗：${key}`, e)
  }
}
