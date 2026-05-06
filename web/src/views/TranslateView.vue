<script setup lang="ts">
import { computed, ref } from 'vue'
import { useHead } from '@unhead/vue'
import VideoLoader from '../components/player/VideoLoader.vue'
import VideoPlayer from '../components/player/VideoPlayer.vue'
import TranslationInput from '../components/translation/TranslationInput.vue'
import TranslationResult from '../components/translation/TranslationResult.vue'
import { useGlobalShortcuts } from '../composables/useGlobalShortcuts'
import TranslationHistory from '../components/translation/TranslationHistory.vue'
import AppHeader from '../components/AppHeader.vue'

const videoPlayerRef = ref<InstanceType<typeof VideoPlayer> | null>(null)

const shortcutsData = [
  { desc: '播放 / 暫停', keys: ['Alt', 'S'] },
  { desc: '後退 5 秒', keys: ['Alt', 'A'] },
  { desc: '前進 5 秒', keys: ['Alt', 'D'] },
  { desc: '翻譯', keys: ['Enter'] },
]

const isMac = typeof window !== 'undefined' && /Mac|iPhone|iPod|iPad/.test(navigator.platform)

const shortcuts = computed(() => {
  return shortcutsData.map(shortcut => ({
    ...shortcut,
    keys: shortcut.keys.map(key => key === 'Alt' ? (isMac ? 'Option' : 'Alt') : key)
  }))
})

useHead({
  title: '翻譯 — Lexicon',
  meta: [
    { name: 'description', content: '使用 Lexicon 翻譯工具，一邊播放 YouTube 影片，一邊透過 AI 即時查詢生詞。' },
    { name: 'robots', content: 'noindex, nofollow' },
  ],
})

useGlobalShortcuts({
  onPlayPause: () => videoPlayerRef.value?.playPause(),
  onSeekBack: () => videoPlayerRef.value?.seekBy(-5),
  onSeekForward: () => videoPlayerRef.value?.seekBy(5),
})
</script>

<template>
  <div class="h-screen bg-neutral-950 flex flex-col overflow-hidden">
    <AppHeader class="bg-neutral-900 border-b border-neutral-800">
      <div class="flex items-center justify-end">
        <VideoLoader />
      </div>
    </AppHeader>

    <main class="flex-1 p-3 overflow-hidden">
      <div class="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-3 h-full">
        <VideoPlayer ref="videoPlayerRef" class="h-full" />
        <div class="flex flex-col gap-3 min-h-0 overflow-y-auto">
          <TranslationInput />
          <TranslationResult />
          <TranslationHistory />
          <div class="mt-auto pt-1 flex flex-col gap-1.5">
            <div v-for="shortcut in shortcuts" :key="shortcut.desc" class="flex items-center justify-between">
              <span class="text-xs text-neutral-500">{{ shortcut.desc }}</span>
              <div class="flex items-center gap-1">
                <kbd v-for="key in shortcut.keys" :key="key"
                  class="px-1.5 py-0.5 rounded text-xs font-mono bg-neutral-800 border border-neutral-700 text-neutral-400">{{
                    key }}</kbd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
