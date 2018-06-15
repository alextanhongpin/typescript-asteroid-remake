import Asteroid from "../composite/asteroid"
import Math2 from "../utils/Math2";

export default class AsteroidFactory {
  makeAsteroid(boundX: number, boundY: number) {
    let x = Math2.random(0, boundX)
    let y = Math2.random(0, boundY)
    let theta = Math2.random(0, Math.PI * 2)
    let velocity = Math2.random(5, 10) / 10
    let radius = Math2.random(20, 30)
    let friction = 1
    let hp = Math2.random(30, 50)
    return new Asteroid(x, y, theta, velocity, radius, friction, hp)
  }
  build(boundX: number, boundY: number, count: number): Asteroid[] {
    return Array(count).fill(null).map(_ => this.makeAsteroid(boundX, boundY))
  }
}
