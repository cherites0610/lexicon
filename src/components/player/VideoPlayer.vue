<script setup lang="ts">
import { watch, onMounted, onUnmounted } from 'vue'
import { LogoYoutube, PlayCircleOutline, PauseCircleOutline } from '@vicons/ionicons5'
import { useYouTubePlayer } from '../../composables/useYouTubePlayer'
import { usePlayerStore } from '../../stores/player'

const playerStore = usePlayerStore()
const { isReady, isPlaying, initPlayer, playPause, seekBy, toggleCaption } = useYouTubePlayer()

function recoverFocusFromIframe() {
  requestAnimationFrame(() => {
    if (document.activeElement instanceof HTMLIFrameElement) {
      document.activeElement.blur()
    }
  })
}

onMounted(() => {
  if (playerStore.videoId) {
    initPlayer('yt-player', playerStore.videoId)
  }
  window.addEventListener('blur', recoverFocusFromIframe)
})

onUnmounted(() => {
  window.removeEventListener('blur', recoverFocusFromIframe)
})

watch(
  () => playerStore.videoId,
  (videoId) => {
    if (videoId) initPlayer('yt-player', videoId)
  },
)

defineExpose({ playPause, seekBy, toggleCaption })
</script>

<template>
  <div class="w-full h-full bg-neutral-900 rounded-xl overflow-hidden relative group">
    <div id="yt-player" class="w-full h-full" />

    <div
      v-if="!playerStore.videoId && !isReady"
      class="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gray-500 pointer-events-none"
    >
      <n-icon size="56" color="#6b7280">
        <LogoYoutube />
      </n-icon>
      <span class="text-sm">貼上 YouTube 網址以載入影片</span>
    </div>

    <div
      v-if="isReady"
      class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
    >
      <button
        class="pointer-events-auto bg-black/50 rounded-full p-2 text-white hover:bg-black/70 transition-colors"
        @click="playPause"
      >
        <n-icon size="40">
          <PauseCircleOutline v-if="isPlaying" />
          <PlayCircleOutline v-else />
        </n-icon>
      </button>
    </div>
  </div>
</template>
