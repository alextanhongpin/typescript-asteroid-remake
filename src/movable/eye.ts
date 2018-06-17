import { Observer, ObserverEvents } from '../utils/observer'
import { Drawable, Presentable, checkAngle } from '../core/drawable'

export class Eye extends Drawable {
  type: Presentable = Presentable.Eye;
  private events: ObserverEvents;
  constructor(o: Observer, private parentId: number) {
    super()
    this.observer = o
    this.parentId = parentId

    this.events = {
      UPDATE: `update:${this.parentId}`,
      EYE: `eye:${this.parentId}`,
      HEALTH: `health:${this.parentId}`,
      REMOVE: 'body:remove'
    }

    this.setup()
  }
  private setup() {
    let { UPDATE, EYE, HEALTH, REMOVE } = this.events
    let o = this.observer

    o.on(UPDATE, (m: Drawable) => {
      this.x = m.x
      this.y = m.y
      this.velocity = m.velocity
    })
    o.on(EYE, (m: Drawable) => {
      this.theta = checkAngle(this, m)
    })
    o.on(HEALTH, (hp: number) => {
      if (!hp) {
        o.emit(REMOVE, this)
      }
    })
  }
}

export function makeEye(o: Observer, parentId: number): Drawable {
  return new Eye(o, parentId)
}
