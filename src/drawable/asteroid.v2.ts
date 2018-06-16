
import Observer from '../utils/observer'
import  { Metadata, Presentable } from '../core/metadata'
import Math2 from '../utils/math2'
import { makeHealthBar } from './makable'

export class Asteroid extends Metadata {
  type: Presentable = Presentable.Asteroid;
  constructor(o: Observer, x: number, y: number, theta: number, velocity: number, radius: number) {
    super()
    this.observer = o
    this.x = x
    this.y = y
    this.theta = theta
    this.velocity = velocity
    this.radius = radius
  }
}

export default class AsteroidFactory {
  makeAsteroid(o: Observer, boundX: number, boundY: number): Metadata {
    let x = Math2.random(0, boundX)
    let y = Math2.random(0, boundY)
    let theta = Math2.random(0, Math.PI * 2)
    let velocity = Math2.random(10, 20) / 10
    let radius = Math2.random(25, 35)
    return new Asteroid(o, x, y, theta, velocity, radius)
  }
  build(o: Observer, boundX: number, boundY: number): Metadata[] {
    let asteroid = this.makeAsteroid(o, boundX / 2, boundY / 2)
    let healthBar = makeHealthBar(o, asteroid.id)
    return [asteroid, healthBar]
  }
}
