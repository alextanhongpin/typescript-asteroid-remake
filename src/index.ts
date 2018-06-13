import Game from "./core/Game";
import Ship from "./core/Ship";
import BulletWeapon from "./core/Bullet";
import LaserWeapon from "./core/Laser";
import { WeaponType } from "./core/Weapon";
import Asteroid from "./core/Asteroid";
import Effect from "./core/Effect";
import HealthBar from "./core/HealthBar";
import Alien from "./core/Alien";
import Spark from "./core/Spark";

import Math2 from "./utils/Math2";
import Observer from './utils/Observer'

'use strict';

(function () {
  let width = window.innerWidth
  let height = window.innerHeight

  let InfoView = document.getElementById('info')

  let messageTimeout: number
  let observer = new Observer()
  observer.on('message', (msg: string) => {
    InfoView!.innerHTML = msg
    if (messageTimeout) {
      window.clearTimeout(messageTimeout)
    }
    messageTimeout = window.setTimeout(() => {
      InfoView!.innerHTML = ''
    }, 3000)
  })

  let canvas = <HTMLCanvasElement>document.getElementById('canvas')
  canvas.width = width
  canvas.height = height

  let bullet = new BulletWeapon(WeaponType.Bullet, 10, 2, 3, 7500)
  let laser = new LaserWeapon(WeaponType.Laser, 1, 15, 0, 500)
  let effect = new Effect(12)
  let healthBar = new HealthBar(10, 10, 0, 0, 0, 0, 100)
  let ship = new Ship(width / 2, height / 2, 0, 2, 15, 0.95, 100)

  ship
    .setWeapons(bullet, laser)
    .setEffect(effect)
    .setHealthBar(healthBar)

  let asteroids = Array(10).fill(null).map(_ => {
    let x = Math2.random(0, window.innerWidth)
    let y = Math2.random(0, window.innerHeight)
    let theta = Math2.random(0, Math.PI * 2)
    let velocity = Math2.random(5, 10) / 10
    let radius = Math2.random(20, 30)
    let friction = 1
    let hp = Math2.random(30, 50)

    let asteroid = new Asteroid(x, y, theta, velocity, radius, friction, hp)
    let healthBar = new HealthBar(x, y, 0, 0, 0, 0, hp)
    let spark = new Spark(6)
    asteroid.setHealthBar(healthBar)
    asteroid.setEffect(spark)
    return asteroid
  })
  let aliens = Array(2).fill(null).map(_ => {
    let x = Math2.random(0, window.innerWidth)
    let y = Math2.random(0, window.innerHeight)
    let theta = Math2.random(0, Math.PI * 2)
    let velocity = Math2.random(5, 10) / 10
    let radius = 15
    let friction = 0
    let hp = 100

    let healthBar = new HealthBar(x, y, 0, velocity, radius, friction, hp)
    let effect = new Effect(12)
    let bullet = new BulletWeapon(WeaponType.Bullet, 10, 2, 3, 7500)
    let alien = new Alien(x, y, theta, velocity, radius, friction, hp)
    alien
      .setHealthBar(healthBar)
      .setEffect(effect)
      .setWeapons(bullet)
    return alien
  })


  let game = new Game(canvas)
  game
    .setup()
    .setObserver(observer)
    .setBodies(ship, ...asteroids, ...aliens)
    .start()
})()

