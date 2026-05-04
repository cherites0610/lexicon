import { onMounted, onUnmounted } from 'vue'

export function useGlobalShortcuts(handlers: {
  onPlayPause: () => void
  onToggleCaption: () => void
  onSeekBack: () => void
  onSeekForward: () => void
}) {
  const handleKeydown = (event: KeyboardEvent) => {
    if (!event.altKey) return

    switch (event.code) {
      case 'Space':
        event.preventDefault()
        event.stopPropagation()
        handlers.onPlayPause()
        break
      case 'KeyS':
        event.preventDefault()
        event.stopPropagation()
        handlers.onToggleCaption()
        break
      case 'KeyA':
        event.preventDefault()
        event.stopPropagation()
        handlers.onSeekBack()
        break
      case 'KeyD':
        event.preventDefault()
        event.stopPropagation()
        handlers.onSeekForward()
        break
    }
  }

  onMounted(() => window.addEventListener('keydown', handleKeydown))
  onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
}
