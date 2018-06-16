import genId from '../utils/id'
import Observer from '../utils/observer'

export enum Presentable {
  Alien,
  Asteroid,
  Eye,
  Ship,
  HealthBar,
  Circle,
  Laser
}

export enum Boundary {
  Repeat,
  Bounded,
  None
}

export abstract class Metadata {
  id: number = genId();
  x: number = 0;
  y: number = 0;
  theta: number = 0;
  velocity: number = 0;
  friction: number = 1;
  type: Presentable = Presentable.Circle;
  boundary: Boundary = Boundary.Repeat;
  isVisible: boolean = true;
  hp: number = 100;
  maxHp: number = 100;
  // Composite pattern, since the views can be stacked/overlayed
  metadatas: {[index:string]: Metadata} = {};
  [key: string]: any;
}

function checkOutOfBounds(m: Metadata, boundX: number, boundY: number){
  return m.x > boundX || m.x < 0 || m.y > boundY || m.y < 0
}

export class Engine {
  update(m: Metadata, boundX: number, boundY: number, o: Observer) {
    if (!m.velocity) return
    m.x += Math.cos(m.theta) * m.velocity
    m.y += Math.sin(m.theta) * m.velocity
    if (m.friction > 0) {
      m.velocity *= m.friction
    }
    switch (m.boundary) {
      case Boundary.Repeat:
        m.x = (m.x + boundX) % boundX
        m.y = (m.y + boundY) % boundY
        break
      case Boundary.Bounded:
        if (checkOutOfBounds(m, boundX, boundY)) {
          o.emit('bullet:delete', m)
          o.emit(`bullet:delete:${m.id}`, m)
        }
        break
    }
    m.observer && m.observer.emit(`update:${m.id}`, m)
  }

  draw(ctx: CanvasRenderingContext2D, m: Metadata) {
    switch (m.type) {
      case Presentable.Alien:
        drawAlien(ctx, m.x, m.y)
        break
      case Presentable.Eye:
        drawEye(ctx, m.x, m.y, m.theta)
        break
      case Presentable.Ship:
        drawShip(ctx, m.x, m.y, m.theta, m.radius, m.alpha)
        break
      case Presentable.HealthBar:
        // 25 is the hard-coded width of the health bar
        let radius = 25
        drawHealthBar(ctx, m.x - radius, m.y - radius, m.isVisible, m.hp, m.maxHp)
        break
      case Presentable.Circle:
        drawCircle(ctx, m.x, m.y, m.theta, m.radius, true)
        break
      case Presentable.Asteroid:
        drawCircle(ctx, m.x, m.y, m.theta, m.radius, false)
        break
      case Presentable.Laser:
        drawLaser(ctx, m.x, m.y, m.theta, m.radius)
    }
  }
}

function drawShip (ctx: CanvasRenderingContext2D, x: number, y: number, theta: number, radius: number, alpha: number) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(theta)
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(-radius, -radius)
  ctx.lineTo(radius, 0)
  ctx.lineTo(-radius, radius)
  ctx.globalAlpha = alpha
  ctx.fillStyle = 'white'
  ctx.fill()
  ctx.closePath()
  ctx.restore()
}

function drawCircle (ctx: CanvasRenderingContext2D, x: number, y: number, theta: number, radius: number, fill: boolean) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(theta)
  ctx.beginPath()
  ctx.arc(0, 0, radius, 0, Math.PI * 2, false)
  if (fill) {
    ctx.fillStyle = 'white'
    ctx.fill()
  } else {
    ctx.strokeStyle = 'white'
    ctx.stroke()
  }
  ctx.closePath()
  ctx.restore()
}

function drawEye(ctx: CanvasRenderingContext2D, x: number, y: number, theta: number) {
  ctx.save()
  ctx.translate(x, y)
  ctx.beginPath()
  ctx.arc(5 * Math.cos(theta), 5 * Math.sin(theta), 2, 0, Math.PI * 2, false)
  ctx.fillStyle = 'white'
  ctx.fill()
  ctx.closePath()
  ctx.restore()
}

function drawAlien (ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save()
  ctx.translate(x, y)

  // Head
  ctx.beginPath()
  ctx.moveTo(-15, -3)
  ctx.bezierCurveTo(-20, -15, 20, -15, 15, -3)
  ctx.strokeStyle = 'white'
  ctx.stroke()
  ctx.closePath()

  // // Tracking eye
  // ctx.beginPath()
  // ctx.arc(this.eyeX * Math.cos(this.eyeTheta), -5 + this.eyeY * Math.sin(this.eyeTheta), 2, 0, Math.PI * 2, false)
  // ctx.fillStyle = 'white'
  // ctx.fill()
  // ctx.closePath()

  // Middle body
  ctx.beginPath()
  ctx.rect(-20, -3, 40, 3)
  ctx.strokeStyle = 'white'
  ctx.stroke()
  ctx.closePath()

  // Bottom
  ctx.beginPath()
  ctx.moveTo(20, 0)
  ctx.lineTo(30, 5)
  ctx.lineTo(-30, 5)
  ctx.lineTo(-20, 0)
  ctx.moveTo(15, 5)
  ctx.lineTo(18, 10)
  ctx.moveTo(-15, 5)
  ctx.lineTo(-18, 10)
  ctx.strokeStyle = 'white'
  ctx.stroke()
  ctx.closePath()
  ctx.restore()
}

function drawHealthBar(ctx: CanvasRenderingContext2D, x: number, y: number, isVisible: boolean, hp: number, maxHp: number) {
  if (!isVisible) {
    return
  }
  let width = 50
  let height = 5
  let spacing = 1
  let padding = spacing * 2
  let hpRatio = hp / maxHp

  ctx.save()
  ctx.translate(x, y)
  ctx.beginPath()
  ctx.rect(0, 0, width, height)
  ctx.strokeStyle = 'white'
  ctx.stroke()
  ctx.closePath()

  ctx.beginPath()
  ctx.rect(spacing, spacing, Math.max(0, hpRatio * (width - padding)), height - padding)
  ctx.fillStyle = _healthColor(hpRatio)
  ctx.fill()
  ctx.closePath()

  ctx.restore()
}

function _healthColor(hpRatio: number): string {
  if (hpRatio < 0.25) {
    return 'red'
  }
  if (hpRatio < 0.5) {
    return 'orange'
  }
  return 'white'
}

function drawLaser(ctx: CanvasRenderingContext2D, x: number, y: number, theta: number, radius: number) {
  ctx.save()
  ctx.translate(x, y)
  ctx.beginPath()

  let thetaX = Math.cos(theta)
  let thetaY = Math.sin(theta)
  ctx.moveTo(thetaX * radius, thetaY * radius)
  ctx.lineTo(thetaX * window.innerWidth, thetaY * window.innerWidth)
  ctx.lineWidth = 3

  let gradient = ctx.createLinearGradient(10, 0, 500, 0)
  gradient.addColorStop(0, 'red')
  gradient.addColorStop(1 / 6, 'orange')
  gradient.addColorStop(2 / 6, 'yellow')
  gradient.addColorStop(3 / 6, 'green')
  gradient.addColorStop(4 / 6, 'blue')
  gradient.addColorStop(5 / 6, 'indigo')
  gradient.addColorStop(1, 'violet')
  ctx.strokeStyle = gradient
  ctx.stroke()

  ctx.closePath()
  ctx.restore()
}