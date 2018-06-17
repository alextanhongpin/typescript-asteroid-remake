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

  let canvas = <HTMLCanvasElement>document.getElementById('canvas')
  canvas.width = width
  canvas.height = height

  let alienFactory = new AlienFactory()
  let shipFactory = new ShipFactory()
  let asteroidFactory = new AsteroidFactory()

  let o = new Observer()

  handleMessage(o)
  isTouchDevice() && handleTouch(o)

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


function handleMessage(o: Observer) {
  let messageView = document.getElementById('message')!
  let messageTimeout: number
  let MESSAGE = 'message'

  o.on(MESSAGE, (msg: string) => {
    if (messageView.innerHTML !== '') {
      return
    }
    messageView.innerHTML = msg

    messageTimeout && window.clearTimeout(messageTimeout)
    messageTimeout = window.setTimeout(() => {
      messageView.innerHTML = ''
    }, 3000)
  })
}

function handleTouch(o: Observer) {
  let View = {
    up: document.getElementById('up')!,
    left: document.getElementById('left')!,
    right: document.getElementById('right')!,
    shoot: document.getElementById('shoot')!,
    teleport: document.getElementById('teleport')!,
    weapon: document.getElementById('weapon')!,
    help: document.getElementById('help')!
  }
  Object.values(View).forEach((el: HTMLElement) => {
    el.style.display = 'block'
  })
  View.help.style.display = 'none'

  onTouch(View.up, () => {
    o.emit('TOUCH_UP')
  })
  onTouch(View.left, () => {
    o.emit('TOUCH_LEFT')
  })
  onTouch(View.right, () => {
    o.emit('TOUCH_RIGHT')
  })
  onTouch(View.shoot, () => {
    o.emit('TOUCH_SHOOT')
  })
  onTouch(View.teleport, () => {
    o.emit('TOUCH_TELEPORT')
  })
  onTouch(View.weapon, () => {
    o.emit('TOUCH_SWAP_WEAPON')
  })
}

function onTouch(element: HTMLElement, fn: Function) {
  element.addEventListener('touchstart', (evt: TouchEvent) => {
    evt.preventDefault()
    fn && fn()
  }, { passive: true })
}

function isTouchDevice(): boolean {
  let prefixes = ' -webkit- -moz- -o- -ms- '.split(' ')
  let mq = function (query: string) {
    return window.matchMedia(query).matches
  }

  if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
    return true
  }
  // include the 'heartz' as a way to have a non matching MQ to help terminate the join
  // https://git.io/vznFH
  let query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('')
  return mq(query)
}