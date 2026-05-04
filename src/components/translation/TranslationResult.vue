<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useTranslationStore } from '../../stores/translation'

const { result, error, isLoading } = storeToRefs(useTranslationStore())
</script>

<template>
  <div class="rounded-xl border border-neutral-700 bg-neutral-800/50 overflow-hidden min-h-32">
    <div v-if="isLoading" class="flex justify-center items-center py-10">
      <n-spin size="small" />
    </div>

    <n-alert v-else-if="error" type="error" :show-icon="false" class="m-3 rounded-lg">
      {{ error }}
    </n-alert>

    <template v-else-if="result">
      <div
        v-if="result.corrected"
        class="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border-b border-amber-500/20"
      >
        <span class="text-xs text-amber-400 shrink-0">拼字修正</span>
        <span class="text-xs text-neutral-400">→</span>
        <span class="text-xs text-amber-300 font-medium">{{ result.corrected }}</span>
      </div>

      <div class="p-4 flex flex-col gap-3">
        <div>
          <div class="text-neutral-200 font-medium">{{ result.english }}</div>
          <div class="text-xs text-neutral-500 mt-0.5 font-mono tracking-wide">{{ result.ipa }}</div>
        </div>

        <div class="border-t border-neutral-700/60" />

        <div>
          <div class="text-2xl text-white font-medium leading-snug">{{ result.chinese }}</div>
          <div class="text-sm text-neutral-400 mt-1 tracking-widest">{{ result.pinyin }}</div>
        </div>
      </div>
    </template>

    <div v-else class="flex items-center justify-center py-10">
      <p class="text-neutral-500 text-sm">翻譯結果將顯示在此</p>
    </div>
  </div>
</template>
