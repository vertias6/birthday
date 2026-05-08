import { useState, useEffect, useRef } from 'react'
import CardScene from './components/CardScene'
import RevealScene from './components/RevealScene'
import FinalScene from './components/FinalScene'
import CakeScene from './components/CakeScene'
import VideoScene from './components/VideoScene'
import SoundToggle from './components/SoundToggle'
import { createBalloons, createFallingParticles } from './effects/balloons'
import './components/styles.css'

type Scene = 'cake' | 'video' | 'card' | 'reveal' | 'final'

const VIDEO_PATH = '/birthday.mp4'

function App() {
  const [currentScene, setCurrentScene] = useState<Scene>('cake')
  const [isSoundEnabled, setIsSoundEnabled] = useState(false)
  const bgCanvasRef = useRef<HTMLCanvasElement>(null)

  const toggleAudio = () => {
    setIsSoundEnabled(!isSoundEnabled)
  }

  useEffect(() => {
    const canvas = bgCanvasRef.current
    if (!canvas) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener('resize', resize)
    createBalloons(canvas)
    createFallingParticles(canvas)

    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  const handleCardOpen = () => {
    setCurrentScene('reveal')
  }

  const handleRevealComplete = () => {
    setCurrentScene('final')
  }

  const handleBlowOut = () => {
    setCurrentScene('video')
  }

  const handleVideoComplete = () => {
    setCurrentScene('card')
  }

  return (
    <div className="app">
      {currentScene !== 'video' && (
        <canvas ref={bgCanvasRef} className="background-canvas" />
      )}
      
      <SoundToggle isEnabled={isSoundEnabled} onToggle={toggleAudio} />
      
      {currentScene === 'cake' && (
        <CakeScene onBlowOut={handleBlowOut} />
      )}
      
      {currentScene === 'video' && (
        <VideoScene videoSrc={VIDEO_PATH} onComplete={handleVideoComplete} />
      )}
      
      {currentScene === 'card' && (
        <CardScene onOpen={handleCardOpen} isSoundEnabled={isSoundEnabled} />
      )}
      
      {currentScene === 'reveal' && (
        <RevealScene onComplete={handleRevealComplete} isSoundEnabled={isSoundEnabled} />
      )}
      
      {currentScene === 'final' && (
        <FinalScene isSoundEnabled={isSoundEnabled} />
      )}
    </div>
  )
}

export default App