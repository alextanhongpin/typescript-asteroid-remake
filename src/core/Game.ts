import { DrawableDictionary, Drawable, Engine, checkCollision, checkLaserCollision, reduce } from './drawable'
import { Alien } from '../movable/alien'
import { AlienBullet, ShipBullet } from '../movable/bullet'
import { Asteroid } from '../movable/asteroid'
import { Laser } from '../movable/laser'
import { Ship } from '../movable/ship'
import KeyCode from '../utils/keycode'
import Math2 from '../utils/math2'
import { Observer, ObserverEvents } from '../utils/Observer'

let messages = {
  alienAttack: [
    'oopps, that must hurt real bad',
    'alien attack!!!',
    'you have been hit by a stray alien bullet, bzzz'
  ],
  asteroidCollide: [
    'a memorable day - you got hit by an asteroid',
    'armageddon!',
    'watch out!'
  ],
  attackAsteroid: [
    '...piu piu piu',
    'take that, stones!',
    'you rock!'
  ],
  attackAlien: [
    'oops, they seem angry',
    'go down, alien!',
    'for earth!'
  ]
}

export default class Game {
  private observer: Observer = new Observer();
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private requestId: number = -1;
  private isSetup: boolean = false;
  private engine: Engine;
  private drawables: DrawableDictionary = {};
  private events: ObserverEvents;
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d')!
    this.engine = new Engine()

    this.events = {
      ADD: 'body:add',
      REMOVE: 'body:remove',
      MESSAGE: 'message'
    }

    this.bindEvents()
  }
  private bindEvents() {
    document.addEventListener('keydown', (evt) => {
      if (evt.keyCode === KeyCode.Pause) {
        this.pause()
      }
    })
  }
  private _setup() {
    let { ADD, REMOVE } = this.events
    let o = this.observer

    o.on(ADD, (...drawables: Drawable[]) => {
      drawables.forEach(d => {
        this.drawables[d.id] = d
      })
    })

    o.on(REMOVE, (...drawables: Drawable[]) => {
      drawables.forEach(d => {
        let REMOVE_ID = `body:remove:${d.id}`

        if (this.drawables[d.id]) {
          delete this.drawables[d.id]
          o.emit(REMOVE_ID, true)
        } else {
          o.emit(REMOVE_ID, false)
        }
      })
    })
  }
  setup(): Game {
    if (!this.isSetup) {
      this._setup()
      this.isSetup = true
    }
    return this
  }
  setDrawables(...drawables: Drawable[]): Game {
    this.drawables = reduce(drawables)
    return this
  }
  setObserver(observer: Observer): Game {
    this.observer = observer
    return this
  }
  pause(): Game {
    this.requestId < 0 ? this.start() : this.stop()
    return this
  }
  start(): Game {
    this.draw()
    return this
  }
  stop(): Game {
    window.cancelAnimationFrame(this.requestId)
    this.requestId = -1
    return this
  }
  private draw() {
    this.ctx.save()
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this._draw()
    this.requestId = window.requestAnimationFrame(this.draw.bind(this))
  }
  private _draw() {
    let { MESSAGE } = this.events
    let { observer: o, engine: e, ctx } = this
    let { width, height } = this.canvas

    let drawables = Object.entries(this.drawables)
    if (drawables.length === 1 && drawables[0] instanceof Ship) {
      o.emit(MESSAGE, 'you saved the earth, again')
    }

    drawables.forEach(([id1, m1]: [string, Drawable]) => {
      e.draw(ctx, m1)
      e.update(m1, width, height, o)
      drawables.forEach(([id2, m2]: [string, Drawable]) => {
        if (id1 === id2) {
          return
        }
        this._checkCollision(o, m1, m2)
      })
    })
  }
  private _checkCollision(o: Observer, m1: Drawable, m2: Drawable) {
    let { MESSAGE } = this.events
    let DAMAGE = `damage:${m2.id}`
    let TRACK_EYE = `eye:${m2.id}`

    // Alien's eye will track the ship's movement
    if (m1 instanceof Ship && m2 instanceof Alien) {
      o.emit(TRACK_EYE, m1)
    }
    // Left is the damager, right is the damagee
    if (m1 instanceof ShipBullet && m2 instanceof Asteroid) {
      if (checkCollision(m1, m2)) {
        o.emit(DAMAGE, m1)
        o.emit(MESSAGE, messages.attackAsteroid[Math2.random(0, messages.attackAsteroid.length)])
      }
    }
    if (m1 instanceof ShipBullet && m2 instanceof Alien) {
      if (checkCollision(m1, m2)) {
        o.emit(DAMAGE, m1)
        o.emit(MESSAGE, messages.attackAlien[Math2.random(0, messages.attackAlien.length)])
      }
    }
    if (m1 instanceof AlienBullet && m2 instanceof Ship) {
      if (checkCollision(m1, m2)) {
        o.emit(DAMAGE, m1)
        o.emit(MESSAGE, messages.alienAttack[Math2.random(0, messages.alienAttack.length)])
      }
    }
    if (m1 instanceof Asteroid && m2 instanceof Ship) {
      if (checkCollision(m1, m2)) {
        o.emit(DAMAGE, m1)
        o.emit(MESSAGE, messages.asteroidCollide[Math2.random(0, messages.asteroidCollide.length)])
      }
    }
    if (m1 instanceof Laser && (m2 instanceof Asteroid || m2 instanceof Alien)) {
      if (checkLaserCollision(m1, m2)) {
        o.emit(DAMAGE, m1)
      }
    }
  }
}
