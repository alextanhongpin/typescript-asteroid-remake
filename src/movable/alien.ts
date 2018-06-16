
import { Drawable, Presentable } from '../core/drawable'
import { Observer } from '../utils/observer'
import Math2 from '../utils/math2'
import { makeAlienBullet, Bullet } from './bullet'
import { makeEye } from './eye'
import { makeHealthBar } from './healthbar'
import { makeParticles } from './effect'

export class Alien extends Drawable {
  type: Presentable = Presentable.Alien;
  particles: Drawable[];
  private eyeTheta: number = 0;
  private teleportTimeout: number;
  private shootTimeout: number;
  flickerTimeout: number;
  alpha: number;
  alphaState: boolean;
  constructor(o: Observer, x: number, y: number, theta: number) {
    super()
    this.x = x
    this.y = y
    this.theta = theta
    this.observer = o
    this.particles = []
    // This is the collision radius, and is needed
    this.radius = 15
    this.velocity = 3
    this.teleportTimeout = 0
    this.shootTimeout = 0
    this.flickerTimeout = 0
    this.alpha = 1
    this.alphaState = false
    this.setup()
  }

  setup() {
    let o = this.observer
    this.teleportTimeout = window.setInterval(() => {
      this.teleport()
      this.shootTimeout = window.setTimeout(() => {
        this.shoot()
      }, 500)
      if (this.shootTimeout) {
        window.clearTimeout(this.shootTimeout)
      }
      this.shootTimeout = window.setTimeout(() => {
        this.shoot()
      }, 1500)
    }, 3000)

    o.on(`update:${this.id}`, () => {
      this.updateTeleport()
      this.updateFlicker()
    })

    o.on(`eye:${this.id}`, (m: Drawable) => {
      this.eyeTheta = Math2.angle(this.x, this.y, m.x, m.y)
    })

    o.on(`damage:${this.id}`, (m: Drawable) => {
      // Remove bullet, but not laser
      if (m instanceof Bullet) {
        o.emit('bullet:delete', m)
      }
      this.flicker()
      this.updateHp(m)
    })
  }
  private unmount() {
    let o = this.observer
    o.emit('body:remove', this.id)
    o.emit(`particles:delete`, this.particles)
    o.off(`damage:${this.id}`)

    window.clearTimeout(this.teleportTimeout)
    window.clearTimeout(this.shootTimeout)
    this.particles = []
  }
  private updateTeleport() {
    let o = this.observer
    if (!this.particles.length) {
      return
    }
    this.particles.forEach(p => {
      if (p.radius <= 0) {
        o.emit(`particles:delete`, this.particles)
        this.particles = []
      } else {
        p.radius -= 0.1
        p.radius = Math.max(0, p.radius)
      }
    })
  }
  private updateHp(m: Drawable) {
    let o = this.observer
    this.hp -= m.damage
    this.hp = Math.max(0, this.hp)
    o.emit(`health:${this.id}`, this.hp)
    if (!this.hp) {
      this.unmount()
    }
  }
  private shoot() {
    this.observer.emit('bullet:add', makeAlienBullet(this.x, this.y, this.eyeTheta))
  }
  private teleport() {
    if (!this.particles.length) {
      this.particles = makeParticles(12, this.x, this.y)
      this.observer.emit('particles:add', this.particles)
      this.x = Math2.random(0, window.innerWidth)
      this.y = Math2.random(0, window.innerHeight)
    }
  }
  private flicker() {
    this.isFlickering = true
    if (this.flickerTimeout) {
      window.clearTimeout(this.flickerTimeout)
    }
    this.flickerTimeout = window.setTimeout(() => {
      this.isFlickering = false
    }, 1000)
  }
  private updateFlicker() {
    if (this.isFlickering) {
      if (this.alpha > 0.1) {
        if (!this.alphaState) {
          this.alpha -= 0.1
        }
      } else {
        this.alphaState = true
      }
      if (this.alphaState) {
        this.alpha += 0.1
        if (this.alpha > 0.9) {
          this.alphaState = false
        }
      }
    } else {
      this.alpha = 1
    }
  }
}

export class AlienFactory {
  makeAlien(o: Observer, boundX: number, boundY: number) {
    let x = Math2.random(0, boundX)
    let y = Math2.random(0, boundY)
    let theta = Math2.random(0, Math.PI * 2)
    return new Alien(o, x, y, theta)
  }
  build(o: Observer, boundX: number, boundY: number): Drawable[] {
    let alien = this.makeAlien(o, boundX, boundY)
    let eye = makeEye(o, alien.id)
    let healthBar = makeHealthBar(o, alien.id, 100)
    return [alien, eye, healthBar]
  }
}
