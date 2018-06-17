import { Observer, ObserverEvents } from '../utils/observer'
import { Drawable, Presentable } from '../core/drawable'

export class HealthBar extends Drawable {
  type: Presentable = Presentable.HealthBar;
  private timeout: number;
  private events: ObserverEvents;
  constructor(o: Observer, private parentId: number, hp: number) {
    super()
    this.observer = o
    this.hp = hp
    this.maxHp = hp
    this.isVisible = false

    this.timeout = 0
    this.events = {
      UPDATE: `update:${this.parentId}`,
      HEALTH: `health:${this.parentId}`,
      REMOVE: 'body:remove'
    }

    this.setup()
  }
  private setup() {
    let { UPDATE, HEALTH, REMOVE } = this.events
    let o = this.observer

    o.on(UPDATE, (m: Drawable) => {
      this.x = m.x
      this.y = m.y
      this.velocity = m.velocity
      this.radius = m.radius
    })
    o.on(HEALTH, (hp: number) => {
      this.isVisible = true

      this.timeout && window.clearTimeout(this.timeout)
      this.timeout = window.setTimeout(() => {
        this.isVisible = false
      }, 3000)

      this.hp = hp
      if (!this.hp) {
        o.emit(REMOVE, this)
      }
    })
  }
}

export function makeHealthBar(o: Observer, parentId: number, hp: number): Drawable {
  return new HealthBar(o, parentId, hp)
}
