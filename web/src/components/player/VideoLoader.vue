<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useMessage } from 'naive-ui'
import type { InputInst } from 'naive-ui'
import { usePlayerStore } from '../../stores/player'
import { extractVideoId } from '../../utils/youtube'

const playerStore = usePlayerStore()
const message = useMessage()
const urlInput = ref('')
const isExpanded = ref(false)
const inputRef = ref<InputInst | null>(null)

async function expand() {
  isExpanded.value = true
  await nextTick()
  inputRef.value?.focus()
}

function collapse() {
  isExpanded.value = false
  urlInput.value = ''
}

function handleLoad() {
  const videoId = extractVideoId(urlInput.value.trim())
  if (!videoId) {
    message.error('無效的 YouTube 網址，請確認格式正確')
    return
  }
  playerStore.loadVideo(videoId)
  collapse()
}
</script>

<template>
  <div class="flex items-center">
    <Transition name="url-input" mode="out-in">
      <div v-if="isExpanded" key="expanded" class="flex items-center gap-2 w-80">
        <n-input
          ref="inputRef"
          v-model:value="urlInput"
          placeholder="貼上 YouTube 網址..."
          size="small"
          class="flex-1"
          @keyup.enter="handleLoad"
          @keydown.esc="collapse"
        />
        <n-button size="small" type="primary" @click="handleLoad">載入</n-button>
        <n-button size="small" quaternary @click="collapse">取消</n-button>
      </div>
      <n-button v-else key="collapsed" size="small" @click="expand">
        載入影片
      </n-button>
    </Transition>
  </div>
</template>

<style scoped>
.url-input-enter-active,
.url-input-leave-active {
  transition: opacity 0.12s ease, transform 0.12s ease;
}
.url-input-enter-from {
  opacity: 0;
  transform: translateX(6px);
}
.url-input-leave-to {
  opacity: 0;
  transform: translateX(-6px);
}
</style>
