import Point from './Point';
import Vector from './Vector';
import WeaponEnum from './WeaponEnum';
import CanvasShape from '../interfaces/CanvasShape';
import Weapon from '../interfaces/Weapon';

class LaserAmmo implements CanvasShape {
  private point: Point;
  private vector: Vector;
  constructor(point: Point, vector: Vector) {
    this.point = point
    this.vector = vector
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.beginPath()
    ctx.translate(this.point.getX(), this.point.getY())
    let thetaX = Math.cos(this.vector.getTheta())
    let thetaY = Math.sin(this.vector.getTheta())
    ctx.moveTo(
      thetaX * 15, // Hardcoded ship-dimensions
      thetaY * 15,
    )
    ctx.lineTo(
      thetaX * window.innerWidth, 
      thetaY * window.innerHeight
    )
    ctx.strokeStyle = 'red'
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.closePath()
    ctx.restore()
  }
  update() {
    this.point.setX(this.point.getX() + this.vector.getX())
    this.point.setY(this.point.getY() + this.vector.getY())
  }
}

class Laser implements Weapon {
  type: WeaponEnum;
  ammos: CanvasShape[];
  constructor(type: WeaponEnum) {
    this.type = type
    this.ammos = []
  }
  getType (): WeaponEnum {
    return this.type
  }
  fire (point: Point, vector: Vector) {
    if (!this.ammos.length) {
      this.ammos.push(new LaserAmmo(point, vector))
      window.setTimeout(() => {
        this.clear()
      }, 500)
    }
  }
  clear() {
    this.ammos = []
  }
  draw (ctx: CanvasRenderingContext2D) {
    this.ammos.forEach(ammo => ammo.draw(ctx))
  }
  update () {
    this.ammos.forEach(ammo => ammo.update())
  }
}

export default Laser