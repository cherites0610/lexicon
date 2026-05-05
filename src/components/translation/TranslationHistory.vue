<template>
  <div class="rounded-xl border border-neutral-700 bg-neutral-800/50 overflow-hidden min-h-32">
    <div v-if="historyList.length > 0" class="divide-y divide-neutral-700/50">
      <div v-for="[key, item] in historyList" :key="key" class="p-4 hover:bg-neutral-700/30 transition-colors">
        <div class="flex justify-between items-start gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-baseline gap-2">
              <span class="text-neutral-200 font-medium truncate">{{ item.english }}</span>
              <span class="text-[10px] text-neutral-500 font-mono">{{ item.ipa }}</span>
            </div>
            <div class="mt-1">
              <span class="text-lg text-white font-medium">{{ item.chinese }}</span>
              <span class="ml-2 text-xs text-neutral-400 tracking-wider">{{ item.pinyin }}</span>
            </div>
          </div>

          <div v-if="item.corrected" class="shrink-0">
            <div class="px-1.5 py-0.5 rounded border border-amber-500/30 bg-amber-500/5">
              <span class="text-[10px] text-amber-400/80">已修正</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="flex items-center justify-center py-10">
      <p class="text-neutral-500 text-sm">目前沒有翻譯歷史</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTranslationStore } from '../../stores/translation';
import { storeToRefs } from 'pinia';

const { translationHistory } = storeToRefs(useTranslationStore())

const historyList = computed(() => {
  return Array.from(translationHistory.value).reverse()
})
</script>
