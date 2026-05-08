interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  type: 'butterfly' | 'gold'
  rotation: number
  rotationSpeed: number
}

export function createButterflies(canvas: HTMLCanvasElement, count: number) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const particles: Particle[] = []
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5
    particles.push({
      x: centerX,
      y: centerY,
      vx: Math.cos(angle) * (1 + Math.random()),
      vy: Math.sin(angle) * (1 + Math.random()) - 0.5,
      life: 1,
      maxLife: 200 + Math.random() * 100,
      size: 8 + Math.random() * 6,
      type: 'butterfly',
      rotation: 0,
      rotationSpeed: (Math.random() - 0.5) * 0.1,
    })
  }

  animateParticles(ctx, particles, canvas.width, canvas.height)
}

export function createGoldParticles(canvas: HTMLCanvasElement, count: number) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const particles: Particle[] = []
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2

  for (let i = 0; i < count; i++) {
    const angle = Math.PI * 2 * Math.random()
    particles.push({
      x: centerX,
      y: centerY,
      vx: Math.cos(angle) * (2 + Math.random() * 2),
      vy: Math.sin(angle) * (2 + Math.random() * 2) - 1,
      life: 1,
      maxLife: 150 + Math.random() * 100,
      size: 2 + Math.random() * 3,
      type: 'gold',
      rotation: 0,
      rotationSpeed: (Math.random() - 0.5) * 0.05,
    })
  }

  animateParticles(ctx, particles, canvas.width, canvas.height)
}

function animateParticles(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  width: number,
  height: number
) {
  let active = true

  const animate = () => {
    if (!active) return

    ctx.clearRect(0, 0, width, height)

    let allDead = true
    for (const p of particles) {
      if (p.life <= 0) continue
      allDead = false

      p.x += p.vx
      p.y += p.vy
      p.vy += 0.02 // 轻微重力
      p.life -= 1 / p.maxLife
      p.rotation += p.rotationSpeed

      ctx.save()
      ctx.globalAlpha = p.life

      if (p.type === 'butterfly') {
        drawButterfly(ctx, p.x, p.y, p.size, p.rotation)
      } else {
        drawGoldParticle(ctx, p.x, p.y, p.size)
      }

      ctx.restore()
    }

    if (!allDead) {
      requestAnimationFrame(animate)
    }
  }

  animate()
}

function drawButterfly(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rotation: number
) {
  ctx.translate(x, y)
  ctx.rotate(rotation)

  const wingPhase = Math.sin(Date.now() * 0.01 + rotation) * 0.3

  // 左翅膀
  ctx.beginPath()
  ctx.ellipse(-size * 0.8, 0, size, size * (0.6 + wingPhase), 0, 0, Math.PI * 2)
  const gradient1 = ctx.createLinearGradient(-size * 1.5, 0, size * 0.5, 0)
  gradient1.addColorStop(0, '#1a1a3e')
  gradient1.addColorStop(0.5, '#c9a962')
  gradient1.addColorStop(1, '#ff6b9d')
  ctx.fillStyle = gradient1
  ctx.fill()

  // 右翅膀
  ctx.beginPath()
  ctx.ellipse(size * 0.8, 0, size, size * (0.6 + wingPhase), 0, 0, Math.PI * 2)
  const gradient2 = ctx.createLinearGradient(-size * 0.5, 0, size * 1.5, 0)
  gradient2.addColorStop(0, '#ff6b9d')
  gradient2.addColorStop(0.5, '#c9a962')
  gradient2.addColorStop(1, '#1a1a3e')
  ctx.fillStyle = gradient2
  ctx.fill()

  // 身体
  ctx.beginPath()
  ctx.moveTo(-size * 0.2, -size * 0.3)
  ctx.lineTo(0, 0)
  ctx.lineTo(-size * 0.2, size * 0.3)
  ctx.strokeStyle = '#c9a962'
  ctx.lineWidth = 1
  ctx.stroke()
}

function drawGoldParticle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
) {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, size)
  gradient.addColorStop(0, '#fffde7')
  gradient.addColorStop(0.5, '#ffd700')
  gradient.addColorStop(1, '#c9a962')

  ctx.beginPath()
  ctx.arc(x, y, size, 0, Math.PI * 2)
  ctx.fillStyle = gradient
  ctx.fill()
}