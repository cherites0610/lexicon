<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { PersonCircleOutline } from '@vicons/ionicons5'

useHead({
  title: '用戶資料 — Lexicon',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
  ],
})
</script>

<template>
  <div class="min-h-screen bg-neutral-950 flex flex-col">
    <header class="px-6 py-4 flex items-center border-b border-neutral-800">
      <span class="text-white font-bold text-xl tracking-tight">Lexicon</span>
    </header>

    <main class="flex-1 flex flex-col items-center justify-center px-6 gap-8">
      <div class="flex flex-col items-center gap-4">
        <n-icon size="72" class="text-neutral-600">
          <PersonCircleOutline />
        </n-icon>
        <h2 class="text-white text-2xl font-semibold">用戶資料</h2>
        <p class="text-neutral-500 text-sm">帳號功能將於後續版本推出。</p>
      </div>
    </main>
  </div>
</template>
