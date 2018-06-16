import { Observer } from '../utils/observer'
import { Drawable, Presentable } from '../core/drawable'

export class HealthBar extends Drawable {
  type: Presentable = Presentable.HealthBar;
  private visibleTimeout: number = 0;
  constructor(o: Observer, private parentId: number, hp: number) {
    super()
    this.observer = o
    this.hp = hp
    this.maxHp = hp
    this.isVisible = false
    this.setup()
  }
  setup() {
    let o = this.observer
    o.on(`update:${this.parentId}`, (m: Drawable) => {
      this.x = m.x
      this.y = m.y
      this.velocity = m.velocity
      this.radius = m.radius
    })

    o.on(`health:${this.parentId}`, (hp: number) => {
      this.isVisible = true
      if (this.visibleTimeout) {
        window.clearTimeout(this.visibleTimeout)
      }
      this.visibleTimeout = window.setTimeout(() => {
        this.isVisible = false
      }, 3000)
      this.hp = hp
      if (!this.hp) {
        o.emit('body:remove', this.id)
      }
    })
  }
}

export function makeHealthBar(o: Observer, parentId: number, hp: number): Drawable {
  return new HealthBar(o, parentId, hp)
}
