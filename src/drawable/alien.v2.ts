
import Observer from '../utils/observer'
import  { Metadata, Presentable, Boundary } from '../core/metadata'
import Math2 from '../utils/math2'
import { makeBullet, makeEye, makeHealthBar, makeParticles } from './makable'

export class Alien extends Metadata {
  velocity: number = 3;
  type: Presentable = Presentable.Alien;
  particles: Metadata[];
  constructor(o: Observer, x: number, y: number, theta: number) {
    super()
    this.x = x
    this.y = y
    this.theta = theta
    this.observer = o
    this.particles = []
    this.setup()
  }

  setup() {
    window.setInterval(() => {
      this.teleport()
      window.setTimeout(() => {
        this.shoot()
      }, 500)
 
      window.setTimeout(() => {
        this.shoot()
      }, 1500)
    }, 3000)

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
  }
  shoot () {
    this.observer.emit('bullet:add', makeBullet(this.x, this.y, this.theta))
  }

  teleport() {
    this.particles = makeParticles(12, this.x, this.y)
    this.observer.emit('particles:add', this.particles)
    this.x = Math2.random(0, window.innerWidth)
    this.y = Math2.random(0, window.innerHeight)
    this.theta = Math2.random(0, Math.PI * 2)
  }
}

export default class AlienFactory {
  makeAlien(o: Observer) {
    let x = Math2.random(0, window.innerWidth)
    let y = Math2.random(0, window.innerHeight)
    let theta = Math2.random(0, Math.PI * 2)
    return new Alien(o, x, y, theta)
  }
  build(o: Observer): Metadata[] {
    let alien = this.makeAlien(o)
    let eye = makeEye(o, alien.id)
    let healthBar = makeHealthBar(o, alien.id)
    return [alien, eye, healthBar]
  }
}
