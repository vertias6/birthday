import { useRef, useState } from 'react'
import gsap from 'gsap'

interface CakeSceneProps {
  onBlowOut: () => void
  isSoundEnabled?: boolean
}

const DOG_IMAGES = [
  '/dog1.jpg',
  '/dog2.jpg',
  '/dog3.jpg',
  '/girl.jpg',
]

function CakeScene({ onBlowOut }: CakeSceneProps) {
  const cakeRef = useRef<HTMLDivElement>(null)
  const dogImagesRef = useRef<HTMLImageElement[]>([])
  const [isBlowing, setIsBlowing] = useState(false)

  const handleBlowOut = () => {
    if (isBlowing) return
    setIsBlowing(true)

    const tl = gsap.timeline()

    const flames = document.querySelectorAll('.candle-flame')
    flames.forEach((flame, index) => {
      tl.to(flame, {
        scale: 0,
        opacity: 0,
        duration: 0.2,
        delay: index * 0.1,
      })
    })

    const smokes = document.querySelectorAll('.candle-smoke')
    smokes.forEach((smoke, index) => {
      tl.to(smoke, {
        opacity: 0.6,
        y: -50,
        scale: 2,
        duration: 1.5,
        delay: index * 0.1 + 0.2,
      })
    })

    if (dogImagesRef.current.length > 0) {
      dogImagesRef.current.forEach((img, index) => {
        const angle = (Math.PI * 2 * index) / dogImagesRef.current.length + Math.random() * 0.5
        tl.to(img, {
          x: Math.cos(angle) * 300,
          y: Math.sin(angle) * 200 - 100,
          scale: 0,
          opacity: 0,
          rotation: Math.random() * 360,
          duration: 0.8,
          ease: 'power2.in',
          delay: 0.3,
        })
      })
    }

    tl.to(cakeRef.current, {
      opacity: 0,
      scale: 0.9,
      y: 50,
      duration: 0.6,
      ease: 'power2.out',
    }, '-=0.4')

    tl.add(() => {
      onBlowOut()
    }, '+=0.2')
  }

  const getDogPosition = (index: number) => {
    const positions = [
      { top: '10%', left: '5%', transform: 'rotate(-15deg)' },
      { top: '20%', right: '8%', transform: 'rotate(10deg)' },
      { bottom: '15%', left: '10%', transform: 'rotate(-8deg)' },
      { bottom: '25%', right: '5%', transform: 'rotate(20deg)' },
    ]
    return positions[index % positions.length]
  }

  return (
    <div className="cake-scene">
      <div className="dog-images">
        {DOG_IMAGES.map((src, index) => (
          <img
            key={index}
            ref={(el) => {
              if (el) dogImagesRef.current[index] = el
            }}
            src={src}
            alt={`小狗 ${index + 1}`}
            className="dog-image"
            style={getDogPosition(index)}
          />
        ))}
      </div>

      <div ref={cakeRef} className="cake-container">
        <div className="birthday-text">生日快乐，大傻子!</div>
        
        <div className="candles">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="candle" style={{ left: `${15 + i * 17}%` }}>
              <div className="candle-body"></div>
              <div className="candle-flame">
                <div className="flame-inner"></div>
              </div>
              <div className="candle-smoke"></div>
            </div>
          ))}
        </div>

        <div className="cake">
          <div className="cake-layer layer-top">
            <div className="cake-frosting"></div>
          </div>
          <div className="cake-layer layer-middle">
            <div className="cake-frosting"></div>
            <div className="cake-decoration"></div>
          </div>
          <div className="cake-layer layer-bottom">
            <div className="cake-frosting"></div>
          </div>
          <div className="cake-plate"></div>
        </div>

        <button className="blow-button" onClick={handleBlowOut}>
          吹灭
        </button>
      </div>
    </div>
  )
}

export default CakeScene