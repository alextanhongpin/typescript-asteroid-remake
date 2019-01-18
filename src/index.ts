// import { Observer } from 'models/observable'
// import { isTouchDevice, onTouch } from 'utils/touch'

import { 
	withHealthBar, 
	withTeleport, 
	withRepeatBoundary,
	withBullets,
	Ship,
	GameEngine,
	KeyboardController,
	Asteroid,
	Observer,
} from 'models/index'

import Math2 from 'utils/math2'

'use strict';

(function () {
  const width = window.innerWidth
  const height = window.innerHeight

  const canvas = <HTMLCanvasElement>document.getElementById('canvas')
  canvas.width = width
  canvas.height = height


  // handleMessage(o)
  // isTouchDevice() && handleTouch(o)

  // let ship = shipFactory.build(o, width, height)
  // let asteroids = repeat(10, () => asteroidFactory.build(o, width, height))
  // let aliens = repeat(2, () => alienFactory.build(o, width, height))
  const keyboard = new KeyboardController()

  const game = new GameEngine(canvas)
	game.register((obs: Observer) => {
	    const ship = makeShip(obs, width, height) 
		ship.registerKeyboard(keyboard)
		makeAsteroids(obs, width, height, 10)
	})
	game.start()
})()

function makeShip (obs: Observer, width: number, height: number): any { 
	// NOTE: The type is no longer Ship, but something that extends Ship.
	const BattleShip = withBullets(withTeleport(withHealthBar(withRepeatBoundary(width, height)(Ship))))
	const x = 100
	const y = 100
	const radius = 15
	return new BattleShip(obs, x, y, radius)
}


function makeAsteroids(obs: Observer, width: number, height: number, n: number): any {

  const BoundedAsteroid = withHealthBar(withRepeatBoundary(width, height)(Asteroid))
	const [minRadius, maxRadius] = [30, 50]
	const asteroids = Array(n).fill(() => {
		return new BoundedAsteroid(
			obs,
			Math2.random(0, width),
			Math2.random(0, height), 
			Math2.random(minRadius, maxRadius), 
			false
		)
	}).map(fn => fn())
	return asteroids
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
