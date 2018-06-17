import { Boundary, Drawable, Presentable } from '../core/drawable'
import Math2 from '../utils/math2'

export class Particle extends Drawable {
  type: Presentable = Presentable.Circle;
  boundary: Boundary = Boundary.Bounded;
  constructor(x: number, y: number, theta: number, velocity: number) {
    super()
    this.x = x
    this.y = y
    this.theta = theta
    this.velocity = velocity
    this.radius = 2
    this.friction = 0.95
  }
}

export function makeParticles(count: number, posX: number, posY: number) {
  let radian = 2 * Math.PI / count
  return Array(count).fill(null).map((_, i) => {
    let theta = i * radian
    let spread = 20
    let x = posX + spread * Math.cos(theta)
    let y = posY + spread * Math.sin(theta)
    let velocity = -0.5
    return new Particle(x, y, theta, velocity)
  })
}

export class Spark extends Drawable {
  type: Presentable = Presentable.Circle;
  boundary: Boundary = Boundary.Bounded;
  constructor(x: number, y: number, theta: number, velocity: number) {
    super()
    this.x = x
    this.y = y
    this.theta = theta
    this.velocity = velocity
    this.radius = 2
    this.friction = 0.95
  }
}

export function makeSparks(count: number, posX: number, posY: number, startTheta: number) {
  let degree = Math.PI / count
  let spread = Math2.random(5, 10)
  return Array(count).fill(null).map((_, i) => {
    let theta = startTheta + (i * degree - Math.PI / 2)
    let x = posX + spread * Math.cos(theta)
    let y = posY + spread * Math.sin(theta)
    let velocity = 0.5
    return new Particle(x, y, theta, velocity)
  })
}
