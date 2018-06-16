import { Observer } from '../utils/observer'
import { Drawable, Presentable } from '../core/drawable'
import Math2 from '../utils/math2'

export class Eye extends Drawable {
  type: Presentable = Presentable.Eye;
  constructor(o: Observer, private parentId: number) {
    super()
    this.observer = o
    this.parentId = parentId
    this.setup()
  }
  setup() {
    let o = this.observer
    o.on(`update:${this.parentId}`, (m: Drawable) => {
      this.x = m.x
      this.y = m.y
      this.velocity = m.velocity
    })
    o.on(`eye:${this.parentId}`, (m: Drawable) => {
      this.theta = Math2.angle(this.x, this.y, m.x, m.y)
    })

    o.on(`health:${this.parentId}`, (hp: number) => {
      if (!hp) {
        o.emit('body:remove', this.id)
      }
    })
  }
}

export function makeEye(o: Observer, parentId: number): Drawable {
  return new Eye(o, parentId)
}