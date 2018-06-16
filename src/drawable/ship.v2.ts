
import Observer from '../utils/observer'
import  { Metadata, Presentable } from '../core/metadata'
import Math2 from '../utils/math2'
import KeyCode from '../utils/keycode'
import { makeParticles, makeBullet, makeHealthBar, makeLaser } from './makable'

export class Ship extends Metadata {
  bullets: number;
  weapons: number;
  lasers: number;
  particles: Metadata[]
  type: Presentable = Presentable.Ship;
  constructor(o: Observer, x: number, y: number) {
    super()
    this.observer = o
    this.x = x
    this.y = y
    this.friction = 0.95
    this.velocity = 5
    this.theta = 0
    this.radius = 15
    this.bullets = 0
    this.weapons = 0
    this.lasers = 0
    this.particles = []
    this.setup()
  }
  setup() {
    document.addEventListener('keydown', (evt) => {
      // Switch statement only limits to one keydown at a time, and can't execute combos
      if (evt.keyCode === KeyCode.Up) {
        this.velocity = 5
      }
      if (evt.keyCode === KeyCode.Left) {
        this.theta -= Math2.degreeToTheta(10)
      }
      if (evt.keyCode === KeyCode.Right) {
        this.theta += Math2.degreeToTheta(10)
      }
      if (evt.keyCode === KeyCode.Shift) {
        this.teleport()
      }
      if (evt.keyCode === KeyCode.Space) {
        // this._getWeapon().reload(this)
        this.shoot()
      }
      if (evt.keyCode === KeyCode.Enter) {
        // this._swapWeapon()
        this.weapons++
        this.weapons = this.weapons % 2
      }
    })

    this.observer.on(`update:${this.id}`, () => {
      this.updateTeleport()
    })
  }

  private updateTeleport () {
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
  }

  teleport() {
    // Can only teleport once
    if (!this.particles.length) {
      this.particles = makeParticles(12, this.x, this.y)
      this.observer.emit('particles:add', this.particles)
      this.x = Math2.random(0, window.innerWidth)
      this.y = Math2.random(0, window.innerHeight)
    }
  }
  shoot () {
    // Bullets
    if (this.weapons === 0) {
      if (this.bullets < 10) {
        let bullet = makeBullet(this.x, this.y, this.theta)
        this.observer.emit('bullet:add', bullet)
        this.bullets++
        this.observer.on(`bullet:delete:${bullet.id}`, (_m: Metadata) => {
          this.bullets--
          this.observer.off(`bullet:delete:${bullet.id}`)
        })
      } 
    } else if (this.weapons === 1) {
      console.log(this.lasers)
      if (this.lasers < 1) {
        let laser = makeLaser(this.observer, this.id, this.x, this.y, this.theta, this.radius)
        this.observer.emit('bullet:add', laser)
        this.lasers++
        this.observer.on(`bullet:delete:${laser.id}`, (_m: Metadata) => {
          this.observer.off(`bullet:delete:${laser.id}`)
        })

        window.setTimeout(() => {
          this.observer.emit(`bullet:delete`, laser)
          this.lasers--
        }, 500)
      } 
    }
  }
}

export default class ShipFactory {
  makeShip(o: Observer, x: number, y: number): Metadata {
    return new Ship(o, x, y)
  }
  build(o: Observer, boundX: number, boundY: number): Metadata[] {
    let ship = this.makeShip(o, boundX / 2, boundY / 2)
    let healthBar = makeHealthBar(o, ship.id)
    return [ship, healthBar]
  }
}
