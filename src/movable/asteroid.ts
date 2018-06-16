
import { Drawable, Presentable } from '../core/drawable'
import { Observer } from '../utils/observer'
import Math2 from '../utils/math2'
import { makeSparks } from './effect'
import { Bullet } from './bullet'
import { makeHealthBar } from './healthbar'

export class Asteroid extends Drawable {
  type: Presentable = Presentable.Asteroid;
  particles: Drawable[] = [];
  constructor(o: Observer, x: number, y: number, theta: number, velocity: number, radius: number, hp: number) {
    super()
    this.observer = o
    this.x = x
    this.y = y
    this.theta = theta
    this.velocity = velocity
    this.radius = radius
    this.hp = hp
    this.damage = radius / 2
    this.setup()
  }

  setup() {
    this.observer.on(`update:${this.id}`, () => {
      if (!this.particles.length) {
        return
      }
      this.particles.forEach(p => {
        if (p.radius <= 0) {
          this.observer.emit(`particles:delete`, this.particles)
          this.particles = []
        } else {
          p.radius -= 0.1
          p.radius = Math.max(0, p.radius)
        }
      })
    })
    this.observer.on(`damage:${this.id}`, (m: Drawable) => {
      // Remove bullet, but not laser
      if (m instanceof Bullet) {
        this.observer.emit('bullet:delete', m)
        this.collisionSpark(this.x, this.y, m.x, m.y)
      }
      this.updateHp(m)
    })
  }
  private updateHp(m: Drawable) {
    let o = this.observer
    this.hp -= m.damage
    this.hp = Math.max(0, this.hp)
    o.emit(`health:${this.id}`, this.hp)
    if (!this.hp) {
      o.emit('body:remove', this.id)
      o.emit(`particles:delete`, this.particles)
      o.off(`damage:${this.id}`)
    }
  }
  private collisionSpark(x1: number, y1: number, x2: number, y2: number) {
    if (!this.particles.length) {
      this.particles = makeSparks(6, x2, y2, Math2.angle(x1, y1, x2, y2))
      this.observer.emit('particles:add', this.particles)
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
