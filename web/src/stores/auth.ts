import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import request from '../utils/request'
import { STORAGE_KEYS, getStorage } from '../utils/localStorage'
import type { User } from '../types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoggedIn = computed(() => !!user.value)

  async function fetchUser(): Promise<void> {
    if (!getStorage<string>(STORAGE_KEYS.ACCESS_TOKEN, '')) return
    try {
      user.value = await request.get<unknown, User>('/user/me')
    } catch {
      user.value = null
    }
  }

  async function loginWithGoogle(): Promise<void> {
    const url = await request.get<unknown, string>('/auth/login-url')
    window.location.href = url
  }

  function logout(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    user.value = null
  }

  return { user, isLoggedIn, fetchUser, loginWithGoogle, logout }
})
