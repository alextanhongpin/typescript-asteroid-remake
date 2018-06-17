import { Drawable, Presentable, Boundary } from '../core/drawable'

export class Bullet extends Drawable {
  type: Presentable = Presentable.Circle;
  boundary: Boundary = Boundary.Bounded;
  constructor(x: number, y: number, theta: number, velocity: number) {
    super()
    this.x = x
    this.y = y
    this.theta = theta
    this.velocity = velocity
    this.radius = 2
    this.damage = 5
  }
}

export class AlienBullet extends Bullet { }

export function makeAlienBullet(x: number, y: number, theta: number, radius = 5): Drawable {
  return new AlienBullet(x, y, theta, radius)
}

export class ShipBullet extends Bullet { }

export function makeShipBullet(x: number, y: number, theta: number, radius = 5): Drawable {
  return new ShipBullet(x, y, theta, radius)
}
