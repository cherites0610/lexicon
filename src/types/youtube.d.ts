declare global {
  namespace YT {
    class Player {
      constructor(elementId: string | HTMLElement, options: PlayerOptions)
      playVideo(): void
      pauseVideo(): void
      getPlayerState(): number
      getCurrentTime(): number
      seekTo(seconds: number, allowSeekAhead: boolean): void
      loadModule(moduleName: string): void
      unloadModule(moduleName: string): void
      setOption(module: string, option: string, value: unknown): void
      destroy(): void
    }

    interface PlayerOptions {
      videoId?: string
      width?: number | string
      height?: number | string
      playerVars?: {
        autoplay?: 0 | 1
        cc_load_policy?: 0 | 1
        controls?: 0 | 1 | 2
        rel?: 0 | 1
      }
      events?: {
        onReady?: (event: { target: Player }) => void
        onStateChange?: (event: { data: number; target: Player }) => void
        onError?: (event: { data: number; target: Player }) => void
      }
    }
  }

  interface Window {
    onYouTubeIframeAPIReady: () => void
    YT: typeof YT
  }
}

export {}
