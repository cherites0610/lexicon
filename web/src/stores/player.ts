import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePlayerStore = defineStore('player', () => {
  const videoId = ref<string | null>(null)

  function loadVideo(id: string) {
    videoId.value = id
  }

  return { videoId, loadVideo }
})
