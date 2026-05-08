import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import WaxSeal from './WaxSeal'
import { createButterflies, createGoldParticles } from '../effects/particles'

interface CardSceneProps {
  onOpen: () => void
  isSoundEnabled?: boolean
}

function CardScene({ onOpen }: CardSceneProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const waxRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLCanvasElement>(null)
  const isAnimating = useRef(false)

  useEffect(() => {
    const card = cardRef.current
    if (card) {
      gsap.to(card, {
        y: -10,
        duration: 3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })
    }
  }, [])

  useEffect(() => {
    const canvas = particlesRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }
  }, [])

  const handleSealClick = () => {
    if (isAnimating.current) return
    isAnimating.current = true

    const tl = gsap.timeline()

    tl.to(waxRef.current, {
      scale: 1.2,
      duration: 0.2,
      ease: 'power2.out',
    })
    .to(waxRef.current, {
      scale: 0.8,
      rotation: 15,
      duration: 0.15,
    })
    .to(waxRef.current, {
      scale: 0,
      y: -200,
      x: 50,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.in',
    }, '-=0.1')

    tl.to(leftRef.current, {
      rotationY: -180,
      duration: 1.2,
      ease: 'power2.inOut',
    }, '-=0.4')
    .to(rightRef.current, {
      rotationY: 180,
      duration: 1.2,
      ease: 'power2.inOut',
    }, '-=1.2')

    tl.to(cardRef.current, {
      opacity: 0,
      scale: 0.9,
      duration: 0.5,
      ease: 'power2.out',
    }, '-=0.3')

    tl.add(() => {
      if (particlesRef.current) {
        createButterflies(particlesRef.current, 6)
        createGoldParticles(particlesRef.current, 20)
      }
    }, '-=0.5')

    tl.add(() => {
      onOpen()
    }, '+=0.3')
  }

  return (
    <div className="card-scene">
      <canvas ref={particlesRef} className="particles-canvas" />
      
      <div className="envelope-wrapper" ref={cardRef}>
        <div className="envelope">
          <div className="envelope-back"></div>
          
          <div 
            ref={leftRef}
            className="envelope-flap envelope-flap-left"
            style={{
              transformOrigin: 'left bottom',
              transformStyle: 'preserve-3d',
            }}
          ></div>
          
          <div 
            ref={rightRef}
            className="envelope-flap envelope-flap-right"
            style={{
              transformOrigin: 'right bottom',
              transformStyle: 'preserve-3d',
            }}
          ></div>
          
          <div className="envelope-top-flap">
            <div className="flap-triangle triangle-1"></div>
            <div className="flap-triangle triangle-2"></div>
          </div>
          
          <div className="envelope-text">唐同学 亲启</div>
        </div>

        <div 
          ref={waxRef}
          className="wax-seal-wrapper"
          onClick={handleSealClick}
        >
          <WaxSeal />
        </div>
        
        <p className="envelope-hint">轻触印章，开启信封</p>
      </div>
    </div>
  )
}

export default CardScene