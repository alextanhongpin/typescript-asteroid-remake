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
  let degree = 360 / count
  return Array(count).fill(null).map((_, i) => {
    let theta = Math2.degreeToTheta(i * degree)
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
  let degree = 180 / count
  let spread = Math2.random(5, 10)
  return Array(count).fill(null).map((_, i) => {
    let theta = Math2.degreeToTheta(i * degree - 90) + startTheta
    let x = posX + Math.cos(theta) * spread
    let y = posY + Math.sin(theta) * spread
    let velocity = 0.5
    return new Particle(x, y, theta, velocity)
  })
}