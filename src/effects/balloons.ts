interface Balloon {
  x: number
  y: number
  size: number
  color: string
  speed: number
  wobble: number
  wobbleSpeed: number
}

interface FallingParticle {
  x: number
  y: number
  size: number
  color: string
  speed: number
  opacity: number
  rotation: number
}

const BALLOON_COLORS = [
  '#ff6b6b',
  '#ff8e53',
  '#ffd93d',
  '#6bcb77',
  '#4d96ff',
  '#9b59b6',
  '#ff6b9d',
]

const PARTICLE_COLORS = [
  '#ff6b6b',
  '#ff8e53',
  '#ffd93d',
  '#6bcb77',
  '#4d96ff',
  '#9b59b6',
  '#ff6b9d',
  '#ffffff',
]

export function createBalloons(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const balloons: Balloon[] = []
  const count = 8

  for (let i = 0; i < count; i++) {
    balloons.push({
      x: Math.random() * canvas.width,
      y: canvas.height + 100 + Math.random() * 200,
      size: 30 + Math.random() * 40,
      color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
      speed: 0.3 + Math.random() * 0.5,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.01 + Math.random() * 0.02,
    })
  }

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (const balloon of balloons) {
      // 上升
      balloon.y -= balloon.speed
      balloon.wobble += balloon.wobbleSpeed
      balloon.x += Math.sin(balloon.wobble) * 0.5

      // 重置到下方
      if (balloon.y < -balloon.size * 2) {
        balloon.y = canvas.height + balloon.size
        balloon.x = Math.random() * canvas.width
      }

      // 绘制气球
      drawBalloon(ctx, balloon)
    }

    requestAnimationFrame(animate)
  }

  animate()
}

function drawBalloon(ctx: CanvasRenderingContext2D, balloon: Balloon) {
  // 气球主体
  ctx.beginPath()
  ctx.ellipse(balloon.x, balloon.y, balloon.size * 0.8, balloon.size, 0, 0, Math.PI * 2)
  
  const gradient = ctx.createRadialGradient(
    balloon.x - balloon.size * 0.3,
    balloon.y - balloon.size * 0.3,
    0,
    balloon.x,
    balloon.y,
    balloon.size
  )
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)')
  gradient.addColorStop(0.5, balloon.color)
  gradient.addColorStop(1, balloon.color)
  
  ctx.fillStyle = gradient
  ctx.fill()
  ctx.strokeStyle = balloon.color
  ctx.lineWidth = 2
  ctx.stroke()

  // 气球底部小三角形
  ctx.beginPath()
  ctx.moveTo(balloon.x - 8, balloon.y + balloon.size)
  ctx.lineTo(balloon.x, balloon.y + balloon.size + 12)
  ctx.lineTo(balloon.x + 8, balloon.y + balloon.size)
  ctx.closePath()
  ctx.fillStyle = balloon.color
  ctx.fill()

  // 气球线
  ctx.beginPath()
  ctx.moveTo(balloon.x, balloon.y + balloon.size + 12)
  ctx.quadraticCurveTo(
    balloon.x + Math.sin(balloon.wobble * 2) * 20,
    balloon.y + balloon.size + 60,
    balloon.x + Math.sin(balloon.wobble) * 30,
    balloon.y + balloon.size + 100
  )
  ctx.strokeStyle = '#999'
  ctx.lineWidth = 1
  ctx.stroke()
}

export function createFallingParticles(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const particles: FallingParticle[] = []
  const count = 30

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 2 + Math.random() * 6,
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      speed: 0.5 + Math.random() * 1.5,
      opacity: 0.6 + Math.random() * 0.4,
      rotation: Math.random() * Math.PI * 2,
    })
  }

  const animate = () => {
    for (const particle of particles) {
      // 下落
      particle.y += particle.speed
      particle.x += Math.sin(particle.rotation) * 0.3
      particle.rotation += 0.02

      // 重置到上方
      if (particle.y > canvas.height + particle.size) {
        particle.y = -particle.size
        particle.x = Math.random() * canvas.width
      }

      // 绘制粒子
      drawParticle(ctx, particle)
    }

    requestAnimationFrame(animate)
  }

  animate()
}

function drawParticle(ctx: CanvasRenderingContext2D, particle: FallingParticle) {
  ctx.save()
  ctx.globalAlpha = particle.opacity
  
  // 绘制星星形状
  drawStar(ctx, particle.x, particle.y, 5, particle.size, particle.size / 2)
  
  ctx.fillStyle = particle.color
  ctx.fill()
  ctx.restore()
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number
) {
  let rot = (Math.PI / 2) * 3
  let x = cx
  let y = cy
  const step = Math.PI / spikes

  ctx.beginPath()
  ctx.moveTo(cx, cy - outerRadius)

  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius
    y = cy + Math.sin(rot) * outerRadius
    ctx.lineTo(x, y)
    rot += step

    x = cx + Math.cos(rot) * innerRadius
    y = cy + Math.sin(rot) * innerRadius
    ctx.lineTo(x, y)
    rot += step
  }

  ctx.lineTo(cx, cy - outerRadius)
  ctx.closePath()
}