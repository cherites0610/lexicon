# CLAUDE.md — Lexicon

> **Lexicon** — 整合 YouTube 影片播放與即時翻譯的語言學習輔助平台。

本文件為 Claude Code 的專案導覽文件。在執行任何任務前，請先完整閱讀此文件，理解專案架構、技術決策與開發規範。

---

## 目錄

1. [專案概述](#專案概述)
2. [開發階段總覽](#開發階段總覽)
3. [技術棧](#技術棧)
4. [專案結構](#專案結構)
5. [各階段詳細規格](#各階段詳細規格)
6. [核心技術實作指引](#核心技術實作指引)
7. [資料模型](#資料模型)
8. [測試策略](#測試策略)
9. [待釐清事項](#待釐清事項)

---

## 專案概述

**Lexicon** 是一個整合 YouTube 影片播放與即時翻譯的語言學習輔助平台。使用者可以一邊觀看影片，一邊透過快捷鍵控制播放，並在翻譯輸入框中即時查詢生詞。

**核心使用場景**：使用者在觀看英文 YouTube 影片時，遇到不懂的單字，直接在翻譯框輸入查詢，不需要離開頁面或中斷輸入節奏，透過快捷鍵即可暫停影片。

---

## 開發階段總覽

| 階段 | 名稱 | 主要功能 | 技術重點 | 狀態 |
|------|------|----------|----------|------|
| 一 | MVP 核心功能 | 影片播放 + 即時翻譯 + 模型管理 | YouTube IFrame API、Gemini API、localStorage | 🔨 開發中 |
| 二 | 單字紀錄 | Session 追蹤 + 彙整面板 | 前端狀態管理、去重邏輯 | 📋 待開發 |
| 三 | 多語系 | i18n 介面 + 多向翻譯 | vue-i18n、動態 Prompt | 📋 待開發 |
| 四 | 後端整合 | 帳號系統 + 雲端單詞本 + 訂閱制 | NestJS、PostgreSQL、Google OAuth | ⏸️ 暫緩（上線後依反饋推進） |

> **目前開發範圍：階段一至三（純前端）。** 階段四的技術方向已確認，但暫不實作。

---

## 技術棧

### 階段一至三（純前端）

| 類別 | 技術選擇 | 說明 |
|------|----------|------|
| 框架 | **Vue 3** (Composition API) | 搭配 `<script setup>` 語法 |
| 包管理工具 | **pnpm** | |
| 建構工具 | **Vite** | 開發速度快，HMR 支援佳 |
| 樣式 | **Tailwind CSS** | 搭配 `@tailwindcss/vite` plugin |
| 狀態管理 | **Pinia** | Vue 3 官方推薦，比 Vuex 更簡潔 |
| 路由 | **Vue Router 4** | 階段一為單頁，後續可擴展 |
| 持久化 | **localStorage** | 模型設定、使用者偏好 |
| i18n | **vue-i18n v9** | 階段三引入 |
| 外部 API | YouTube IFrame Player API、Gemini REST API | |

### 階段四（後端，確認方向 — 暫不實作）

> 技術方向已確認，待階段三上線、收集用戶反饋後再啟動開發。
> **現階段不需要建立任何後端相關檔案或目錄。**

| 類別 | 確認選擇 | 說明 |
|------|----------|------|
| 架構 | **分離 repo**（前後端各自獨立） | 前端 repo 維持 Vite + Vue 3；後端另開新 repo |
| 後端框架 | **NestJS**（Node.js） | TypeScript 原生支援，架構清晰 |
| 資料庫 | **PostgreSQL + TypeORM** | 關聯式資料庫，適合訂閱與配額計量 |
| 認證 | **Google OAuth**（純第三方，無自建帳密） | 免除密碼管理複雜度；前端以 Google Sign-In button 實作 |
| 配額計量 | **Token 消耗量**（非請求次數） | 更精確反映實際 API 成本 |
| 部署 | 待定 | 上線前再確認 |

---

## 專案結構

### 階段一至三（純前端 Vite + Vue 3）

```
project-root/
├── CLAUDE.md                    # 本文件
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
│
├── public/
│   └── favicon.ico
│
└── src/
    ├── main.ts                  # 應用程式進入點
    ├── App.vue                  # 根元件，掛載路由視圖
    │
    ├── router/
    │   └── index.ts             # Vue Router 設定
    │
    ├── stores/                  # Pinia stores
    │   ├── player.ts            # YouTube 播放器狀態
    │   ├── translation.ts       # 翻譯相關狀態與邏輯
    │   ├── models.ts            # Gemini 模型 CRUD（持久化至 localStorage）
    │   └── session.ts           # 本次工作階段的單字紀錄（階段二）
    │
    ├── composables/             # 可複用邏輯（Composition API hooks）
    │   ├── useYouTubePlayer.ts  # YouTube IFrame API 封裝
    │   ├── useGlobalShortcuts.ts# 全域快捷鍵監聽（核心難點）
    │   └── useGeminiTranslate.ts# Gemini API 呼叫封裝
    │
    ├── components/
    │   ├── player/
    │   │   ├── VideoLoader.vue      # URL 輸入 + 嵌入按鈕
    │   │   └── VideoPlayer.vue      # IFrame 容器
    │   │
    │   ├── translation/
    │   │   ├── TranslationInput.vue # 翻譯輸入框（快捷鍵作用區域）
    │   │   └── TranslationResult.vue# 翻譯結果顯示
    │   │
    │   ├── models/
    │   │   ├── ModelManager.vue     # 模型列表 + 新增/編輯/刪除介面
    │   │   └── ModelForm.vue        # 新增 / 編輯模型的表單
    │   │
    │   └── session/                 # 階段二
    │       └── SessionPanel.vue     # 本次查詢紀錄彙整面板
    │
    ├── views/
    │   └── HomeView.vue             # 主頁面，組合所有模組
    │
    ├── locales/                     # 階段三
    │   ├── zh-TW.json
    │   ├── en.json
    │   └── ja.json
    │
    ├── types/
    │   └── index.ts                 # 共用 TypeScript 型別定義
    │
    └── utils/
        ├── localStorage.ts          # localStorage 讀寫輔助函式
        └── youtube.ts               # YouTube URL 解析（擷取 video ID）
```

---

## 各階段詳細規格

### 階段一：MVP 核心功能

#### 1-A. YouTube 影片嵌入與控制

**功能需求：**
- `VideoLoader.vue`：提供輸入框讓使用者貼入 YouTube 網址（支援 `watch?v=`、`youtu.be/`、`embed/` 等格式），點擊「播放」後載入影片。
- `VideoPlayer.vue`：使用 YouTube IFrame Player API 渲染播放器，並透過 `useYouTubePlayer` composable 暴露控制方法。

**快捷鍵規格：**

| 快捷鍵 | 功能 | 備註 |
|--------|------|------|
| `Ctrl + Space` | 暫停 / 播放切換 | 需在翻譯輸入框聚焦時仍有效 |
| `Ctrl + S` | 開啟 / 關閉 CC 字幕 | 需攔截並阻止瀏覽器預設的「儲存」行為 |

> ⚠️ `Ctrl + S` 會觸發瀏覽器「儲存網頁」。必須在事件處理中呼叫 `event.preventDefault()`。
> 詳見[核心技術實作指引 — 全域快捷鍵](#全域快捷鍵監聽)。

#### 1-B. 即時翻譯與模型管理

**翻譯流程：**
1. 使用者在 `TranslationInput.vue` 輸入文字後，按下 `Enter` 鍵或點擊翻譯按鈕觸發翻譯。
2. 呼叫 `useGeminiTranslate` composable，根據目前選取的模型（API Key + 模型名稱），向 Gemini REST API 發送請求。
3. 階段一 Prompt 固定為：`英文翻中文`，階段三改為動態語言選擇。
4. 翻譯結果顯示在 `TranslationResult.vue`。

**Gemini API 呼叫規格：**
```
POST https://generativelanguage.googleapis.com/v1beta/models/{modelName}:generateContent?key={apiKey}
```

**模型管理（CRUD）：**

模型資料儲存於 `localStorage`，key 為 `lexicon:models`。

每筆模型資料結構詳見[資料模型 — GeminiModel](#資料模型)。

`ModelManager.vue` 應提供：
- 模型清單（含目前選取狀態的視覺標示）
- 每筆模型旁有「編輯」與「刪除」按鈕
- 「新增模型」按鈕開啟 `ModelForm.vue`（可為 Modal 或 Drawer 形式）
- 切換目前使用中的模型

---

### 階段二：單字紀錄與彙整

**Session 定義：** 本次瀏覽器頁面的存活週期（不持久化，關閉分頁即清除）。

**去重邏輯：**
- 以小寫後的查詢詞（`query.toLowerCase().trim()`）作為唯一 key。
- 若同一詞被查詢多次，更新其 `count`（查詢次數）與 `lastQueriedAt` 時間戳，不新增重複項目。

**`SessionPanel.vue` 展示需求：**
- 條列顯示：查詢詞、翻譯結果、查詢次數（次數 > 1 時顯示）
- 支援手動從清單中移除單筆紀錄
- 提供「清除全部」按鈕

---

### 階段三：多語系支持

**介面 i18n：**
- 使用 `vue-i18n v9`，預設語言繁體中文（`zh-TW`）
- 提供語言切換選單，支援：繁體中文、English、日本語
- 所有 UI 文字（按鈕、標籤、提示訊息、錯誤訊息）須全部通過 i18n key 管理，禁止硬編碼中文字串於元件內

**多向翻譯：**
- 在翻譯區塊新增「來源語言」與「目標語言」下拉選單
- 下拉選單選項至少包含：自動偵測、繁體中文、English、日本語、法文、韓文
- Prompt 範本：
  ```
  Please translate the following text from {sourceLang} to {targetLang}.
  Only output the translated result, no explanation.

  Text: {inputText}
  ```
- 「來源語言」選「自動偵測」時，Prompt 調整為 `Detect the language and translate to {targetLang}.`

---

### 階段四：後端整合（⏸️ 暫緩）

> 此階段**暫不開發**，待階段三上線並收集用戶反饋後再啟動。
> 以下為**已確認的功能需求與技術方向**，供未來開發參考。

#### 架構概覽

```
前端 repo（Vue 3 + Vite）  ←→  後端 repo（NestJS）  ←→  PostgreSQL
                                      ↕
                              Google OAuth 2.0
                                      ↕
                           Gemini API（後端代理）
```

#### 帳號系統

- 採用 **Google OAuth** 純第三方登入，不實作 Email / Password 帳密系統
- 前端使用 Google Sign-In JavaScript SDK 顯示登入按鈕
- 後端驗證 Google ID Token，簽發自有 JWT（Access Token + Refresh Token）
- 所有個人資料 API 需驗證 JWT，未登入者回傳 `401 Unauthorized`

#### 個人單詞本

- 升級階段二的 Session 紀錄為雲端持久化
- 使用者可將 session 中的查詢項目「加入單詞本」，資料儲存於後端 PostgreSQL
- 支援：新增、刪除、編輯備註、分類標籤、跨裝置同步
- 資料模型詳見[資料模型 — VocabularyEntry](#vocabularyentry階段四)

#### 訂閱制與配額管理

- 後端代理所有 Gemini API 請求（平台自有 API Key 不暴露至前端）
- 配額單位：**Token 消耗量**（呼叫 Gemini API 後從 response 的 `usageMetadata` 欄位取得）
- 使用者若自行設定個人 API Key（延續階段一機制），則繞過平台代理，直接由前端呼叫，不計入平台配額

訂閱方案（初步規劃，上線前可調整）：

| 方案 | 每月 Token 配額 | 功能 |
|------|----------------|------|
| 免費版 | 待定 | 基本翻譯功能 |
| Pro 版 | 無限制（或高上限） | 全功能 + 雲端單詞本 |

#### NestJS 模組規劃（供未來開發參考）

```
backend/
├── src/
│   ├── auth/          # Google OAuth、JWT 簽發與驗證
│   ├── users/         # 使用者帳號管理
│   ├── vocabulary/    # 個人單詞本 CRUD API
│   ├── translate/     # Gemini API 代理 + Token 計量
│   └── subscription/  # 訂閱方案與配額管理
```

---

## 核心技術實作指引

### 全域快捷鍵監聽

這是本專案的**最高難度技術點**。問題在於：當使用者的游標焦點在翻譯輸入框（`<input>` 或 `<textarea>`）內時，按下 `Ctrl + Space` 或 `Ctrl + S`，預設行為（輸入空格 / 儲存網頁）會干擾或覆蓋我們想要的行為。

**實作方案（`useGlobalShortcuts.ts`）：**

```typescript
// 在 window 層級監聽，而非在輸入框元素上
// 這樣即使焦點在輸入框內，事件仍然會冒泡到 window

export function useGlobalShortcuts(handlers: {
  onPlayPause: () => void
  onToggleCaption: () => void
}) {
  const handleKeydown = (event: KeyboardEvent) => {
    const isCtrlSpace = event.ctrlKey && event.code === 'Space'
    const isCtrlS = event.ctrlKey && event.code === 'KeyS'

    if (isCtrlSpace) {
      event.preventDefault() // 阻止在輸入框內輸入空格
      event.stopPropagation()
      handlers.onPlayPause()
      return
    }

    if (isCtrlS) {
      event.preventDefault() // 阻止瀏覽器「另存新檔」對話框
      event.stopPropagation()
      handlers.onToggleCaption()
      return
    }
  }

  onMounted(() => window.addEventListener('keydown', handleKeydown))
  onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
}
```

**注意事項：**
- 監聽必須綁定在 `window` 上，不可綁在輸入框元件上。
- `Ctrl + S` **必須** 呼叫 `event.preventDefault()`，否則瀏覽器會跳出另存對話框。
- `Ctrl + Space` 在某些作業系統（尤其是 macOS 中文輸入法）可能與輸入法快捷鍵衝突。如遇問題，可改用 `Alt + Space`（需與使用者確認）。
- 在元件卸載時（`onUnmounted`）務必移除監聽，避免記憶體洩漏。

---

### YouTube IFrame Player API

**`useYouTubePlayer.ts` 封裝要點：**

1. 透過動態插入 `<script src="https://www.youtube.com/iframe_api">` 載入 API（需確保只載入一次）。
2. `window.onYouTubeIframeAPIReady` 是全域回呼，API 載入完成後會自動觸發，需在此建立 `YT.Player` 實例。
3. 播放器建立後，保存 `player` 實例至 `ref`，供快捷鍵控制使用。
4. 字幕切換透過 `player.loadModule('cc')` / `player.unloadModule('cc')` 實作（或透過 `player.setOption('cc', 'reload', 1)`，需測試 API 支援程度）。

**YouTube URL 解析（`utils/youtube.ts`）：**

需支援以下格式，統一擷取 `videoId`：
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- `https://www.youtube.com/watch?v=VIDEO_ID&t=120s`（含時間參數）

---

### localStorage 資料管理

統一使用 `utils/localStorage.ts` 封裝，避免 JSON 解析錯誤造成應用程式崩潰：

```typescript
// 所有 localStorage key 統一在此定義，避免散落各處
export const STORAGE_KEYS = {
  MODELS: 'lexicon:models',
  ACTIVE_MODEL_ID: 'lexicon:active-model-id',
  LANGUAGE_PREFERENCE: 'lexicon:lang',         // 階段三
  TRANSLATION_SETTINGS: 'lexicon:translation', // 階段三
} as const

export function getStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.warn(`[localStorage] 寫入失敗：${key}`, e)
  }
}
```

---

## 資料模型

### `GeminiModel`（階段一）

```typescript
interface GeminiModel {
  id: string            // 唯一識別碼，建議使用 crypto.randomUUID()
  name: string          // 使用者自訂的顯示名稱，例如「我的 Flash 模型」
  apiKey: string        // Gemini API Key
  modelName: string     // Gemini 模型識別碼，例如 "gemini-1.5-flash"
  createdAt: string     // ISO 8601 時間戳
}
```

**儲存格式**（`lexicon:models`）：`GeminiModel[]`（陣列）

**目前選取的模型 ID**（`lexicon:active-model-id`）：`string`

---

### `SessionEntry`（階段二）

```typescript
interface SessionEntry {
  id: string            // crypto.randomUUID()
  query: string         // 使用者輸入的原文（保留原始大小寫）
  queryKey: string      // 去重用 key：query.toLowerCase().trim()
  translation: string   // 翻譯結果
  sourceLang: string    // 來源語言（階段三後有意義，階段二可固定 "en"）
  targetLang: string    // 目標語言（階段二固定 "zh-TW"）
  count: number         // 查詢次數
  firstQueriedAt: string  // 首次查詢時間（ISO 8601）
  lastQueriedAt: string   // 最後查詢時間（ISO 8601）
}
```

**儲存位置**：Pinia store（`session.ts`），**不持久化至 localStorage**，頁面重整後清除。

---

### `VocabularyEntry`（階段四）

```typescript
interface VocabularyEntry {
  id: string
  userId: string          // 對應 PostgreSQL users 表的外鍵
  query: string
  translation: string
  sourceLang: string
  targetLang: string
  tags: string[]          // 分類標籤
  note: string            // 使用者自訂備註
  createdAt: string
  updatedAt: string
}
```

> ⚠️ 此型別**目前不需要實作**，僅供未來階段四開發參考。TypeORM Entity 定義屆時另行補充。

---

## 測試策略

### 階段一至三（單元測試）

使用 **Vitest** + **Vue Test Utils**：

| 測試目標 | 重點 |
|----------|------|
| `useGlobalShortcuts` | 確認在輸入框聚焦時快捷鍵仍觸發；確認 `preventDefault` 被呼叫 |
| `useGeminiTranslate` | Mock fetch，確認 Prompt 組裝正確（含多語系 Prompt 範本）；測試 API 錯誤處理 |
| `utils/youtube.ts` | 覆蓋所有 URL 格式的解析結果 |
| `utils/localStorage.ts` | 測試 JSON 解析失敗時回傳 fallback 值 |
| Pinia `models` store | 測試 CRUD 操作後 localStorage 狀態正確 |
| Pinia `session` store | 測試去重邏輯（count 遞增、不新增重複項目） |

### 階段四（待啟動時補充）

後端 NestJS 採用 Jest（NestJS 預設）做單元與整合測試；前後端 E2E 測試建議使用 Playwright，待開發時再詳細規劃。

---

## 待釐清事項

> 所有主要架構問題已確認。以下僅剩需要**實際測試後**才能決定的快捷鍵問題。

| 編號 | 問題 | 影響範圍 | 處理方式 |
|------|------|----------|----------|
| Q4 | `Ctrl + Space` 是否與中文輸入法快捷鍵衝突？（尤其 macOS） | 快捷鍵方案 | 實測後若有衝突，改用 `Alt + Space` |
| Q5 | `Ctrl + S` 在部分瀏覽器 / OS 組合中，`preventDefault` 是否能完全阻止「儲存網頁」對話框？ | 快捷鍵方案 | 實測後若阻止失敗，改用 `Alt + C` |

> **其餘已確認事項摘要：**
> - 後端：NestJS（分離 repo） + PostgreSQL + TypeORM
> - 認證：純 Google OAuth（無自建帳密）
> - 配額計量：Token 消耗量（取自 Gemini response `usageMetadata`）
> - 翻譯結果顯示：只顯示翻譯文字，不顯示偵測到的來源語言
> - 階段四：暫緩，上線後依反饋推進
