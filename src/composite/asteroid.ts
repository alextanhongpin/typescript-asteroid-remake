// Mixins
import Damageable, { HealthState } from "../mixin/damageable";
import { applyMixins } from "../utils/mixin";

import Asteroid from "../drawable/asteroid";
import Body from "../core/body";
import Spark from "../core/Spark";
import Observer from "../utils/Observer";

class CompositeAsteroid extends Body implements Damageable, Asteroid {
  constructor(x: number, y: number, theta: number, velocity: number, radius: number, friction: number, hp: number) {
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
      hp,
      maxHp: hp,
      isVisible: false
    }
    this._effect = new Spark(6)
    this._observer = new Observer()
    this._observer.on('collide', (body: Body) => {
      // Setup spark effect
      this._effect.setup(body)

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

  update() {
    super.update()
    this._updateAsteroid()
    this._updateHealth()
  }
  draw(ctx: CanvasRenderingContext2D) {
    this._drawAsteroid(ctx)
    this._drawHealth(ctx)
  }

  // Health
  _healthState: HealthState
  _healthColor(hpRatio: number): string
  _drawHealth(ctx: CanvasRenderingContext2D): () => void
  _updateHealth() {
    // Set health bar to follow the ship
    this._healthState.x = this.x - 20
    this._healthState.y = this.y - 20
  }
  _healthTimeout: number
  get hp(): number {
    return this._healthState.hp
  }

  // Asteroid
  _drawAsteroid(ctx: CanvasRenderingContext2D): () => void
  _updateAsteroid(): void

  // Effect
  _effect: Spark;
  _drawEffect(ctx: CanvasRenderingContext2D) {
    this._effect.draw(ctx)
  }
  _updateEffect() {
    this._effect.update()
  }

  // Observer
  _observer: Observer
  emit(event: string, ...params: any[]) {
    this._observer.emit(event, ...params)
  }

  // Additional
  get damage(): number {
    return Math.floor(this.radius / 2)
  }
}

applyMixins(CompositeAsteroid, [Damageable, Asteroid])


export default CompositeAsteroid