<script setup lang="ts">
import { FlashOutline } from '@vicons/ionicons5'
import { quotaExceededVisible } from '../utils/promptState'
</script>

<template>
  <n-modal v-model:show="quotaExceededVisible" :mask-closable="true">
    <div class="bg-neutral-900 border border-neutral-800 rounded-xl p-8 flex flex-col items-center gap-6 w-80">
      <n-icon size="48" class="text-yellow-400">
        <FlashOutline />
      </n-icon>
      <div class="flex flex-col items-center gap-2 text-center">
        <p class="text-white font-semibold text-lg">翻譯額度已用完</p>
        <p class="text-neutral-400 text-sm">本月免費翻譯額度已達上限，升級 Pro 方案即可無限使用。</p>
      </div>
      <div class="flex gap-3">
        <n-button @click="quotaExceededVisible = false">稍後再說</n-button>
        <n-button type="primary">升級 Pro</n-button>
      </div>
    </div>
  </n-modal>
</template>
