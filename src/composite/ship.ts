// Mixins
import Damageable, { HealthState } from "../mixin/damageable";
import Weaponizable, { WeaponState } from '../mixin/weaponizable'
import Teleportable, { TeleportState } from '../mixin/teleportable'
import { applyMixins } from "../utils/mixin";

import Ship from "../drawable/ship";
import Body from "../core/body";
import { Weapon } from '../core/weapon'
import KeyCode from "../utils/keycode";
import Math2 from "../utils/math2";
import Particle from "../core/Particle";
import Observer from '../utils/observer'

class CompositeShip extends Body implements Ship, Damageable, Weaponizable, Teleportable {
  constructor(x: number, y: number, theta: number, velocity: number, radius: number, friction: number, hp: number) {
    super()
    this.x = x
    this.y = y
    this.theta = theta
    this.velocity = velocity
    this.radius = radius
    this.friction = friction
    this.alphaState = false
    this.alpha = 1
    this._healthState = {x, y, hp, maxHp: hp, isVisible: true}
    this._weaponState = {choice: -1, weapons: [], x, y, theta, observerTheta: 0}
    this._teleportState = {count: 12,particles: []}
    
    
    this._observer = new Observer()
    this._observer.on('collide', (_body: Body) => {
      if (this.isFlickering) {
        return
      }

      // Show the health bar temporarily when damaged
      this._healthState.isVisible = true

      if (this._healthTimeout) {
        window.clearTimeout(this._healthTimeout)
      }
      this._healthTimeout = window.setTimeout(() => {
        this._healthState.isVisible = false
      }, 3000)

      this.isFlickering = true
      if (this._flickeringTimeout) {
        window.clearTimeout(this._flickeringTimeout)
      }
      this._flickeringTimeout = window.setTimeout(() => {
        this.isFlickering = false
      }, 3000)
    })

    this._observer.on('damage', (damage: number) => {
      // Invisible period
      if (this.isFlickering) {
        return
      }
      this._healthState.hp -= damage
      window.clearTimeout(this._healthTimeout)
    })

    this._bindEvents()
  }
  update() {
    super.update()
    this._updateHealth()
    this._updateTeleportable()
    this._updateShip()

    this._weaponState.theta = this.theta
    this._weaponState.x = this.x
    this._weaponState.y = this.y
    this._updateWeapon()
  }
  private _bindEvents() {
    document.addEventListener('keydown', (evt) => {
      // Switch statement only limits to one keydown at a time, and can't execute combos
      if (evt.keyCode === KeyCode.Up) {
        this.velocity = 5
      }
      if (evt.keyCode === KeyCode.Left) {
        this.rotate(-Math2.degreeToTheta(10))
      }
      if (evt.keyCode === KeyCode.Right) {
        this.rotate(Math2.degreeToTheta(10))
      }
      if (evt.keyCode === KeyCode.Shift) {
        this._teleport(this)
      }
      if (evt.keyCode === KeyCode.Space) {
        this._getWeapon().reload(this)
      }
      if (evt.keyCode === KeyCode.Enter) {
        this._swapWeapon()
      }
    })
  }
  draw (ctx: CanvasRenderingContext2D): void {
    this._drawShip(ctx)
    this._drawWeapon(ctx)
    this._drawHealth(ctx)
    this._drawTeleportable(ctx)
  }

  // Health
  _healthState: HealthState
  _healthColor(hpRatio: number): () => string;
  _drawHealth(ctx: CanvasRenderingContext2D): () => void;
  _updateHealth() {
    this._healthState.x = this.x - 20
    this._healthState.y = this.y - 20
  }
  _healthTimeout: number;
  get hp(): number {
    return this._healthState.hp
  }

  // Ship
  isFlickering: boolean = false;
  _flickeringTimeout: number;
  alphaState: boolean;
  alpha: number;
  _drawShip(ctx: CanvasRenderingContext2D): () => void
  _updateShip(): void
  computeGlobalAlpha(isFlickering: boolean): void

  // Weapon
  _weaponState: WeaponState
  _setWeapons(...weapons: Weapon[]): () => void
  _getWeapon(): Weapon
  getWeapon(): Weapon {
    return this._getWeapon()
  }
  _swapWeapon(): () => void
  _drawWeapon(ctx: CanvasRenderingContext2D): () => void
  _updateWeapon(): () => void
  setWeapons(...weapons: Weapon[]) {
    this._setWeapons(...weapons)
  }

  // Teleport
  _teleportState: TeleportState;
  _teleport(body: Body): () => void
  _drawTeleportable(ctx: CanvasRenderingContext2D): () => void
  _updateTeleportable(): () => void
  _makeParticle(theta: number, x: number, y: number): Particle
  _makeParticles(count: number, x: number, y: number): Particle[]

  // Observer
  _observer: Observer;
  emit(event: string, ...params: any[]) {
    this._observer.emit(event, ...params)
  }
}

applyMixins(CompositeShip, [Ship, Weaponizable, Damageable, Teleportable])

export default CompositeShip