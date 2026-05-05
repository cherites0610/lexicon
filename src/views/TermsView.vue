<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { useRouter } from 'vue-router'

useHead({
  title: '服務條款 — Lexicon',
  meta: [
    { name: 'description', content: 'Lexicon 服務條款，說明使用本服務的規範、API 金鑰責任與第三方服務條款。' },
    { property: 'og:title', content: '服務條款 — Lexicon' },
    { property: 'og:url', content: 'https://lexicon.cherites.org/terms' },
  ],
  link: [{ rel: 'canonical', href: 'https://lexicon.cherites.org/terms' }],
})

const router = useRouter()
</script>

<template>
  <div class="min-h-screen bg-neutral-950 flex flex-col">
    <header class="px-6 py-4 border-b border-neutral-800">
      <button class="text-white font-bold text-xl tracking-tight hover:text-blue-400 transition-colors"
        @click="router.push({ name: 'home' })">
        Lexicon
      </button>
    </header>

    <main class="flex-1 px-6 py-12">
      <div class="max-w-2xl mx-auto flex flex-col gap-8">
        <div class="flex flex-col gap-2">
          <h1 class="text-3xl font-bold text-white">服務條款</h1>
          <p class="text-neutral-500 text-sm">最後更新：2026 年 5 月 5 日</p>
        </div>

        <p class="text-neutral-400 leading-relaxed">
          歡迎使用 Lexicon（以下簡稱「本服務」）。使用本服務即表示您同意以下條款；若不同意，請停止使用。
        </p>

        <section class="flex flex-col gap-3">
          <h2 class="text-white font-semibold text-lg">1. 服務簡介</h2>
          <p class="text-neutral-400 leading-relaxed">
            Lexicon 是一個整合 YouTube 影片播放與 Google Gemini AI 即時翻譯的語言學習輔助平台，供個人學習目的免費使用。
          </p>
        </section>

        <section class="flex flex-col gap-3">
          <h2 class="text-white font-semibold text-lg">2. API 金鑰與費用責任</h2>
          <p class="text-neutral-400 leading-relaxed">
            目前版本採用「自備 API 金鑰」模式，您須自行提供有效的 Google Gemini API 金鑰以使用翻譯功能。
          </p>
          <ul class="flex flex-col gap-2 pl-4">
            <li class="text-neutral-400 leading-relaxed list-disc list-outside">
              您的 API 金鑰僅儲存於您瀏覽器的本機（localStorage），不會傳送至本服務的任何伺服器。
            </li>
            <li class="text-neutral-400 leading-relaxed list-disc list-outside">
              所有透過您的 API 金鑰產生的 Google Gemini API 費用，由您自行承擔。
            </li>
            <li class="text-neutral-400 leading-relaxed list-disc list-outside">
              請妥善保管您的 API 金鑰，切勿將其分享給他人。
            </li>
          </ul>
        </section>

        <section class="flex flex-col gap-3">
          <h2 class="text-white font-semibold text-lg">3. 第三方服務</h2>
          <p class="text-neutral-400 leading-relaxed">
            本服務整合以下第三方服務，使用時亦受其各自條款約束：
          </p>
          <ul class="flex flex-col gap-2 pl-4">
            <li class="text-neutral-400 leading-relaxed list-disc list-outside">
              <span class="text-neutral-300">YouTube / Google</span>：影片播放功能透過 YouTube IFrame Player API 實現，受
              Google 服務條款及 YouTube 服務條款規範。
            </li>
            <li class="text-neutral-400 leading-relaxed list-disc list-outside">
              <span class="text-neutral-300">Google Gemini API</span>：翻譯功能透過 Google Gemini API 實現，受 Google
              API 服務條款規範。
            </li>
          </ul>
        </section>

        <section class="flex flex-col gap-3">
          <h2 class="text-white font-semibold text-lg">4. 禁止行為</h2>
          <p class="text-neutral-400 leading-relaxed">您同意不得將本服務用於：</p>
          <ul class="flex flex-col gap-2 pl-4">
            <li class="text-neutral-400 leading-relaxed list-disc list-outside">翻譯或傳播任何非法、歧視性或侵害他人權益之內容</li>
            <li class="text-neutral-400 leading-relaxed list-disc list-outside">干擾、破壞或試圖取得未授權存取本服務</li>
            <li class="text-neutral-400 leading-relaxed list-disc list-outside">任何違反適用法律法規之用途</li>
          </ul>
        </section>

        <section class="flex flex-col gap-3">
          <h2 class="text-white font-semibold text-lg">5. 免責聲明</h2>
          <p class="text-neutral-400 leading-relaxed">
            本服務依「現狀」提供，不提供任何明示或默示之擔保。本平台不保證服務不中斷、無錯誤，亦不保證 AI
            翻譯結果之準確性。在法律允許的最大範圍內，本平台對因使用本服務所造成的任何損害不承擔責任。
          </p>
        </section>

        <section class="flex flex-col gap-3">
          <h2 class="text-white font-semibold text-lg">6. 服務變更與終止</h2>
          <p class="text-neutral-400 leading-relaxed">
            本平台保留隨時修改、暫停或終止本服務之權利，恕不另行通知。
          </p>
        </section>

        <section class="flex flex-col gap-3">
          <h2 class="text-white font-semibold text-lg">7. 條款修訂</h2>
          <p class="text-neutral-400 leading-relaxed">
            本條款得隨時更新，頁面頂端將顯示最新修訂日期。繼續使用本服務即視為接受修訂後的條款。
          </p>
        </section>

        <section class="flex flex-col gap-3">
          <h2 class="text-white font-semibold text-lg">8. 準據法</h2>
          <p class="text-neutral-400 leading-relaxed">
            本條款依中華民國（台灣）法律解釋並受其管轄。
          </p>
        </section>

        <section class="flex flex-col gap-3">
          <h2 class="text-white font-semibold text-lg">9. 聯絡我們</h2>
          <p class="text-neutral-400 leading-relaxed">
            如對本服務條款有任何疑問，請來信：
            <a href="mailto:cherites0610@gmail.com"
              class="text-blue-400 hover:text-blue-300 transition-colors">cherites0610@gmail.com</a>
          </p>
        </section>
      </div>
    </main>

    <footer class="border-t border-neutral-800 px-6 py-6">
      <div class="max-w-2xl mx-auto flex items-center justify-between flex-wrap gap-3">
        <span class="text-neutral-600 text-sm">© 2026 Lexicon</span>
        <div class="flex gap-4">
          <router-link to="/terms" class="text-neutral-500 hover:text-neutral-300 text-sm transition-colors">服務條款</router-link>
          <router-link to="/privacy" class="text-neutral-500 hover:text-neutral-300 text-sm transition-colors">隱私權政策</router-link>
        </div>
      </div>
    </footer>
  </div>
</template>
