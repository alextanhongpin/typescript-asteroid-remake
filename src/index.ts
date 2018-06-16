import Game from './core/game'
import { flatten } from './core/drawable'
import { Observer } from './utils/observer'
import { AlienFactory } from './movable/alien'
import { ShipFactory } from './movable/ship'
import { AsteroidFactory } from './movable/asteroid'

'use strict';

(function () {
  let width = window.innerWidth
  let height = window.innerHeight

  let InfoView = document.getElementById('info')

  let messageTimeout: number
  let o = new Observer()
  o.on('message', (msg: string) => {
    if (InfoView!.innerHTML !== '') {
      return
    }
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


  let alienFactory = new AlienFactory()
  let shipFactory = new ShipFactory()
  let asteroidFactory = new AsteroidFactory()

  let ship = shipFactory.build(o, width, height)
  let asteroids = Array(10).fill(null).map(() => {
    return asteroidFactory.build(o, width, height)
  })
  let aliens = Array(2).fill(null).map(() => {
    return alienFactory.build(o, width, height)
  })


  let game = new Game(canvas)
  game
    .setObserver(o)
    .setDrawables(...ship, ...flatten(asteroids), ...flatten(aliens))
    .setup()
    .start()
})()

