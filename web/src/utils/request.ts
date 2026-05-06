import axios, { type AxiosError, type AxiosResponse } from 'axios'
import { STORAGE_KEYS, getStorage } from './localStorage'
import { loginPromptVisible, quotaExceededVisible } from './promptState'

interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
})

request.interceptors.request.use((config) => {
  const token = getStorage<string>(STORAGE_KEYS.ACCESS_TOKEN, '')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => response.data.data as AxiosResponse,
  (error: AxiosError<ApiResponse>) => {
    const status = error.response?.status
    const message = error.response?.data?.message ?? error.message ?? '請求失敗'

    if (status === 401) {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
      loginPromptVisible.value = true
      return Promise.reject(new Error('請先登入後再使用此功能'))
    }

    if (status === 402) {
      quotaExceededVisible.value = true
      return Promise.reject(new Error(message))
    }

    return Promise.reject(new Error(message))
  },
)

export default request
