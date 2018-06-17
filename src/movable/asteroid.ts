
import { Drawable, Presentable, checkAngle } from '../core/drawable'
import { Observer, ObserverEvents } from '../utils/observer'
import Math2 from '../utils/math2'
import { makeSparks } from './effect'
import { Bullet } from './bullet'
import { makeHealthBar } from './healthbar'

export class Asteroid extends Drawable {
  type: Presentable = Presentable.Asteroid;
  private particles: Drawable[] = [];
  private events: ObserverEvents;
  constructor(o: Observer, x: number, y: number, theta: number, velocity: number, radius: number, hp: number) {
    super()
    this.observer = o
    this.x = x
    this.y = y
    this.theta = theta
    this.velocity = velocity
    this.radius = radius
    this.hp = hp
    this.damage = Math.floor(radius / 2)

    this.events = {
      UPDATE: `update:${this.id}`,
      DAMAGE: `damage:${this.id}`,
      REMOVE: 'body:remove',
      ADD: 'body:add',
      HEALTH: `health:${this.id}`
    }

    this.setup()
  }
  private setup() {
    let { UPDATE, DAMAGE, REMOVE } = this.events
    let o = this.observer

    o.on(UPDATE, () => {
      this.updateParticles()
    })
    o.on(DAMAGE, (m: Drawable) => {
      if (m instanceof Bullet) {
        o.emit(REMOVE, m)
        this.collisionSpark(m)
      }
      this.updateHp(m)
    })
  }
  private updateParticles() {
    let { REMOVE } = this.events

    if (!this.particles.length) {
      return
    }
    this.particles.forEach(p => {
      if (p.radius <= 0) {
        this.observer.emit(REMOVE, ...this.particles)
        this.particles = []
      } else {
        p.radius -= 0.1
        p.radius = Math.max(0, p.radius)
      }
    })
  }
  private updateHp(m: Drawable) {
    let { HEALTH, DAMAGE, REMOVE } = this.events
    let o = this.observer

    this.hp -= m.damage
    this.hp = Math.max(0, this.hp)

    o.emit(HEALTH, this.hp)

    if (!this.hp) {
      o.emit(REMOVE, this, ...this.particles)
      o.off(DAMAGE)
    }
  }
  private collisionSpark(m: Drawable) {
    let { ADD } = this.events

    if (!this.particles.length) {
      this.particles = makeSparks(6, m.x, m.y, checkAngle(this, m))
      this.observer.emit(ADD, ...this.particles)
    }
  }
}

export class AsteroidFactory {
  makeAsteroid(o: Observer, boundX: number, boundY: number): Drawable {
    let x = Math2.random(0, boundX)
    let y = Math2.random(0, boundY)
    let theta = Math2.random(0, Math.PI * 2)
    let velocity = Math2.random(3, 10) / 10
    let radius = Math2.random(20, 30)
    let hp = Math2.random(60, 80)
    return new Asteroid(o, x, y, theta, velocity, radius, hp)
  }
  build(o: Observer, boundX: number, boundY: number): Drawable[] {
    let asteroid = this.makeAsteroid(o, boundX, boundY)
    let healthBar = makeHealthBar(o, asteroid.id, asteroid.hp)
    return [asteroid, healthBar]
  }
}
