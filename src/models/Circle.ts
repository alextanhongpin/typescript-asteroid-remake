import CanvasShape from '../interfaces/CanvasShape'

import Point from './Point'
import Vector from './Vector'

class Circle implements CanvasShape {
  private point: Point;
  private vector: Vector;
  private radius: number;
  private isFill: boolean;
  
  constructor(point: Point, vector: Vector, radius: number, isFill = false) {
    this.point = point
    this.vector = vector
    this.radius = radius
    this.isFill = isFill
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.beginPath()
    ctx.translate(this.point.getX(), this.point.getY())
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2, false)

    if (this.isFill) {
      ctx.fillStyle = 'white'
      ctx.fill()
    } else {
      ctx.strokeStyle = 'white'
      ctx.stroke()
    }

    ctx.closePath()
    ctx.restore()
  }

  update() {
    this.point.setX(this.point.getX() + this.vector.getX())
    this.point.setY(this.point.getY() + this.vector.getY())
  }
}

export default Circle