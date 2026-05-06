<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useHead } from '@unhead/vue'
import { PlayCircleOutline, BookOutline, FlashOutline } from '@vicons/ionicons5'
import AppHeader from '../components/AppHeader.vue'

const router = useRouter()

useHead({
  title: 'Lexicon — YouTube 影片即時翻譯學習平台',
  meta: [
    { name: 'description', content: 'Lexicon 整合 YouTube 影片播放與即時翻譯，讓你一邊看影片一邊查詢生詞，透過快捷鍵無縫控制播放，輕鬆提升英文能力。' },
    { property: 'og:title', content: 'Lexicon — YouTube 影片即時翻譯學習平台' },
    { property: 'og:description', content: '整合 YouTube 影片播放與即時翻譯，透過快捷鍵無縫控制播放，一邊看影片一邊查詢生詞。' },
    { property: 'og:url', content: 'https://lexicon.cherites.org/' },
    { name: 'twitter:title', content: 'Lexicon — YouTube 影片即時翻譯學習平台' },
    { name: 'twitter:description', content: '整合 YouTube 影片播放與即時翻譯，透過快捷鍵無縫控制播放，一邊看影片一邊查詢生詞。' },
  ],
  link: [{ rel: 'canonical', href: 'https://lexicon.cherites.org/' }],
})

function startTranslating() {
  router.push({ name: 'translate' })
}
</script>

<template>
  <div class="min-h-screen bg-neutral-950 flex flex-col relative overflow-hidden">

    <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div class="glow-orb glow-orb--blue" />
      <div class="glow-orb glow-orb--indigo" />
      <div class="dot-grid" />
    </div>

    <AppHeader class="relative px-6 py-4" />

    <main class="relative flex-1 flex flex-col items-center justify-center px-6 text-center gap-12 pb-24">
      <div class="flex flex-col items-center gap-6 max-w-2xl">
        <h1 class="text-5xl font-bold text-white leading-tight">
          邊看影片，<br />
          <span class="text-blue-400">邊學語言</span>
        </h1>
        <p class="text-neutral-400 text-lg leading-relaxed max-w-xl">
          Lexicon 整合 YouTube 播放與 AI 即時翻譯，讓你在沉浸式觀看中查詢生詞，不中斷學習節奏。
        </p>
        <n-button type="primary" size="large" @click="startTranslating" class="mt-2">
          <template #icon>
            <n-icon>
              <PlayCircleOutline />
            </n-icon>
          </template>
          開始翻譯
        </n-button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl w-full">
        <div class="bg-neutral-900 rounded-xl p-6 flex flex-col items-center gap-3 border border-neutral-800">
          <n-icon size="32" class="text-blue-400">
            <PlayCircleOutline />
          </n-icon>
          <h3 class="text-white font-semibold">YouTube 同步播放</h3>
          <p class="text-neutral-500 text-sm text-center">貼上影片連結即可嵌入播放，快捷鍵操控不離手。</p>
        </div>
        <div class="bg-neutral-900 rounded-xl p-6 flex flex-col items-center gap-3 border border-neutral-800">
          <n-icon size="32" class="text-blue-400">
            <FlashOutline />
          </n-icon>
          <h3 class="text-white font-semibold">AI 即時翻譯</h3>
          <p class="text-neutral-500 text-sm text-center">由 Gemini 驅動，輸入生詞即刻得到精準翻譯結果。</p>
        </div>
        <div class="bg-neutral-900 rounded-xl p-6 flex flex-col items-center gap-3 border border-neutral-800">
          <n-icon size="32" class="text-blue-400">
            <BookOutline />
          </n-icon>
          <h3 class="text-white font-semibold">查詢紀錄彙整</h3>
          <p class="text-neutral-500 text-sm text-center">自動累積本次查詢紀錄，方便課後複習。</p>
        </div>
      </div>
    </main>

    <footer class="relative border-t border-neutral-800 px-6 py-6">
      <div class="max-w-3xl mx-auto flex items-center justify-between flex-wrap gap-3">
        <span class="text-neutral-600 text-sm">© 2026 Lexicon</span>
        <div class="flex gap-4">
          <router-link to="/terms" class="text-neutral-500 hover:text-neutral-300 text-sm transition-colors">服務條款</router-link>
          <router-link to="/privacy" class="text-neutral-500 hover:text-neutral-300 text-sm transition-colors">隱私權政策</router-link>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
@keyframes breathe {
  0%, 100% { opacity: 0.07; transform: translate(-50%, -50%) scale(1); }
  50%       { opacity: 0.12; transform: translate(-50%, -50%) scale(1.15); }
}

@keyframes drift {
  0%, 100% { opacity: 0.05; transform: translate(-50%, -50%) scale(1); }
  40%       { opacity: 0.08; transform: translate(-46%, -54%) scale(1.1); }
  70%       { opacity: 0.06; transform: translate(-54%, -46%) scale(0.95); }
}

.glow-orb {
  position: absolute;
  border-radius: 9999px;
  filter: blur(100px);
  will-change: transform, opacity;
}

.glow-orb--blue {
  width: 640px;
  height: 640px;
  top: 40%;
  left: 50%;
  background: radial-gradient(circle, #3b82f6, transparent 70%);
  animation: breathe 8s ease-in-out infinite;
}

.glow-orb--indigo {
  width: 480px;
  height: 480px;
  top: 30%;
  left: 60%;
  background: radial-gradient(circle, #6366f1, transparent 70%);
  animation: drift 12s ease-in-out infinite;
}

.dot-grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, #ffffff18 1px, transparent 1px);
  background-size: 32px 32px;
  mask-image: radial-gradient(ellipse 80% 80% at 50% 40%, black 30%, transparent 100%);
}
</style>
