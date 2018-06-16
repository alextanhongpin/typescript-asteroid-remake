import KeyCode from '../utils/keycode'
import Math2 from '../utils/math2'
import { Observer } from '../utils/Observer'
import { Drawable, Engine, checkCollision, checkLaserCollision } from './drawable'
import { Alien } from '../movable/alien'
import { Ship } from '../movable/ship'
import { Asteroid } from '../movable/asteroid'
import { AlienBullet, ShipBullet } from '../movable/bullet'
import { Laser } from '../movable/laser'

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

type DrawableDictionary = { [index: number]: Drawable };
export default class Game {
  observer: Observer = new Observer();
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private requestId: number = -1;
  private isSetup: boolean = false;
  private engine: Engine;
  private drawables: DrawableDictionary = {};
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d')!
    this.engine = new Engine()
  }
  setup(): Game {
    if (this.isSetup) {
      return this
    }
    document.addEventListener('keydown', (evt) => {
      if (evt.keyCode === KeyCode.Pause) {
        this.pause()
      }
    })

    let o = this.observer
    o.on('bullet:add', (m: Drawable) => {
      this.drawables[m.id] = m
    })
    o.on('bullet:delete', (m: Drawable) => {
      if (this.drawables[m.id]) {
        delete this.drawables[m.id]
        o.emit(`bullet:delete:${m.id}`, true)
      } else {
        o.emit(`bullet:delete:${m.id}`, false)
      }
    })
    o.on('particles:add', (metas: Drawable[]) => {
      metas.forEach(m => {
        this.drawables[m.id] = m
      })
    })
    o.on('particles:delete', (metas: Drawable[]) => {
      metas.forEach(m => {
        delete this.drawables[m.id]
      })
    })
    o.on('body:remove', (id: number) => {
      delete this.drawables[id]
    })
    this.isSetup = true
    return this
  }
  setDrawables(...drawables: Drawable[]): Game {
    this.drawables = drawables.reduce((acc: DrawableDictionary, m: Drawable) => {
      acc[m.id] = m
      return acc
    }, {})
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
  draw() {
    let o = this.observer
    this.ctx.save()
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    let drawables = Object.entries(this.drawables)
    drawables.forEach(([_id, m1]: [string, Drawable]) => {
      this.engine.draw(this.ctx, m1)
      this.engine.update(m1, window.innerWidth, window.innerHeight, this.observer)

      drawables.forEach(([__id, m2]: [string, Drawable]) => {
        // Alien's eye will track the ship's movement
        if (m1 instanceof Ship && m2 instanceof Alien) {
          m1.observer.emit(`eye:${m2.id}`, m1)
        }

        // Left is the damager, right is the damagee
        if (m1 instanceof ShipBullet && m2 instanceof Asteroid) {
          if (checkCollision(m1, m2)) {
            m2.observer.emit(`damage:${m2.id}`, m1)
            o.emit('message', messages.attackAsteroid[Math2.random(0, messages.attackAsteroid.length)])
          }
        }

        if (m1 instanceof ShipBullet && m2 instanceof Alien) {
          if (checkCollision(m1, m2)) {
            m2.observer.emit(`damage:${m2.id}`, m1)
            o.emit('message', messages.attackAlien[Math2.random(0, messages.attackAlien.length)])
          }
        }
        if (m1 instanceof AlienBullet && m2 instanceof Ship) {
          if (checkCollision(m1, m2)) {
            m2.observer.emit(`damage:${m2.id}`, m1)
            o.emit('message', messages.alienAttack[Math2.random(0, messages.alienAttack.length)])
          }
        }

        if (m1 instanceof Asteroid && m2 instanceof Ship) {
          if (checkCollision(m1, m2)) {
            m2.observer.emit(`damage:${m2.id}`, m1)
            o.emit('message', messages.asteroidCollide[Math2.random(0, messages.asteroidCollide.length)])
          }
        }

        if (m1 instanceof Laser && (m2 instanceof Asteroid || m2 instanceof Alien)) {
          if (checkLaserCollision(m1, m2)) {
            m2.observer.emit(`damage:${m2.id}`, m1)
          }
        }
      })
    })
    this.requestId = window.requestAnimationFrame(this.draw.bind(this))
  }
}
