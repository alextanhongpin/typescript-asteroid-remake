import Game from './core/Game'
import ShipFactory from './factory/ship'
import AlienFactory from './factory/alien'
import AsteroidFactory from './factory/asteroid'
import Observer from './utils/observer'

'use strict';

(function () {
  let width = window.innerWidth
  let height = window.innerHeight

  let InfoView = document.getElementById('info')

  let messageTimeout: number
  let observer = new Observer()
  observer.on('message', (msg: string) => {
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

  let ship = new ShipFactory().build(width, height)
  let aliens = new AlienFactory().build(width, height, 2)
  let asteroids = new AsteroidFactory().build(width, height, 10)

  let game = new Game(canvas)
  game
    .setup()
    .setObserver(observer)
    .setBodies(ship, ...aliens, ...asteroids)
    .start()
})()

