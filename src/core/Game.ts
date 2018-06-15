import KeyCode from "../utils/keycode";
import Body from "./body";
import Asteroid from "../composite/asteroid"
import Ship from "../composite/ship"
import Alien from "../composite/alien"
import { WeaponType, Weapon } from "./weapon";
import Observer from "../utils/Observer";
import Math2 from '../utils/math2'

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

let shootAsteroidMessages = [
  'piu piu piu',
  'take that, stones!',
  'you rock'
]


export default class Game {
  private observer: Observer = new Observer();
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private requestId: number = -1;
  private isSetup: boolean = false;
  private bodies: { [id: number]: Body } = {};
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d')!
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
  _shipWeaponAndAsteroidCollision(weapon: Weapon, asteroid: Asteroid, asteroidId: string) {
    // Check if the asteroid is hit by the ship's weapon
    Object.entries(weapon.ammos).forEach(([ammoId, ammo]: [string, Body]) => {
      if (weapon.type === WeaponType.Bullet) {
        if (ammo.collision(asteroid)) {
          // Deduct hp
          asteroid.emit('damage', weapon.damage)
          // Remove the weapon
          delete weapon.ammos[Number(ammoId)]

          // Setup the spark effect when the bullet hits the asteroid's surface
          ammo.observerTheta = Math.atan2(ammo.y - asteroid.y, ammo.x - asteroid.x)
          asteroid.emit('collide', ammo, weapon.type)

          this.observer.emit('message', shootAsteroidMessages[Math2.random(0, shootAsteroidMessages.length - 1)])

          // Asteroid is destroyed completely when hp drops below 0
          // and is removed from the game
          if (asteroid.hp < 0) {
            delete this.bodies[Number(asteroidId)]
          }
        }
      } else if (weapon.type === WeaponType.Laser) {
        let laserY = (asteroid.x - ammo.x) * Math.tan(ammo.theta)
        if (Math.abs(ammo.y + laserY - asteroid.y) < asteroid.radius) {
          asteroid.emit('damage', weapon.damage)
          asteroid.emit('collide', ammo)
          if (asteroid.hp < 0) {
            delete this.bodies[Number(asteroidId)]
          }
        }
      }
    })
  }
  _shipAndAsteroidCollision(asteroid: Asteroid, ship: Ship, shipId: string) {
    if (asteroid.collision(ship)) {
      ship.emit('damage', asteroid.damage)
      ship.emit('collide', asteroid)
      this.observer.emit('message', asteroidMessages[Math2.random(0, asteroidMessages.length - 1)])
      if (ship.hp < 0) {
        delete this.bodies[Number(shipId)]
        this.observer.emit('message', 'game over')
      }
    }
  }
  _shipWeaponAndAlienCollision(weapon: Weapon, alien: Alien, alienId: string) {
    // Check if alien is hit by the ship's weapon
    Object.entries(weapon.ammos).forEach(([ammoId, ammo]: [string, Body]) => {
      if (weapon.type === WeaponType.Bullet) {
        if (ammo.collision(alien)) {
          // Deduct hp
          alien.emit('damage', weapon.damage)

          // Remove the weapon
          delete weapon.ammos[Number(ammoId)]
          
          alien.emit('collide', ammo)

          // Alien is destroyed completely when hp drops below 0
          // and is removed from the game
          if (alien.hp < 0) {
            delete this.bodies[Number(alienId)]
            this.observer.emit('message', 'you kill an alien, you are awesome!')
          }
        }
      } else if (weapon.type === WeaponType.Laser) {
        let laserY = (alien.x - ammo.x) * Math.tan(ammo.theta)
        if (Math.abs(ammo.y + laserY - alien.y) < alien.radius) {
          alien.emit('damage', weapon.damage)
          alien.emit('collide', ammo)
          if (alien.hp < 0) {
            delete this.bodies[Number(alienId)]
            this.observer.emit('message', 'down you go, alien!')
          }
        }
      }
    })
  }

  _alienWeaponAndShipCollision(weapon: Weapon, ship: Ship, shipId: string) {
    Object.entries(weapon.ammos).forEach(([ammoId, ammo]: [string, Body]) => {
      if (ammo.collision(ship)) {
        // Deduct hp
        ship.emit('damage', weapon.damage)

        // Remove the weapon
        delete weapon.ammos[Number(ammoId)]

        ship.emit('collide', ammo)

        this.observer.emit('message', alientAttackMessages[Math2.random(0, alientAttackMessages.length - 1)])

        // Asteroid is destroyed completely when hp drops below 0
        // and is removed from the game
        if (ship.hp < 0) {
          delete this.bodies[Number(shipId)]
          this.observer.emit('message', 'game over')
        }
      }
    })
  }
  _checkCollision(ship: Ship, shipId: string) {
    let weapon: Weapon = ship.getWeapon()

    Object.entries(this.bodies).forEach(([id, body]: [string, Body]) => {
      if (body instanceof Asteroid) {
        let asteroidId = id
        let asteroid: Asteroid = body
        this._shipWeaponAndAsteroidCollision(weapon, asteroid, asteroidId)
        this._shipAndAsteroidCollision(asteroid, ship, shipId)
      }
    
      if (body instanceof Alien) {
        let alienId = id
        let alien = body

        // Alien's eye will track the ship's movement
        alien.eyeTheta = Math.atan2(ship.y - alien.y, ship.x - alien.x)
    
        this._shipWeaponAndAlienCollision(weapon, alien, alienId)
        this._alienWeaponAndShipCollision(alien.getWeapon(), ship, shipId)
      }
    })
  }
  draw() {
    this.ctx.save()
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    if (Object.values(this.bodies).length === 1 && this.bodies[0] instanceof Ship) {
      this.observer.emit('message', 'you saved the universe again! well done!')
    }
    let bodies = Object.entries(this.bodies)
    bodies.forEach(([id, body]: [string, Body]) => {
      body.draw(this.ctx)
      body.update()
      if (body instanceof Ship) {
        this._checkCollision(body, id)
      }
    })
    this.requestId = window.requestAnimationFrame(this.draw.bind(this))
  }
  restart() {
    throw new Error('not implemented')
  }
  setBodies(...bodies: Body[]): Game {
    this.bodies = bodies.reduce((acc: { [id: number]: Body }, body: Body, i: number) => {
      acc[i] = body
      return acc
    }, {})
    return this
  }
  setObserver(observer: Observer): Game {
    this.observer = observer
    return this
  }
}
