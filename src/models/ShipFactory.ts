import CanvasShape from '../interfaces/CanvasShape'

import Vector from './Vector'
import Point from './Point'
import Ship from './Ship';
import Weapon from '../interfaces/Weapon';
import Laser from './Laser';
import WeaponEnum from './WeaponEnum';
import Bullet from './Bullet';
import CircleFactory from './CircleFactory';

class ShipFactory {
  makePoint(x: number, y: number): Point {
    return new Point(x, y)
  }
  makeVector(theta: number): Vector {
    let vector = new Vector(theta)
    vector.setVelocity(0)
    vector.setFriction(0.95)
    return vector
  }
  makeLaser(): Weapon {
    return new Laser(WeaponEnum.Laser)
  }
  makeBullet(): Bullet {
    return new Bullet(WeaponEnum.Bullets, new CircleFactory())
  }
  build(x: number, y: number, theta: number): CanvasShape {
    let point = this.makePoint(x, y)
    let vector = this.makeVector(theta)
    let laser = this.makeLaser()
    let bullet = this.makeBullet()
    let ship = new Ship(point, vector)
    ship.setWeapons(bullet, laser)
    return ship
  }
}

export default ShipFactory