<script setup lang="ts">
import { useHead } from '@unhead/vue'
import AppHeader from '../components/AppHeader.vue'

useHead({
  title: '隱私權政策 — Lexicon',
  meta: [
    { name: 'description', content: 'Lexicon 隱私權政策，說明我們如何處理您的資料、API 金鑰的本機儲存方式，以及第三方服務的資料使用。' },
    { property: 'og:title', content: '隱私權政策 — Lexicon' },
    { property: 'og:url', content: 'https://lexicon.cherites.org/privacy' },
  ],
  link: [{ rel: 'canonical', href: 'https://lexicon.cherites.org/privacy' }],
})
</script>

<template>
  <div class="min-h-screen bg-neutral-950 flex flex-col">
    <AppHeader class="px-6 py-4 border-b border-neutral-800" />

    <main class="flex-1 px-6 py-12">
      <div class="max-w-2xl mx-auto flex flex-col gap-8">
        <div class="flex flex-col gap-2">
          <h1 class="text-3xl font-bold text-white">隱私權政策</h1>
          <p class="text-neutral-500 text-sm">最後更新：2026 年 5 月 5 日</p>
        </div>

        <p class="text-neutral-400 leading-relaxed">
          本政策說明 Lexicon（以下簡稱「本服務」）如何處理您的資料。我們重視您的隱私，以下說明本服務的資料使用方式。
        </p>

        <section class="flex flex-col gap-3">
          <h2 class="text-white font-semibold text-lg">1. 資料控制者</h2>
          <p class="text-neutral-400 leading-relaxed">
            Lexicon，聯絡信箱：<a href="mailto:cherites0610@gmail.com"
              class="text-blue-400 hover:text-blue-300 transition-colors">cherites0610@gmail.com</a>
          </p>
        </section>

        <section class="flex flex-col gap-3">
          <h2 class="text-white font-semibold text-lg">2. 我們收集哪些資料</h2>

          <h3 class="text-neutral-300 font-medium">您主動提供（僅儲存於本機）</h3>
          <p class="text-neutral-400 leading-relaxed">
            您在模型管理功能中輸入的 Gemini API 金鑰與模型設定，以 JSON 格式儲存於您瀏覽器的
            localStorage。這些資料完全留存於您的裝置，<span class="text-neutral-300">不會傳送至本服務的任何伺服器</span>。
          </p>

          <h3 class="text-neutral-300 font-medium">透過服務自動傳送的資料</h3>
          <p class="text-neutral-400 leading-relaxed">
            您在翻譯框中輸入的文字，會透過您提供的 API 金鑰，直接從您的瀏覽器傳送至 Google Gemini
            API。本服務不儲存、不記錄您的任何查詢內容。
          </p>

          <h3 class="text-neutral-300 font-medium">我們不收集的資料</h3>
          <ul class="flex flex-col gap-2 pl-4">
            <li class="text-neutral-400 leading-relaxed list-disc list-outside">本服務不設置任何行為分析或追蹤工具（如 Google Analytics）</li>
            <li class="text-neutral-400 leading-relaxed list-disc list-outside">本服務不設置任何第一方 Cookie</li>
            <li class="text-neutral-400 leading-relaxed list-disc list-outside">本服務不收集您的個人識別資訊（姓名、電子郵件等）</li>
          </ul>
        </section>

        <section class="flex flex-col gap-3">
          <h2 class="text-white font-semibold text-lg">3. 第三方服務</h2>
          <p class="text-neutral-400 leading-relaxed">
            本服務整合以下第三方服務，其資料處理行為受各自的隱私權政策規範，本服務無法控制：
          </p>
          <ul class="flex flex-col gap-3 pl-4">
            <li class="text-neutral-400 leading-relaxed list-disc list-outside">
              <span class="text-neutral-300">YouTube（Google）</span>：影片播放透過 YouTube IFrame Player API
              實現。Google 可能依其隱私權政策收集相關資料（如 IP 位址、觀看記錄等）。
            </li>
            <li class="text-neutral-400 leading-relaxed list-disc list-outside">
              <span class="text-neutral-300">Google Gemini API</span>：翻譯查詢透過 Google Gemini API
              處理，使用您自行提供的 API 金鑰。您的翻譯內容將傳送至 Google 並受
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer"
                class="text-blue-400 hover:text-blue-300 transition-colors">Google 隱私權政策</a>規範。
            </li>
          </ul>
        </section>

        <section class="flex flex-col gap-3">
          <h2 class="text-white font-semibold text-lg">4. 資料儲存與保留</h2>
          <p class="text-neutral-400 leading-relaxed">
            您的設定資料（API 金鑰、模型設定）僅儲存於您裝置的瀏覽器 localStorage，無保留期限，直到您主動清除為止。您可隨時透過瀏覽器的「清除網站資料」功能，刪除所有本服務儲存的本機資料。
          </p>
        </section>

        <section class="flex flex-col gap-3">
          <h2 class="text-white font-semibold text-lg">5. 未成年人保護</h2>
          <p class="text-neutral-400 leading-relaxed">
            本服務不針對 13 歲以下之兒童。若您為未成年人，請在監護人陪同下使用本服務。
          </p>
        </section>

        <section class="flex flex-col gap-3">
          <h2 class="text-white font-semibold text-lg">6. 您的資料權利</h2>
          <p class="text-neutral-400 leading-relaxed">
            由於本服務目前不設有後端伺服器，所有資料均儲存於您的本機裝置，您可隨時：
          </p>
          <ul class="flex flex-col gap-2 pl-4">
            <li class="text-neutral-400 leading-relaxed list-disc list-outside">透過清除瀏覽器 localStorage 刪除所有本機儲存的資料</li>
            <li class="text-neutral-400 leading-relaxed list-disc list-outside">停止使用本服務</li>
          </ul>
        </section>

        <section class="flex flex-col gap-3">
          <h2 class="text-white font-semibold text-lg">7. 政策變更</h2>
          <p class="text-neutral-400 leading-relaxed">
            本政策得隨時更新，頁面頂端將顯示最新修訂日期。建議定期查閱本頁面。
          </p>
        </section>

        <section class="flex flex-col gap-3">
          <h2 class="text-white font-semibold text-lg">8. 聯絡我們</h2>
          <p class="text-neutral-400 leading-relaxed">
            如對本隱私權政策有任何疑問，請來信：
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
