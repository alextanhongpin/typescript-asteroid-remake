import CanvasShape from '../interfaces/CanvasShape'

import Circle from './Circle'
import Vector from './Vector'
import Point from './Point'

class CircleFactory {
  makePoint(x: number, y: number): Point {
    return new Point(x, y)
  }
  makeVector(theta: number): Vector {
    return new Vector(theta)
  }
  build(x: number, y: number, theta: number, radius: number, isFill = false, velocity = 1): CanvasShape {
    const point = this.makePoint(x, y)
    const vector = this.makeVector(theta)
    vector.setVelocity(velocity)
    return new Circle(point, vector, radius, isFill)
  }
}

export default CircleFactory