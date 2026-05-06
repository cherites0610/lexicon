<script setup lang="ts">
import { h } from 'vue'
import { NIcon, useMessage } from 'naive-ui'
import { LogoGoogle, PersonOutline, LogOutOutline } from '@vicons/ionicons5'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const message = useMessage()

function icon(component: unknown) {
  return () => h(NIcon, null, { default: () => h(component as Parameters<typeof h>[0]) })
}

const dropdownOptions = [
  { label: '個人資料', key: 'profile', icon: icon(PersonOutline) },
  { type: 'divider', key: 'divider' },
  { label: '登出', key: 'logout', icon: icon(LogOutOutline) },
]

async function handleLoginClick() {
  try {
    await authStore.loginWithGoogle()
  } catch {
    message.error('無法取得登入連結，請稍後再試')
  }
}

function handleDropdownSelect(key: string) {
  if (key === 'profile') router.push({ name: 'profile' })
  if (key === 'logout') authStore.logout()
}
</script>

<template>
  <header class="px-4 py-2 flex items-center gap-3 shrink-0">
    <router-link :to="{ name: 'home' }"
      class="text-white font-bold text-lg tracking-tight shrink-0 hover:text-blue-400 transition-colors">
      Lexicon
    </router-link>

    <div class="flex-1">
      <slot />
    </div>

    <div class="shrink-0">
      <n-button v-if="!authStore.isLoggedIn" size="small" @click="handleLoginClick">
        <template #icon>
          <n-icon><LogoGoogle /></n-icon>
        </template>
        使用 Google 登入
      </n-button>

      <n-dropdown v-else trigger="click" :options="dropdownOptions" @select="handleDropdownSelect">
        <n-button quaternary size="small">
          <template #icon>
            <n-icon><PersonOutline /></n-icon>
          </template>
          {{ authStore.user?.googleName }}
        </n-button>
      </n-dropdown>
    </div>
  </header>
</template>
