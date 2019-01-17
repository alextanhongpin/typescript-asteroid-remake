// import { Observer } from 'models/observable'
// import { isTouchDevice, onTouch } from 'utils/touch'

import { 
	withHealthBar, 
	withTeleport, 
	withRepeatBoundary,
	Ship,
	GameEngine,
	KeyboardController
} from 'models/index'

'use strict';

(function () {
  let width = window.innerWidth
  let height = window.innerHeight

  let canvas = <HTMLCanvasElement>document.getElementById('canvas')
  canvas.width = width
  canvas.height = height

  // let o = new Observer()

  // handleMessage(o)
  // isTouchDevice() && handleTouch(o)

  // let ship = shipFactory.build(o, width, height)
  // let asteroids = repeat(10, () => asteroidFactory.build(o, width, height))
  // let aliens = repeat(2, () => alienFactory.build(o, width, height))
  const keyboard = new KeyboardController()

  const ship = makeShip() 
	ship.registerKeyboard(keyboard)
  let game = new GameEngine(canvas)
	game.register(ship)
	game.start()
})()

function makeShip (): any {
	const [width, height] = [window.innerWidth, window.innerHeight]
	// NOTE: The type is no longer Ship, but something that extends Ship.
	const BattleShip = withTeleport(withHealthBar(withRepeatBoundary(width, height)(Ship)))
	const ns = 'ship'
	const x = 100
	const y = 100
	const radius = 15
	return new BattleShip(ns, x, y, radius)
}


// function handleMessage(o: Observer) {
//   let messageView = document.getElementById('message')!
//   let messageTimeout: number
//   let MESSAGE = 'message'
//
//   o.on(MESSAGE, (msg: string) => {
//     if (messageView.innerHTML !== '') {
//       return
//     }
//     messageView.innerHTML = msg
//
//     messageTimeout && window.clearTimeout(messageTimeout)
//     messageTimeout = window.setTimeout(() => {
//       messageView.innerHTML = ''
//     }, 3000)
//   })
// }
//
// function handleTouch(o: Observer) {
//   let View = {
//     up: document.getElementById('up')!,
//     left: document.getElementById('left')!,
//     right: document.getElementById('right')!,
//     shoot: document.getElementById('shoot')!,
//     teleport: document.getElementById('teleport')!,
//     weapon: document.getElementById('weapon')!,
//     help: document.getElementById('help')!
//   }
//   let Events: ObserverEvents = {
//     TOUCH_UP: 'touch:up',
//     TOUCH_LEFT: 'touch:left',
//     TOUCH_RIGHT: 'touch:right',
//     TOUCH_SHOOT: 'touch:shoot',
//     TOUCH_SWAP_WEAPON: 'touch:swap',
//     TOUCH_TELEPORT: 'touch:teleport'
//   }
//   Object.values(View).forEach((el: HTMLElement) => {
//     el.style.display = 'block'
//   })
//   View.help.style.display = 'none'
//
//   onTouch(View.up, () => o.emit(Events.TOUCH_UP))
//   onTouch(View.left, () => o.emit(Events.TOUCH_LEFT))
//   onTouch(View.right, () => o.emit(Events.TOUCH_RIGHT))
//   onTouch(View.shoot, () => o.emit(Events.TOUCH_SHOOT))
//   onTouch(View.teleport, () => o.emit(Events.TOUCH_TELEPORT))
//   onTouch(View.weapon, () => o.emit(Events.TOUCH_SWAP_WEAPON))
// }
