import Point from './Point';
import Vector from './Vector';
import WeaponEnum from './WeaponEnum';
import CanvasShape from '../interfaces/CanvasShape';
import Weapon from '../interfaces/Weapon';
import CircleFactory from './CircleFactory';

class BulletAmmo implements CanvasShape {
  private shape: CanvasShape;
  constructor(shape: CanvasShape) {
    this.shape = shape
  }
  draw(ctx: CanvasRenderingContext2D) {
    this.shape.draw(ctx)
  }
  update() {
    this.shape.update()
  }
}

class Bullet implements Weapon {
  type: WeaponEnum;
  ammos: CanvasShape[];
  factory: CircleFactory;
  // private bulletTimeout: number|null;
  private ammoCount: number;
  private ammoTimeout: number;
  private bulletRadius: number;
  private bulletVelocity: number;
  constructor(type: WeaponEnum, factory: CircleFactory) {
    this.type = type
    this.ammos = []
    this.factory = factory
    // this.bulletTimeout = null
    this.ammoCount = 10
    this.ammoTimeout = 7500
    this.bulletRadius = 2
    this.bulletVelocity = 2
  }
  getType (): WeaponEnum {
    return this.type
  }
  fire (point: Point, vector: Vector) {
    if (this.ammos.length < this.ammoCount) {
      let bullet = this.factory.build(
        point.getX(), 
        point.getY(), 
        vector.getTheta(), 
        this.bulletRadius, 
        true, 
        this.bulletVelocity
      )
      this.ammos.push(new BulletAmmo(bullet))
      window.setTimeout(() => {
        this.ammos.shift()
      }, this.ammoTimeout)
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

export default Bullet