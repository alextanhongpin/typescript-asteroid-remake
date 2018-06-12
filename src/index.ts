import Game from "./core/Game";
import Ship from "./core/Ship";
import BulletWeapon from "./core/Bullet";
import LaserWeapon from "./core/Laser";
import { WeaponType } from "./core/Weapon";

'use strict';

(function () {
  let width = window.innerWidth
  let height = window.innerWidth

  let canvas = <HTMLCanvasElement>document.getElementById('canvas')
  canvas.width = width
  canvas.height = height

  let ship = new Ship(width / 2, height / 2, 0, 2, 15, 0.95)
  let bullet = new BulletWeapon(WeaponType.Bullet, 10, 2, 3, 7500)
  let laser = new LaserWeapon(WeaponType.Laser, 1, 15, 0, 500)
  ship.setWeapons(bullet, laser)

  let game = new Game(canvas)
  game
    .setup()
    .setBodies(ship)
    .start()
})()

