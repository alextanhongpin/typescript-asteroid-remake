import KeyCode from "../utils/KeyCode";
import Body from "./Body";
import Asteroid from "./Asteroid";
import Ship from "./Ship";
import { WeaponType } from "./Weapon";
import Alien from "./Alien";
import Observer from "../utils/Observer";
import Math2 from "../utils/Math2";


let alientAttackMessages = [
  'oopps, that must hurt real bad',
  'alien attack!!!',
  'you have been hit by a stray alien bullet, bzzz'
]

let asteroidMessages = [
  'a memorable day - you got hit by an asteroid',
  'armageddon!',
  'watch out!'
]

class Game {
  private observer?: Observer
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private requestId: number;
  private isSetup: boolean;
  private bodies: { [id: number]: Body };
  private cache: { [id: string]: number }
  private showHealthBarDuration: number;
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d')!
    this.requestId = -1
    this.isSetup = false
    this.bodies = {}
    this.cache = {}
    this.showHealthBarDuration = 3000
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
    this.isSetup = true
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
    this.ctx.save()
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    if (Object.values(this.bodies).length === 1 && this.bodies[0] instanceof Ship) {
      this.observer!.emit('message', 'you saved the universe again! well done!')
    }

    Object.entries(this.bodies).forEach(([id, body]: [string, Body]) => {
      body.draw(this.ctx)
      body.update()

      if (body instanceof Asteroid) {
        let asteroid: Asteroid = body
        Object.entries(this.bodies).forEach(([_, body2]: [string, Body]) => {
          if (body2 instanceof Ship) {
            let ship = body2
            let weapon = ship.getWeapon()

            // Check if the asteroid is hit by the weapons
            if (weapon.type === WeaponType.Bullet) {
              Object.entries(ship.getWeapon().ammos).forEach(([ammoId, ammo]: [string, Body]) => {
                if (ammo.collision(asteroid)) {
                  // Deduct hp
                  asteroid.hp -= weapon.damage

                  // Remove the weapon
                  delete ship.getWeapon().ammos[Number(ammoId)]

                  // Setup the spark effect when the bullet hits the asteroid's surface
                  ammo.observerTheta = Math.atan2(ammo.y - asteroid.y, ammo.x - asteroid.x)
                  asteroid.effect!.setup(ammo)

                  // Show the health bar temporarily when damaged
                  asteroid.healthBar!.isVisible = true

                  // Prevent the health bar from 'flickering' when multiple bullets hits the asteroid
                  let cacheId = `bullet:${ammoId}`
                  if (this.cache[cacheId]) {
                    window.clearTimeout(this.cache[cacheId])
                  }
                  this.cache[cacheId] = window.setTimeout(() => {
                    asteroid.healthBar!.isVisible = false
                  }, this.showHealthBarDuration)

                  // Asteroid is destroyed completely when hp drops below 0
                  // and is removed from the game
                  if (asteroid.hp < 0) {
                    delete this.bodies[Number(id)]
                    window.clearTimeout(this.cache[cacheId])
                    delete this.cache[cacheId]
                  }
                }
              })
            }
          }
        })
      }

      if (body instanceof Alien) {
        let alien: Alien = body
        Object.entries(this.bodies).forEach(([_, body2]: [string, Body]) => {
          if (body2 instanceof Ship) {
            let ship = body2
            let weapon = ship.getWeapon()

            // Check if the asteroid is hit by the weapons
            if (weapon.type === WeaponType.Bullet) {
              Object.entries(ship.getWeapon().ammos).forEach(([ammoId, ammo]: [string, Body]) => {
                if (ammo.collision(alien)) {
                  // Deduct hp
                  alien.hp -= weapon.damage

                  // Remove the weapon
                  delete ship.getWeapon().ammos[Number(ammoId)]

                  // Show the health bar temporarily when damaged
                  alien.healthBar!.isVisible = true

                  // Prevent the health bar from 'flickering' when multiple bullets hits the asteroid
                  let cacheId = `ship:bullet:${ammoId}`
                  if (this.cache[cacheId]) {
                    window.clearTimeout(this.cache[cacheId])
                  }
                  this.cache[cacheId] = window.setTimeout(() => {
                    alien.healthBar!.isVisible = false
                  }, this.showHealthBarDuration)

                  // Asteroid is destroyed completely when hp drops below 0
                  // and is removed from the game
                  if (alien.hp < 0) {
                    delete this.bodies[Number(id)]
                    window.clearTimeout(this.cache[cacheId])
                    delete this.cache[cacheId]
                  }
                }
              })
            }
          }
        })
      }

      // Check ship collision with the Asteroid
      if (body instanceof Ship) {
        let ship = body
        if (!this.cache['invisibility']) {
          Object.entries(this.bodies).forEach(([_, body2]: [string, Body]) => {
            if (body2 instanceof Asteroid) {
              let asteroid = body2
              if (body.collision(asteroid)) {
                ship.hp--

                this.observer!.emit('message', asteroidMessages[Math2.random(0, asteroidMessages.length - 1)])

                // Ship will flicked when damaged
                ship.isFlickering = true

                // Remove flickering after a certain period of time
                this.cache['invisibility'] = window.setTimeout(() => {
                  ship.isFlickering = false
                  window.clearTimeout(this.cache['invisibility'])
                  delete this.cache['invisibility']
                }, 3000)

                ship.healthBar!.isVisible = true
                let cacheId = 'ship'
                if (this.cache[cacheId]) {
                  window.clearTimeout(this.cache[cacheId])
                }
                this.cache[cacheId] = window.setTimeout(() => {
                  ship.healthBar!.isVisible = false
                }, this.showHealthBarDuration)

                if (ship.hp < 0) {
                  this.observer!.emit('message', 'game over')
                  delete this.bodies[Number(id)]
                  window.clearTimeout(this.cache[cacheId])
                  delete this.cache[cacheId]
                }
              }
            }

            if (body2 instanceof Alien) {
              let alien = body2
              alien.eyeTheta = Math.atan2(body.y - alien.y, body.x - alien.x)
              let weapon = alien.getWeapon()

              // Check if the ship is hit by alien weapons
              Object.entries(alien.getWeapon().ammos).forEach(([ammoId, ammo]: [string, Body]) => {
                if (ammo.collision(ship)) {
                  // Deduct hp
                  ship.hp -= weapon.damage

                  // Ship will flicked when damaged
                  ship.isFlickering = true

                  this.observer!.emit('message', alientAttackMessages[Math2.random(0, alientAttackMessages.length - 1)])

                  // Remove flickering after a certain period of time
                  this.cache['invisibility'] = window.setTimeout(() => {
                    ship.isFlickering = false
                    window.clearTimeout(this.cache['invisibility'])
                    delete this.cache['invisibility']
                  }, 3000)

                  // Remove the weapon
                  delete alien.getWeapon().ammos[Number(ammoId)]

                  // Show the health bar temporarily when damaged
                  ship.healthBar!.isVisible = true

                  // Prevent the health bar from 'flickering' when multiple bullets hits the asteroid
                  let cacheId = `alien:bullet:${ammoId}`
                  if (this.cache[cacheId]) {
                    window.clearTimeout(this.cache[cacheId])
                  }
                  this.cache[cacheId] = window.setTimeout(() => {
                    ship.healthBar!.isVisible = false
                  }, this.showHealthBarDuration)

                  // Ship is destroyed completely when hp drops below 0
                  // and is removed from the game
                  if (ship.hp < 0) {
                    this.observer!.emit('message', 'game over')
                    delete this.bodies[Number(id)]
                    window.clearTimeout(this.cache[cacheId])
                    delete this.cache[cacheId]
                  }
                }
              })
            }
          })
        }
      }
    })
    this.requestId = window.requestAnimationFrame(this.draw.bind(this))
  }
  restart() {
    throw new Error('not implemented')
  }
  setBodies(...bodies: Body[]): Game {
    this.bodies = bodies.reduce((acc: { [id: number]: Body }, body: Body, i: number) => {
      body.setObserver(this.observer!)
      acc[i] = body
      return acc
    }, {})
    return this
  }
  setObserver(o: Observer): Game {
    this.observer = o
    return this
  }
}

export default Game