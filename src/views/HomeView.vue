<script setup lang="ts">
import { ref } from 'vue'
import { SettingsOutline } from '@vicons/ionicons5'
import VideoLoader from '../components/player/VideoLoader.vue'
import VideoPlayer from '../components/player/VideoPlayer.vue'
import TranslationInput from '../components/translation/TranslationInput.vue'
import TranslationResult from '../components/translation/TranslationResult.vue'
import ModelManager from '../components/models/ModelManager.vue'
import { useGlobalShortcuts } from '../composables/useGlobalShortcuts'

const videoPlayerRef = ref<InstanceType<typeof VideoPlayer> | null>(null)
const showSettings = ref(false)

const shortcuts = [
  { desc: '播放 / 暫停', keys: ['Alt', 'Space'] },
  { desc: '後退 5 秒', keys: ['Alt', 'A'] },
  { desc: '前進 5 秒', keys: ['Alt', 'D'] },
  { desc: '開啟 / 關閉字幕', keys: ['Alt', 'S'] },
  { desc: '翻譯', keys: ['Enter'] },
]

useGlobalShortcuts({
  onPlayPause: () => videoPlayerRef.value?.playPause(),
  onToggleCaption: () => videoPlayerRef.value?.toggleCaption(),
  onSeekBack: () => videoPlayerRef.value?.seekBy(-5),
  onSeekForward: () => videoPlayerRef.value?.seekBy(5),
})
</script>

<template>
  <div class="h-screen bg-neutral-950 flex flex-col overflow-hidden">
    <header class="bg-neutral-900 border-b border-neutral-800 px-4 py-2 flex items-center gap-3 shrink-0">
      <h1 class="text-white font-bold text-lg tracking-tight shrink-0">Lexicon</h1>
      <div class="flex-1" />
      <VideoLoader />
      <n-button quaternary @click="showSettings = true">
        <template #icon>
          <n-icon><SettingsOutline /></n-icon>
        </template>
        模型設定
      </n-button>
    </header>

    <main class="flex-1 p-3 overflow-hidden">
      <div class="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-3 h-full">
        <VideoPlayer ref="videoPlayerRef" class="h-full" />
        <div class="flex flex-col gap-3 min-h-0 overflow-y-auto">
          <TranslationInput />
          <TranslationResult />
          <div class="mt-auto pt-1 flex flex-col gap-1.5">
            <div v-for="shortcut in shortcuts" :key="shortcut.desc" class="flex items-center justify-between">
              <span class="text-xs text-neutral-500">{{ shortcut.desc }}</span>
              <div class="flex items-center gap-1">
                <kbd
                  v-for="key in shortcut.keys"
                  :key="key"
                  class="px-1.5 py-0.5 rounded text-xs font-mono bg-neutral-800 border border-neutral-700 text-neutral-400"
                >{{ key }}</kbd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <n-drawer v-model:show="showSettings" width="320" placement="right">
      <n-drawer-content title="模型設定" closable>
        <ModelManager />
      </n-drawer-content>
    </n-drawer>
  </div>
</template>
