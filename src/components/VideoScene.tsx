import { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'

interface VideoSceneProps {
  videoSrc: string
  onComplete: () => void
}

function VideoScene({ videoSrc, onComplete }: VideoSceneProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isEnded, setIsEnded] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // 视频淡入
    gsap.fromTo(containerRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.5 }
    )

    // 自动播放
    video.play().then(() => {
      setIsPlaying(true)
    }).catch((error) => {
      console.log('视频播放失败:', error)
      // 如果自动播放失败，显示播放按钮
    })

    // 监听视频结束
    video.addEventListener('ended', handleVideoEnd)

    return () => {
      video.removeEventListener('ended', handleVideoEnd)
    }
  }, [])

  const handleVideoEnd = () => {
    setIsPlaying(false)
    setIsEnded(true)

    // 视频淡出
    gsap.to(containerRef.current, {
      opacity: 0,
      scale: 0.9,
      duration: 0.5,
      ease: 'power2.out',
      onComplete: () => {
        onComplete()
      }
    })
  }

  const handlePlayClick = () => {
    const video = videoRef.current
    if (!video) return

    video.play().then(() => {
      setIsPlaying(true)
    })
  }

  return (
    <div className="video-scene">
      <div ref={containerRef} className="video-container">
        <video
          ref={videoRef}
          className="birthday-video"
          src={videoSrc}
          controls={!isPlaying}
          muted={isPlaying}
          loop={false}
          playsInline
        />
        
        {/* 播放按钮覆盖层 */}
        {!isPlaying && !isEnded && (
          <div className="play-overlay" onClick={handlePlayClick}>
            <div className="play-button">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            <p className="play-hint">点击播放</p>
          </div>
        )}

        {/* 加载提示 */}
        {!isPlaying && !isEnded && !videoRef.current?.readyState && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>加载中...</p>
          </div>
        )}
      </div>
      
      {/* 跳过按钮 */}
      {isPlaying && (
        <button className="skip-button" onClick={handleVideoEnd}>
          跳过
        </button>
      )}
    </div>
  )
}

export default VideoScene