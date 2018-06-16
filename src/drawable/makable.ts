
import Observer from '../utils/observer'
import  { Metadata, Presentable, Boundary } from '../core/metadata'
import Math2 from '../utils/math2'


export class Bullet extends Metadata {
  type: Presentable = Presentable.Circle;
  boundary: Boundary = Boundary.Bounded;
  constructor(x: number, y: number, theta: number, velocity: number) {
    super()
    this.x = x
    this.y = y
    this.theta = theta
    this.velocity = velocity
    this.radius = 2
  }
}

export function makeBullet(x: number, y: number, theta: number, radius = 5): Metadata {
  return new Bullet(x, y, theta, radius)
}

export class Laser extends Metadata {
  type: Presentable = Presentable.Laser;
  boundary: Boundary = Boundary.None;
  constructor(o: Observer, parentId: number, x: number, y: number, theta: number, radius: number) {
    super()
    this.x = x
    this.y = y
    this.theta = theta
    this.radius = radius
    this.observer = o
    this.observer.on(`update:${parentId}`, (m: Metadata) => {
      this.x = m.x
      this.y = m.y
      this.theta = m.theta
    })
  }
}

export function makeLaser(o: Observer, parentId: number, x: number, y: number, theta: number, radius = 5): Metadata {
  return new Laser(o, parentId, x, y, theta, radius)
}

export class Particle extends Metadata {
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

export function makeParticles (count: number, posX: number, posY: number) {
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

export function makeObserver(): Observer {
  return new Observer()
}

export class Eye extends Metadata {
  type: Presentable = Presentable.Eye;
  constructor(o: Observer, parentId: number) {
    super()
    this.observer = o
    this.observer.on(`update:${parentId}`, (m: Metadata) => {
      this.x = m.x
      this.y = m.y
      this.theta = 0
      this.velocity = m.velocity
    })
  }
}

export function makeEye(o: Observer, parentId: number): Metadata {
  return new Eye(o, parentId)
}


export class HealthBar extends Metadata {
  type: Presentable = Presentable.HealthBar;
  hp: number = 100;
  maxHp: number = 100;
  constructor(o: Observer, parentId: number) {
    super()
    this.observer = o
    this.observer.on(`update:${parentId}`, (m: Metadata) => {
      this.x = m.x
      this.y = m.y
      this.velocity = m.velocity
      this.radius = m.radius
    })
  }
}

export function makeHealthBar(o: Observer, parentId: number): Metadata {
  return new HealthBar(o, parentId)
}