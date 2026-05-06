<script setup lang="ts">
import { LogoGoogle } from '@vicons/ionicons5'
import { loginPromptVisible } from '../utils/promptState'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

async function handleLogin() {
  loginPromptVisible.value = false
  await authStore.loginWithGoogle()
}
</script>

<template>
  <n-modal v-model:show="loginPromptVisible" :mask-closable="true">
    <div class="bg-neutral-900 border border-neutral-800 rounded-xl p-8 flex flex-col items-center gap-6 w-80">
      <div class="flex flex-col items-center gap-2 text-center">
        <p class="text-white font-semibold text-lg">登入後即可使用翻譯</p>
        <p class="text-neutral-400 text-sm">Lexicon 使用 Google 帳號登入，安全且快速。</p>
      </div>
      <n-button type="primary" size="large" @click="handleLogin">
        <template #icon>
          <n-icon><LogoGoogle /></n-icon>
        </template>
        使用 Google 登入
      </n-button>
    </div>
  </n-modal>
</template>
