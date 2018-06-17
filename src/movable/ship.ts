
import { Observer, ObserverEvents } from '../utils/observer'
import Math2 from '../utils/math2'
import KeyCode from '../utils/keycode'
import { Drawable, Presentable, TimeoutDictionary } from '../core/drawable'
import { makeParticles } from './effect'
import { makeShipBullet, Bullet } from './bullet'
import { makeLaser } from './laser'
import { makeHealthBar } from './healthbar'

enum WeaponType {
  Bullet,
  Laser
}

export class Ship extends Drawable {
  type: Presentable = Presentable.Ship;
  private bullets: number;
  private weapons: WeaponType;
  private lasers: number;
  private particles: Drawable[]
  private alpha: number;
  private alphaState: boolean;
  private invisibilityMode: boolean;
  private timeouts: TimeoutDictionary;
  private events: ObserverEvents;
  private rotation: number;
  private minVelocity: number;
  private maxVelocity: number;
  constructor(o: Observer, x: number, y: number, private boundX: number, private boundY: number) {
    super()
    this.observer = o
    this.x = x
    this.y = y
    this.friction = 0.95
    this.minVelocity = 1
    this.maxVelocity = 8
    this.velocity = this.minVelocity
    this.theta = 0
    this.radius = 15

    this.alpha = 1
    this.alphaState = false
    this.bullets = 0
    this.invisibilityMode = false
    this.rotation = Math2.degreeToTheta(10)
    this.weapons = WeaponType.Bullet
    this.lasers = 0
    this.particles = []

    this.timeouts = {}
    this.events = {
      UPDATE: `update:${this.id}`,
      DAMAGE: `damage:${this.id}`,
      HEALTH: `health:${this.id}`,
      REMOVE: 'body:remove',
      ADD: 'body:add',
      MESSAGE: 'message',
      TOUCH_UP: 'touch:up',
      TOUCH_LEFT: 'touch:left',
      TOUCH_RIGHT: 'touch:right',
      TOUCH_SHOOT: 'touch:shoot',
      TOUCH_SWAP_WEAPON: 'touch:swap',
      TOUCH_TELEPORT: 'touch:teleport'
    }

    this.setup()
  }
  private bindEvents(evt: KeyboardEvent) {
    // Switch statement only limits to one keydown at a time, and can't execute combos
    evt.keyCode === KeyCode.Up && this.accelerate()
    evt.keyCode === KeyCode.Left && this.rotateLeft()
    evt.keyCode === KeyCode.Right && this.rotateRight()
    evt.keyCode === KeyCode.Shift && this.teleport()
    evt.keyCode === KeyCode.Space && this.shoot()
    evt.keyCode === KeyCode.Enter && this.switchWeapons()
  }
  private setup() {
    let { UPDATE, DAMAGE, REMOVE, TOUCH_UP, TOUCH_LEFT, TOUCH_RIGHT, TOUCH_SHOOT, TOUCH_SWAP_WEAPON, TOUCH_TELEPORT } = this.events
    let o = this.observer

    this.clickedHandler = this.bindEvents.bind(this)
    document.addEventListener('keydown', this.clickedHandler, false)

    o.on(UPDATE, () => {
      this.updateTeleport()
      this.updateFlicker()
      if (this.velocity < this.minVelocity) {
        this.velocity = Math.max(this.minVelocity, this.velocity)
      }
    })
    o.on(DAMAGE, (m: Drawable) => {
      if (m instanceof Bullet) {
        o.emit(REMOVE, m)
      }
      if (this.invisibilityMode) return
      this.enterInvisiblityMode(1000)
      this.flicker(1000)
      this.updateHp(m)
    })

    o.on(TOUCH_UP, () => this.accelerate())
    o.on(TOUCH_LEFT, () => this.rotateLeft())
    o.on(TOUCH_RIGHT, () => this.rotateRight())
    o.on(TOUCH_TELEPORT, () => this.teleport())
    o.on(TOUCH_SHOOT, () => this.shoot())
    o.on(TOUCH_SWAP_WEAPON, () => this.switchWeapons())
  }
  private enterInvisiblityMode(duration: number) {
    this.invisibilityMode = true
    this.timeouts['invisibility'] && window.clearTimeout(this.timeouts['invisibility'])
    this.timeouts['invisibility'] = window.setTimeout(() => {
      this.invisibilityMode = false
    }, duration)
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
  private updateHp(m: Drawable) {
    let { HEALTH, MESSAGE } = this.events
    let o = this.observer
    this.hp -= m.damage
    this.hp = Math.max(0, this.hp)
    o.emit(HEALTH, this.hp)
    if (!this.hp) {
      this.unmount()
      o.emit(MESSAGE, 'game over, you failed the universe')
    }
  }
  private unmount() {
    let { REMOVE, DAMAGE } = this.events
    let o = this.observer

    o.emit(REMOVE, this, ...this.particles)
    o.off(DAMAGE)

    this.particles = []
    document.removeEventListener('keydown', this.clickedHandler, false)
  }
  private switchWeapons() {
    this.weapons++
    this.weapons = this.weapons % 2
  }
  private accelerate() {
    this.velocity = this.maxVelocity
  }
  private rotateLeft() {
    this.theta -= this.rotation
  }
  private rotateRight() {
    this.theta += this.rotation
  }
  private updateTeleport() {
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
  private teleport() {
    let { ADD } = this.events
    if (!this.particles.length) {
      this.particles = makeParticles(12, this.x, this.y)
      this.observer.emit(ADD, ...this.particles)
      this.x = Math2.random(0, this.boundX)
      this.y = Math2.random(0, this.boundY)
    }
  }
  private shoot() {
    switch (this.weapons) {
      case WeaponType.Bullet:
        this._shootBullet()
        break
      case WeaponType.Laser:
        this._shootLaser(1000)
        break
    }
  }
  private _shootBullet() {
    let { ADD } = this.events
    let o = this.observer

    if (this.bullets < 10) {
      let bullet = makeShipBullet(this.x, this.y, this.theta)
      let REMOVE_BULLET = `body:remove:${bullet.id}`

      o.emit(ADD, bullet)
      this.bullets++

      o.on(REMOVE_BULLET, (_m: Drawable) => {
        this.bullets--
        o.off(REMOVE_BULLET)
      })
    }
  }
  private _shootLaser(duration: number) {
    let { ADD, REMOVE } = this.events
    let o = this.observer

    if (this.lasers < 1) {
      let laser = makeLaser(o, this.id, this.x, this.y, this.theta, this.radius)
      let REMOVE_LASER = `body:remove:${laser.id}`

      o.emit(ADD, laser)
      this.lasers++

      o.on(REMOVE_LASER, (_m: Drawable) => {
        this.lasers--
        o.off(REMOVE_LASER)
      })

      window.setTimeout(() => {
        o.emit(REMOVE, laser)
      }, duration)
    }
  }
}

export class ShipFactory {
  makeShip(o: Observer, boundX: number, boundY: number): Drawable {
    return new Ship(o, boundX / 2, boundY / 2, boundX, boundY)
  }
  build(o: Observer, boundX: number, boundY: number): Drawable[] {
    let ship = this.makeShip(o, boundX / 2, boundY / 2)
    let healthBar = makeHealthBar(o, ship.id, 100)
    return [ship, healthBar]
  }
}
