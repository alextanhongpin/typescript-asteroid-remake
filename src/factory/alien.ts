import Alien from "../composite/alien";
import BulletWeapon from "../core/bullet"
import { WeaponType } from "../core/weapon";
import Math2 from "../utils/Math2";

export default class AlienFactory {
  makeAlien(boundX: number, boundY: number) {
    let x = Math2.random(0, boundX)
    let y = Math2.random(0, boundY)
    let theta = Math2.random(0, Math.PI * 2)
    let velocity = 3
    let radius = 15
    let friction = 0
    return new Alien(x, y, theta, velocity, radius, friction)
  }
  makeBullet(): BulletWeapon {
    let count = 10
    let radius = 2
    let velocity = 5
    let duration = 7500
    return new BulletWeapon(WeaponType.Bullet, count, radius, velocity, duration)
  }
  makeAlienWithWeapons(boundX: number, boundY: number): Alien {
    let bullet = this.makeBullet()
    let alien = this.makeAlien(boundX, boundY)
    alien.setWeapons(bullet)
    return alien
  }
  build(boundX: number, boundY: number, count: number): Alien[] {
    return Array(count).fill(null).map(_ => this.makeAlienWithWeapons(boundX, boundY))
  }
}
