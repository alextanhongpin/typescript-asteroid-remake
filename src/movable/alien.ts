
import { TimeoutDictionary, Drawable, Presentable, checkAngle } from '../core/drawable'
import { Observer, ObserverEvents } from '../utils/observer'
import Math2 from '../utils/math2'
import { makeAlienBullet, Bullet } from './bullet'
import { makeEye } from './eye'
import { makeHealthBar } from './healthbar'
import { makeParticles } from './effect'

export class Alien extends Drawable {
  type: Presentable = Presentable.Alien;
  private alpha: number;
  private alphaState: boolean;
  private boundX: number;
  private boundY: number;
  private events: ObserverEvents;
  private eyeTheta: number;
  private timeouts: TimeoutDictionary;
  private particles: Drawable[];
  constructor(o: Observer, x: number, y: number, theta: number, boundX: number, boundY: number) {
    super()
    this.observer = o
    this.x = x
    this.y = y
    this.theta = theta
    this.velocity = 3

    this.alpha = 1
    this.alphaState = false
    this.boundX = boundX
    this.boundY = boundY
    this.eyeTheta = 0
    this.particles = []
    this.radius = 15

    this.timeouts = {}
    this.events = {
      TRACK_EYE: `eye:${this.id}`,
      UPDATE: `update:${this.id}`,
      DAMAGE: `damage:${this.id}`,
      REMOVE: 'body:remove',
      HEALTH: `health:${this.id}`,
      ADD: 'body:add'
    }

    this.setup()
  }
  private setup() {
    let { DAMAGE, TRACK_EYE, UPDATE } = this.events
    let o = this.observer

    this.timeouts['teleport'] && window.clearTimeout(this.timeouts['teleport'])
    this.timeouts['teleport'] = window.setInterval(() => {
      this.teleport()
      this.shootProgram(500)
      this.shootProgram(1500)
    }, 3000)

    o.on(UPDATE, () => {
      this.updateTeleport()
      this.updateFlicker()
    })
    o.on(TRACK_EYE, (m: Drawable) => {
      this.eyeTheta = checkAngle(this, m)
    })
    o.on(DAMAGE, (m: Drawable) => {
      // Remove bullet, but not laser
      if (m instanceof Bullet) {
        o.emit('body:remove', m)
      }
      this.flicker(1000)
      this.updateHp(m)
    })
  }
  private shootProgram(duration: number) {
    this.timeouts['shoot'] && window.clearTimeout(this.timeouts['shoot'])
    this.timeouts['shoot'] = window.setTimeout(() => {
      this.shoot()
    }, duration)
  }
  private destroy() {
    let { DAMAGE, REMOVE } = this.events
    let o = this.observer

    o.emit(REMOVE, this, ...this.particles)
    o.off(DAMAGE)

    Object.keys(this.timeouts)
      .forEach(k => window.clearTimeout(this.timeouts[k]))
    this.particles = []
  }
  private updateTeleport() {
    if (!this.particles.length) {
      return
    }
    let { REMOVE } = this.events
    let o = this.observer

    this.particles.forEach(p => {
      if (p.radius <= 0) {
        o.emit(REMOVE, ...this.particles)
        this.particles = []
      } else {
        p.radius -= 0.1
        p.radius = Math.max(0, p.radius)
      }
    })
  }
  private updateHp(m: Drawable) {
    let { HEALTH } = this.events

    this.hp -= m.damage
    this.hp = Math.max(0, this.hp)

    this.observer.emit(HEALTH, this.hp)

    if (!this.hp) {
      this.destroy()
    }
  }
  private shoot() {
    let { ADD } = this.events
    this.observer.emit(ADD, makeAlienBullet(this.x, this.y, this.eyeTheta))
  }
  private teleport() {
    let { ADD } = this.events
    if (!this.particles.length) {
      this.particles = makeParticles(12, this.x, this.y)
      this.observer.emit(ADD, ...this.particles)
      this.x = Math2.random(0, this.boundX)
      this.y = Math2.random(0, this.boundY)
    }
  }
  private flicker(duration: number) {
    this.isFlickering = true
    this.timeouts['flicker'] && window.clearTimeout(this.timeouts['flicker'])
    this.timeouts['flicker'] = window.setTimeout(() => {
      this.isFlickering = false
    }, duration)
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
    return new Alien(o, x, y, theta, boundX, boundY)
  }
  build(o: Observer, boundX: number, boundY: number): Drawable[] {
    let alien = this.makeAlien(o, boundX, boundY)
    let eye = makeEye(o, alien.id)
    let healthBar = makeHealthBar(o, alien.id, 100)
    return [alien, eye, healthBar]
  }
}
