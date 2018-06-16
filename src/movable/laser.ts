import { Observer } from '../utils/observer'
import { Drawable, Presentable, Boundary } from '../core/drawable'

export class Laser extends Drawable {
  type: Presentable = Presentable.Laser;
  boundary: Boundary = Boundary.None;
  constructor(o: Observer, parentId: number, x: number, y: number, theta: number, radius: number) {
    super()
    this.x = x
    this.y = y
    this.theta = theta
    this.radius = radius
    this.observer = o
    this.observer.on(`update:${parentId}`, (m: Drawable) => {
      this.x = m.x
      this.y = m.y
      this.theta = m.theta
    })

    this.damage = 1
  }
}

export function makeLaser(o: Observer, parentId: number, x: number, y: number, theta: number, radius = 5): Drawable {
  return new Laser(o, parentId, x, y, theta, radius)
}