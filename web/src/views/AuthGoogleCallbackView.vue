<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CheckmarkCircleOutline, CloseCircleOutline } from '@vicons/ionicons5'
import { STORAGE_KEYS, setStorage } from '../utils/localStorage'
import request from '../utils/request'
import { useAuthStore } from '../stores/auth'

type Status = 'loading' | 'success' | 'error'

const route = useRoute()
const router = useRouter()

const status = ref<Status>('loading')
const errorMessage = ref('')
const authStore = useAuthStore()

async function exchangeCode(code: string): Promise<void> {
  const data = await request.post<unknown, { accessToken: string }>('/auth/google/callback', { code })
  setStorage(STORAGE_KEYS.ACCESS_TOKEN, data.accessToken)
  await authStore.fetchUser()
}

onMounted(async () => {
  const code = route.query.code
  const error = route.query.error

  if (error) {
    errorMessage.value = 'Google 登入遭拒或取消，請重試。'
    status.value = 'error'
    return
  }

  if (!code || typeof code !== 'string') {
    errorMessage.value = '無效的回調參數，請重新登入。'
    status.value = 'error'
    return
  }

  try {
    await exchangeCode(code)
    status.value = 'success'
    setTimeout(() => router.replace({ name: 'home' }), 1500)
  } catch (e) {
    errorMessage.value = e instanceof Error ? e.message : '登入失敗，請稍後再試。'
    status.value = 'error'
  }
})
</script>

<template>
  <div class="min-h-screen bg-neutral-950 flex flex-col items-center justify-center px-6 gap-6">
    <span class="text-white font-bold text-xl tracking-tight self-start absolute top-5 left-6">Lexicon</span>

    <template v-if="status === 'loading'">
      <n-spin size="large" />
      <p class="text-neutral-400">正在完成登入，請稍候⋯</p>
    </template>

    <template v-else-if="status === 'success'">
      <n-icon size="56" class="text-green-400">
        <CheckmarkCircleOutline />
      </n-icon>
      <div class="flex flex-col items-center gap-1">
        <p class="text-white font-semibold text-lg">登入成功</p>
        <p class="text-neutral-500 text-sm">即將跳轉⋯</p>
      </div>
    </template>

    <template v-else>
      <n-icon size="56" class="text-red-400">
        <CloseCircleOutline />
      </n-icon>
      <div class="flex flex-col items-center gap-1 text-center">
        <p class="text-white font-semibold text-lg">登入失敗</p>
        <p class="text-neutral-400 text-sm max-w-xs">{{ errorMessage }}</p>
      </div>
      <n-button @click="router.replace({ name: 'home' })">返回首頁</n-button>
    </template>
  </div>
</template>
