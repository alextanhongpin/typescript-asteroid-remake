import Ship from "../composite/ship";
import BulletWeapon from "../core/bullet"
import { WeaponType } from "../core/weapon";
import LaserWeapon from "../core/laser";

export default class ShipFactory {
  makeShip(boundX: number, boundY: number) {
    let x = boundX / 2
    let y = boundY / 2
    let theta = 0
    let velocity = 0
    let radius = 15
    let friction = 0.95
    let hp = 100
    return new Ship(x, y, theta, velocity, radius, friction, hp)
  }
  makeBullet(): BulletWeapon {
    let count = 10
    let radius = 2
    let velocity = 5
    let duration = 7500
    return new BulletWeapon(WeaponType.Bullet, count, radius, velocity, duration)
  }
  makeLaser(): LaserWeapon {
    let count = 1
    let radius = 15
    let velocity = 0
    let duration = 500
    return new LaserWeapon(WeaponType.Laser, count, radius, velocity, duration)
  }
  build(boundX: number, boundY: number): Ship {
    let bullet = this.makeBullet()
    let laser = this.makeLaser()
    let ship = this.makeShip(boundX, boundY)
    ship.setWeapons(bullet, laser)
    return ship
  }
}
