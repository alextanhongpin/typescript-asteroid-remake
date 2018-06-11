import Vector from './Vector'

class Point {
  private x: number;
  private y: number;
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
  distance(point: Point): number {
    let x = this.x - point.x
    let y = this.y - point.y
    return Math.sqrt(x + y)
  }
  move(vector: Vector) {
    this.x += vector.getX()
    this.y += vector.getY()
  }
  getX(): number {
    return this.x
  }
  getY(): number {
    return this.y
  }
  setX(x: number) {
    if (this.x > window.innerWidth) {
      this.x = 0
    } else if (this.x < 0) {
      this.x = window.innerWidth
    } else {
      this.x = x
    }
  }
  setY(y: number) {
    if (this.y > window.innerHeight) {
      this.y = 0
    } else if (this.y < 0) {
      this.y = window.innerHeight
    } else {
      this.y = y
    }
  }
}

export default Point