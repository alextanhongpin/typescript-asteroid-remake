import { 
	withHealthBar, 
	withTeleport, 
	withRepeatBoundary,
	withBullets,
	Ship,
	GameEngine,
	KeyboardController,
	Asteroid,
	Alien,
	withGun,
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

  const keyboard = new KeyboardController()

  const game = new GameEngine(canvas)
	game.register((obs: Observer) => {
	    const ship = makeShip(obs, width, height) 
		ship.registerKeyboard(keyboard)

		const aliens = makeAlien(obs, width, height, 2)
		aliens.forEach((alien: any) => {
			alien.emit('track', ship)
		})
		makeAsteroids(obs, width, height, 10)
	})
	game.start()
})()


function makeAlien(obs: Observer, width: number, height: number, n: number): any {
	const bounded = withRepeatBoundary(width, height)

	return Array(n).fill(() => {
		const x = Math2.random(0, width)
		const y = Math2.random(0, height) 
		const radius = 15
		return new (withHealthBar(true)(withGun(withBullets(bounded(Alien)))))(obs, x, y, radius)
	}).map(fn => fn())
}

function makeShip (obs: Observer, width: number, height: number): any { 
	// NOTE: The type is no longer Ship, but something that extends Ship.
	const BattleShip = withBullets(withTeleport(withHealthBar(true)(withRepeatBoundary(width, height)(Ship))))
	const x = Math.round(width / 2)
	const y = Math.round(height / 2) 
	const radius = 15
	return new BattleShip(obs, x, y, radius)
}

function makeAsteroids(obs: Observer, width: number, height: number, n: number): any {

  const BoundedAsteroid = withHealthBar(false)(withRepeatBoundary(width, height)(Asteroid))
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

