import genId from '../utils/id'
import { Observer } from '../utils/observer'

export enum Presentable {
  Alien,
  Asteroid,
  Circle,
  Eye,
  HealthBar,
  Laser,
  Ship
}

export enum Boundary {
  Bounded,
  None,
  Repeat
}

export type DrawableDictionary = {
  [index: number]: Drawable
}

export type TimeoutDictionary = {
  [index: string]: number
}

export function flatten(drawables: Drawable[][]): Drawable[] {
  return drawables.reduce((acc: Drawable[], d: Drawable[]) => {
    return acc.concat(d)
  }, [])
}

export function reduce(drawables: Drawable[]): DrawableDictionary {
  return drawables.reduce((acc: DrawableDictionary, m: Drawable) => {
    acc[m.id] = m
    return acc
  }, {})
}

export function repeat(count: number, factory: () => Drawable[]): Drawable[] {
  let drawables = Array(count).fill(0).map(_ => {
    return factory()
  })
  return flatten(drawables)
}

export abstract class Drawable {
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
  damage: number = 0;
  [key: string]: any;
}

export function checkOutOfBounds(m: Drawable, boundX: number, boundY: number) {
  return m.x > boundX || m.x < 0 || m.y > boundY || m.y < 0
}

export function checkAngle(m1: Drawable, m2: Drawable) {
  return Math.atan2(m2.y - m1.y, m2.x - m1.x)
}

export function checkCollision(m1: Drawable, m2: Drawable): boolean {
  let deltaX = Math.pow(m1.x - m2.x, 2)
  let deltaY = Math.pow(m1.y - m2.y, 2)
  let radius = m1.radius + m2.radius
  return Math.sqrt(deltaX + deltaY) < radius
}

export function checkLaserCollision(m1: Drawable, m2: Drawable): boolean {
  let deltaY = Math.tan(m1.theta) * (m2.x - m1.x)
  let y2 = m1.y + deltaY
  return Math.abs(m2.y - y2) < m2.radius
}

export class Engine {
  update(m: Drawable, boundX: number, boundY: number, o: Observer) {
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
          o.emit('body:remove', m)
        }
        break
    }
    o.emit(`update:${m.id}`, m)
  }

  draw(ctx: CanvasRenderingContext2D, m: Drawable) {
    switch (m.type) {
      case Presentable.Alien:
        drawAlien(ctx, m.x, m.y, m.alpha)
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
        break
      default:
        throw new Error(`drawError: ${m.type} is not defined`)
    }
  }
}

function drawShip(ctx: CanvasRenderingContext2D, x: number, y: number, theta: number, radius: number, alpha: number) {
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

function drawCircle(ctx: CanvasRenderingContext2D, x: number, y: number, theta: number, radius: number, fill: boolean) {
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

function drawAlien(ctx: CanvasRenderingContext2D, x: number, y: number, alpha: number) {
  ctx.save()
  ctx.translate(x, y)

  // Head
  ctx.beginPath()
  ctx.moveTo(-15, -3)
  ctx.bezierCurveTo(-20, -15, 20, -15, 15, -3)
  ctx.strokeStyle = 'white'
  ctx.globalAlpha = alpha
  ctx.stroke()
  ctx.closePath()

  // Body
  ctx.beginPath()
  ctx.rect(-20, -3, 40, 3)
  ctx.strokeStyle = 'white'
  ctx.globalAlpha = alpha
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
  ctx.globalAlpha = alpha
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

  // Border
  ctx.beginPath()
  ctx.rect(0, 0, width, height)
  ctx.strokeStyle = 'white'
  ctx.stroke()
  ctx.closePath()

  // Health bar
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
  let thetaX = Math.cos(theta)
  let thetaY = Math.sin(theta)

  ctx.save()
  ctx.translate(x, y)
  ctx.beginPath()
  ctx.moveTo(thetaX * radius, thetaY * radius)
  ctx.lineTo(thetaX * window.innerWidth, thetaY * window.innerWidth)
  ctx.lineWidth = 3
  ctx.strokeStyle = _rainbowGradient(ctx)
  ctx.stroke()
  ctx.closePath()
  ctx.restore()
}

function _rainbowGradient(ctx: CanvasRenderingContext2D): CanvasGradient {
  let gradient = ctx.createLinearGradient(10, 0, 500, 0)
  gradient.addColorStop(0, 'red')
  gradient.addColorStop(1 / 6, 'orange')
  gradient.addColorStop(2 / 6, 'yellow')
  gradient.addColorStop(3 / 6, 'green')
  gradient.addColorStop(4 / 6, 'blue')
  gradient.addColorStop(5 / 6, 'indigo')
  gradient.addColorStop(1, 'violet')
  return gradient
}
