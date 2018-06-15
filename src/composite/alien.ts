import Body from "../core/Body";
import Alien from "../drawable/alien";
import Teleportable, { TeleportState } from "../mixin/teleportable";
import Damageable, { HealthState } from "../mixin/damageable";
import Weaponizable, { WeaponState } from "../mixin/weaponizable";
import Particle from "../core/Particle";
import { Weapon } from '../core/weapon'
import { applyMixins } from "../utils/mixin";
import Math2 from "../utils/Math2";
import Observer from "../utils/Observer";

class CompositeAlien extends Body implements Alien, Damageable, Weaponizable, Teleportable {
  eyeX = 5;
  eyeY = 5;
  eyeTheta = 0;

  constructor(x: number, y: number, theta: number, velocity: number, radius: number, friction: number) {
    super()
    this.x = x
    this.y = y
    this.theta = theta
    this.velocity = velocity
    this.radius = radius
    this.friction = friction
    this._healthState = {
      x,
      y,
      hp: 100,
      maxHp: 100,
      isVisible: false
    }
    this._weaponState = {
      choice: -1,
      weapons: [],
      x,
      y,
      theta,
      observerTheta: 0
    }
    this._teleportState = {
      count: 12,
      particles: []
    }
    this._brain()

    this._observer = new Observer()
    this._observer.on('collide', (body: Body) => {
      // Show the health bar temporarily when damaged
      this._healthState.isVisible = true

      if (this._healthTimeout) {
        window.clearTimeout(this._healthTimeout)
      }
      this._healthTimeout = window.setTimeout(() => {
        this._healthState.isVisible = false
      }, 3000)
    })

    this._observer.on('damage', (damage: number) => {
      this._healthState.hp -= damage

      window.clearTimeout(this._healthTimeout)
    })
  }

  draw(ctx: CanvasRenderingContext2D) {
    this._drawAlien(ctx)
    this._drawTeleportable(ctx)
    this._drawWeapon(ctx)
    this._drawHealth(ctx)
  }
  update() {
    super.update()
    this._updateAlien()
    this._updateTeleportable()
    this._updateWeapon()
    this._updateHealth()
  }

  _brain() {
    window.setInterval(() => {
      this._teleport(this)
      this.x = Math2.random(0, window.innerWidth)
      this.y = Math2.random(0, window.innerWidth)
      this.theta = Math2.random(0, Math.PI * 2)
      this.velocity = 0

      // Shoot twice
      for (let i = 0; i < 2; i += 1) {
        window.setTimeout(() => {
          if (i === 0) {
            this.velocity = Math2.random(1, 3)
          }
          this.observerTheta = this.eyeTheta
          this._getWeapon().reload(this)
        }, 500 * i)
      }
    }, 3000)
  }

  // Alien
  _drawAlien(ctx: CanvasRenderingContext2D): void
  _updateAlien(): void

  // Health
  _healthState: HealthState;
  _drawHealth(ctx: CanvasRenderingContext2D): void
  _updateHealth() {
    // Set health bar to follow the ship
    this._healthState.x = this.x - 20
    this._healthState.y = this.y - 20
  }
  _healthColor(hpRatio: number): string
  _healthTimeout: number;
  get hp(): number {
    return this._healthState.hp
  }


  // Teleport
  _teleportState: TeleportState;
  _makeParticle(theta: number, x: number, y: number): Particle
  _makeParticles(count: number, x: number, y: number): Particle[]
  _teleport(body: Body): void
  _drawTeleportable(ctx: CanvasRenderingContext2D): void
  _updateTeleportable(): void

  // Weapon
  _weaponState: WeaponState
  _setWeapons(...weapons: Weapon[]): void
  setWeapons(...weapons: Weapon[]) {
    this._setWeapons(...weapons)
  }
  _getWeapon(): Weapon
  getWeapon(): Weapon {
    return this._getWeapon()
  }
  _swapWeapon(): void
  _drawWeapon(ctx: CanvasRenderingContext2D): void
  _updateWeapon(): void

  // Observer
  _observer: Observer;
  emit(event: string, ...params: any[]) {
    this._observer.emit(event, ...params)
  }
}


applyMixins(CompositeAlien, [Alien, Damageable, Weaponizable, Teleportable])

export default CompositeAlien