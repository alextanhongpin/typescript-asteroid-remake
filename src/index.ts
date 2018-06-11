'use strict';

import Game from './models/Game'
import Math2 from './utils/Math2';
import CircleFactory from './models/CircleFactory';
import ShipFactory from './models/ShipFactory';

(function () {
  let width = window.innerWidth
  let height = window.innerWidth

  let asteroids = Array(10).fill(0).map(_ => {
    let x = Math2.random(0, width)
    let y = Math2.random(0, height)
    let radius = Math2.random(20, 30)
    let theta = Math2.random(0, Math.PI * 2)
    return new CircleFactory().build(x, y, theta, radius)
  })
  let ship = new ShipFactory().build(width / 2, height / 2, 0)
  
  let canvas = <HTMLCanvasElement>document.getElementById('canvas')
  canvas.width = width
  canvas.height = height

  let game = new Game(canvas)
  game
    .bindListener()
    .register(...asteroids, ship)
    .run()
})()

