import { useCallback, useEffect, useRef, useState } from 'react'

const AUDIO_PATH = '/bgm.mp3'

export function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  useEffect(() => {
    const audio = new Audio(AUDIO_PATH)
    audio.loop = true
    audio.volume = 0.3
    audioRef.current = audio

    const handleInteraction = () => {
      setHasInteracted(true)
    }

    document.addEventListener('click', handleInteraction, { once: true })

    return () => {
      audio.pause()
      document.removeEventListener('click', handleInteraction)
    }
  }, [])

  const playAudio = useCallback(() => {
    if (!audioRef.current || !hasInteracted) return

    audioRef.current.play().then(() => {
      setIsPlaying(true)
    }).catch(err => console.log('播放失败', err))
  }, [hasInteracted])

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

  return { isPlaying, toggleAudio, setAudioEnabled }
}