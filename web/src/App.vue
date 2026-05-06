<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { darkTheme } from 'naive-ui'
import { useAuthStore } from './stores/auth'
import LoginPromptModal from './components/LoginPromptModal.vue'
import QuotaExceededModal from './components/QuotaExceededModal.vue'

const authStore = useAuthStore()
onMounted(() => authStore.fetchUser())
</script>

<template>
  <n-config-provider :theme="darkTheme">
    <n-global-style />
    <n-message-provider>
      <RouterView />
      <LoginPromptModal />
      <QuotaExceededModal />
    </n-message-provider>
  </n-config-provider>
</template>
