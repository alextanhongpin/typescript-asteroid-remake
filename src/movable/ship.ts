
import { Observer } from '../utils/observer'
import Math2 from '../utils/math2'
import KeyCode from '../utils/keycode'
import { Drawable, Presentable } from '../core/drawable'
import { makeParticles } from './effect'
import { makeShipBullet, Bullet } from './bullet'
import { makeLaser } from './laser'
import { makeHealthBar } from './healthbar'

export class Ship extends Drawable {
  bullets: number;
  weapons: number;
  lasers: number;
  particles: Drawable[]
  type: Presentable = Presentable.Ship;
  alpha: number;
  alphaState: boolean;
  flickerTimeout: number;
  invisibilityMode: boolean;
  invisibilityTimeout: number;
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
    this.alpha = 1
    this.alphaState = false
    this.flickerTimeout = 0
    this.invisibilityMode = false
    this.invisibilityTimeout = 0
    this.setup()
  }
  private bindEvents(evt: KeyboardEvent) {
    // Switch statement only limits to one keydown at a time, and can't execute combos
    evt.keyCode === KeyCode.Up && this.moveForward()
    evt.keyCode === KeyCode.Left && this.rotateLeft()
    evt.keyCode === KeyCode.Right && this.rotateRight()
    evt.keyCode === KeyCode.Shift && this.teleport()
    evt.keyCode === KeyCode.Space && this.shoot()
    evt.keyCode === KeyCode.Enter && this.switchWeapons()

  }
  private setup() {
    this.clickedHandler = this.bindEvents.bind(this)
    document.addEventListener('keydown', this.clickedHandler, false)
    let o = this.observer

    o.on(`update:${this.id}`, () => {
      this.updateTeleport()
      this.updateFlicker()
    })

    o.on(`damage:${this.id}`, (m: Drawable) => {
      if (m instanceof Bullet) {
        o.emit('bullet:delete', m)
      }
      if (this.invisibilityMode) return
      this.enterInvisiblityMode()
      this.flicker()
      this.updateHp(m)
    })
  }
  private enterInvisiblityMode() {
    this.invisibilityMode = true
    if (this.invisibilityTimeout) {
      window.clearTimeout(this.invisibilityTimeout)
    }
    this.invisibilityTimeout = window.setTimeout(() => {
      this.invisibilityMode = false
    }, 1000)
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
  private updateHp(m: Drawable) {
    let o = this.observer
    this.hp -= m.damage
    this.hp = Math.max(0, this.hp)
    o.emit(`health:${this.id}`, this.hp)
    if (!this.hp) {
      this.unmount()
      o.emit('message', 'game over, you failed the universe')
    }
  }

  private unmount() {
    let o = this.observer
    o.emit('body:remove', this.id)
    o.emit(`particles:delete`, this.particles)
    o.off(`damage:${this.id}`)
    this.particles = []
    document.removeEventListener('keydown', this.clickedHandler, false)
  }
  private switchWeapons() {
    this.weapons++
    this.weapons = this.weapons % 2
  }
  private moveForward() {
    this.velocity = 5
  }
  private rotateLeft() {
    this.theta -= Math2.degreeToTheta(10)
  }
  private rotateRight() {
    this.theta += Math2.degreeToTheta(10)
  }
  private updateTeleport() {
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
  private teleport() {
    // Can only teleport once
    if (!this.particles.length) {
      this.particles = makeParticles(12, this.x, this.y)
      this.observer.emit('particles:add', this.particles)
      this.x = Math2.random(0, window.innerWidth)
      this.y = Math2.random(0, window.innerHeight)
    }
  }
  private shoot() {
    // Bullets
    if (this.weapons === 0) {
      if (this.bullets < 10) {
        let bullet = makeShipBullet(this.x, this.y, this.theta)
        this.observer.emit('bullet:add', bullet)
        this.bullets++
        this.observer.on(`bullet:delete:${bullet.id}`, (_m: Drawable) => {
          this.bullets--
          this.observer.off(`bullet:delete:${bullet.id}`)
        })
      }
    } else if (this.weapons === 1) {
      if (this.lasers < 1) {
        let laser = makeLaser(this.observer, this.id, this.x, this.y, this.theta, this.radius)
        this.observer.emit('bullet:add', laser)
        this.lasers++
        this.observer.on(`bullet:delete:${laser.id}`, (_m: Drawable) => {
          this.observer.off(`bullet:delete:${laser.id}`)
        })

        window.setTimeout(() => {
          this.observer.emit(`bullet:delete`, laser)
          this.lasers--
        }, 1000)
      }
    }
  }
}

export class ShipFactory {
  makeShip(o: Observer, x: number, y: number): Drawable {
    return new Ship(o, x, y)
  }
  build(o: Observer, boundX: number, boundY: number): Drawable[] {
    let ship = this.makeShip(o, boundX / 2, boundY / 2)
    let healthBar = makeHealthBar(o, ship.id, 100)
    return [ship, healthBar]
  }
}
