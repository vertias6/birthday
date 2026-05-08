import { useCallback, useEffect, useRef, useState } from 'react'

const AUDIO_PATH = '/bgm.mp3' // 请将背景音乐文件放在 public 目录下

export function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  useEffect(() => {
    // 创建音频元素
    const audio = new Audio(AUDIO_PATH)
    audio.loop = true
    audio.volume = 0.3 // 设置默认音量
    audio.preload = 'auto'
    
    // 监听音频加载完成
    audio.addEventListener('loadeddata', () => {
      console.log('音频加载完成')
      setIsLoaded(true)
    })
    
    audio.addEventListener('error', (e) => {
      console.error('音频加载失败:', e)
      setIsLoaded(false)
    })
    
    audio.load()
    audioRef.current = audio

    // 添加全局点击事件来触发音频（绕过自动播放限制）
    const handleGlobalClick = () => {
      if (!hasInteracted) {
        setHasInteracted(true)
        console.log('用户首次交互，音频现在可以播放')
      }
    }

    document.addEventListener('click', handleGlobalClick, { once: true })

    return () => {
      audio.pause()
      audio.src = ''
      document.removeEventListener('click', handleGlobalClick)
    }
  }, [hasInteracted])

  const playAudio = useCallback(() => {
    if (!audioRef.current || !isLoaded || !hasInteracted) {
      console.log('音频未就绪:', { isLoaded, hasInteracted })
      return false
    }

    audioRef.current.play().then(() => {
      setIsPlaying(true)
      return true
    }).catch((error) => {
      console.error('播放失败:', error)
      setIsPlaying(false)
      return false
    })
    return false
  }, [isLoaded, hasInteracted])

  const pauseAudio = useCallback(() => {
    if (!audioRef.current) return
    audioRef.current.pause()
    setIsPlaying(false)
  }, [])

  const toggleAudio = useCallback(() => {
    if (isPlaying) {
      pauseAudio()
    } else {
      playAudio()
    }
  }, [isPlaying, playAudio, pauseAudio])

  const setAudioEnabled = useCallback((enabled: boolean) => {
    if (enabled) {
      playAudio()
    } else {
      pauseAudio()
    }
  }, [playAudio, pauseAudio])

  return { isPlaying, toggleAudio, setAudioEnabled, isLoaded }
}