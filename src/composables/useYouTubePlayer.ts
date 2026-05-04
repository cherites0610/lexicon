import { ref, onUnmounted } from 'vue'

let apiReady = false
let apiLoading = false
const pendingCallbacks: (() => void)[] = []

function ensureApiLoaded(): Promise<void> {
  return new Promise((resolve) => {
    if (apiReady) {
      resolve()
      return
    }

    pendingCallbacks.push(resolve)

    if (!apiLoading) {
      apiLoading = true

      window.onYouTubeIframeAPIReady = () => {
        apiReady = true
        pendingCallbacks.splice(0).forEach((cb) => cb())
      }

      const script = document.createElement('script')
      script.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(script)
    }
  })
}

export function useYouTubePlayer() {
  const player = ref<YT.Player | null>(null)
  const isReady = ref(false)
  const isPlaying = ref(false)
  const captionEnabled = ref(false)

  async function initPlayer(containerId: string, videoId: string): Promise<void> {
    await ensureApiLoaded()

    if (player.value) {
      player.value.destroy()
      player.value = null
      isReady.value = false
      isPlaying.value = false
      captionEnabled.value = false
    }

    player.value = new YT.Player(containerId, {
      videoId,
      playerVars: { autoplay: 1, rel: 0 },
      events: {
        onReady: () => {
          isReady.value = true
        },
        onStateChange: (event) => {
          isPlaying.value = event.data === 1
        },
      },
    })
  }

  function playPause(): void {
    if (!player.value || !isReady.value) return
    if (player.value.getPlayerState() === 1) {
      player.value.pauseVideo()
    } else {
      player.value.playVideo()
    }
  }

  function seekBy(seconds: number): void {
    if (!player.value || !isReady.value) return
    player.value.seekTo(player.value.getCurrentTime() + seconds, true)
  }

  function toggleCaption(): void {
    if (!player.value || !isReady.value) return
    if (captionEnabled.value) {
      player.value.unloadModule('cc')
    } else {
      player.value.loadModule('cc')
    }
    captionEnabled.value = !captionEnabled.value
  }

  onUnmounted(() => {
    player.value?.destroy()
    player.value = null
  })

  return { isReady, isPlaying, captionEnabled, initPlayer, playPause, seekBy, toggleCaption }
}
