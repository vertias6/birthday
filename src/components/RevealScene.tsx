import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'

interface RevealSceneProps {
  onComplete: () => void
  isSoundEnabled: boolean
}

function RevealScene({ onComplete }: RevealSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const maskRef = useRef<HTMLCanvasElement>(null)
  const paperRef = useRef<HTMLDivElement>(null)
  const [revealProgress, setRevealProgress] = useState(0)
  const isDrawing = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })
  const revealThreshold = useRef(0.8)

  const text = `大傻子：

生日快乐天天开心

—— 2026.05.08`

  useEffect(() => {
    const canvas = canvasRef.current
    const maskCanvas = maskRef.current
    
    if (!canvas || !maskCanvas) return

    const ctx = canvas.getContext('2d')
    const maskCtx = maskCanvas.getContext('2d')
    
    if (!ctx || !maskCtx) return

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
      maskCanvas.width = rect.width
      maskCanvas.height = rect.height
      
      // 初始化遮罩为黑色（完全遮挡）
      maskCtx.fillStyle = '#000'
      maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height)
      
      // 绘制文字
      drawText(ctx, text, rect.width, rect.height)
    }

    resize()
    window.addEventListener('resize', resize)

    return () => window.removeEventListener('resize', resize)
  }, [])

  const drawText = (ctx: CanvasRenderingContext2D, text: string, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = '#2d1b4e'
    ctx.font = '18px "STSong", "SimSun", serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    const lines = text.split('\n')
    const lineHeight = 36
    const startY = height / 2 - (lines.length - 1) * lineHeight / 2
    
    lines.forEach((line, i) => {
      ctx.fillText(line, width / 2, startY + i * lineHeight)
    })
  }

  const calculateProgress = useCallback(() => {
    const maskCanvas = maskRef.current
    if (!maskCanvas) return 0

    const maskCtx = maskCanvas.getContext('2d')
    if (!maskCtx) return 0

    const imageData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height)
    const pixels = imageData.data
    let transparentPixels = 0
    const totalPixels = pixels.length / 4

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 128) {
        transparentPixels++
      }
    }

    return transparentPixels / totalPixels
  }, [])

  const drawSpotlight = useCallback((x: number, y: number) => {
    const maskCanvas = maskRef.current
    if (!maskCanvas) return

    const maskCtx = maskCanvas.getContext('2d')
    if (!maskCtx) return

    const rect = maskCanvas.getBoundingClientRect()
    const scaleX = maskCanvas.width / rect.width
    const scaleY = maskCanvas.height / rect.height
    
    const canvasX = (x - rect.left) * scaleX
    const canvasY = (y - rect.top) * scaleY

    // 绘制渐变光斑擦除效果
    const gradient = maskCtx.createRadialGradient(canvasX, canvasY, 0, canvasX, canvasY, 60)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.4)')

    maskCtx.globalCompositeOperation = 'destination-out'
    maskCtx.fillStyle = gradient
    maskCtx.beginPath()
    maskCtx.arc(canvasX, canvasY, 60, 0, Math.PI * 2)
    maskCtx.fill()
    maskCtx.globalCompositeOperation = 'source-over'

    // 更新进度
    const progress = calculateProgress()
    setRevealProgress(progress)

    // 检查是否达到阈值
    if (progress >= revealThreshold.current) {
      gsap.to(paperRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
        ease: 'power2.out',
        onComplete: () => onComplete(),
      })
    }
  }, [calculateProgress, onComplete])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDrawing.current = true
    lastPos.current = { x: e.clientX, y: e.clientY }
    drawSpotlight(e.clientX, e.clientY)
  }, [drawSpotlight])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDrawing.current) return
    
    const dx = e.clientX - lastPos.current.x
    const dy = e.clientY - lastPos.current.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    if (distance > 5) {
      drawSpotlight(e.clientX, e.clientY)
      lastPos.current = { x: e.clientX, y: e.clientY }
    }
  }, [drawSpotlight])

  const handleMouseUp = useCallback(() => {
    isDrawing.current = false
  }, [])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    isDrawing.current = true
    lastPos.current = { x: touch.clientX, y: touch.clientY }
    drawSpotlight(touch.clientX, touch.clientY)
  }, [drawSpotlight])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDrawing.current) return
    
    const touch = e.touches[0]
    const dx = touch.clientX - lastPos.current.x
    const dy = touch.clientY - lastPos.current.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    if (distance > 5) {
      drawSpotlight(touch.clientX, touch.clientY)
      lastPos.current = { x: touch.clientX, y: touch.clientY }
    }
  }, [drawSpotlight])

  const handleTouchEnd = useCallback(() => {
    isDrawing.current = false
  }, [])

  useEffect(() => {
    // 羊皮纸淡入动画
    gsap.fromTo(paperRef.current, 
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' }
    )
  }, [])

  return (
    <div className="reveal-scene">
      <div 
        ref={paperRef}
        className="parchment-paper"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <canvas ref={canvasRef} className="text-canvas" />
        <canvas ref={maskRef} className="mask-canvas" />
        
        {/* 羊皮纸纹理覆盖 */}
        <div className="parchment-overlay"></div>
        
        {/* 提示文字 */}
        <div className="hint-text">
          <p>滑动显影祝福</p>
          <p className="progress">{Math.round(revealProgress * 100)}%</p>
        </div>
      </div>
    </div>
  )
}

export default RevealScene