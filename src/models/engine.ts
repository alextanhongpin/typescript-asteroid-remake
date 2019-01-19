import { 
	Character,
	SphereCharacter,
} from 'models/character'
import { Observable, Observer } from 'models/observable'
import { Asteroid } from 'models/asteroid'
import { Bullet } from 'models/bullet'  
import Math2 from 'utils/math2'
import { Particle } from 'models/particle'
import { DAMAGE, HEALTH_ZERO } from 'models/damageable'
import { Laser, Beam } from 'models/weaponize'

export interface Pausable {
	pause(): void
}

export interface Startable {
	start(): void
}

export interface Stoppable {
	stop(): void
}

export interface Engine {
	ctx: CanvasRenderingContext2D;
	canvas: HTMLCanvasElement;
	characters: Map<symbol, Character>;
	register(...args: Character[]): void
}

export class GameEngine extends Observable implements Engine, Pausable, Startable, Stoppable {
	ctx: CanvasRenderingContext2D
	canvas: HTMLCanvasElement
	characters: Map<symbol, Character> = new Map() 

	private requestId: number = -1;
	constructor(canvas: HTMLCanvasElement) {
		super()
		this.canvas = canvas
		this.ctx = canvas.getContext('2d')!

		this.once('register', (c: Character) => {
			this.characters.set(c.id, c)
		})

		this.once('unregister', (c: Character) => {
			this.characters.delete(c.id)
		})
	}
	eventloop() {
		this.ctx.save()
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
		for (let [, character] of this.characters) {
			character.draw(this.ctx)
			character.update()
			this.checkCollision(character)
		}
		this.requestId = window.requestAnimationFrame(this.eventloop.bind(this))
	}
	checkCollision(char1: Character) {
		for (let [, char2] of this.characters) {
			if (char1 === char2) continue

			// When the ship bullet hits the asteroid.
			if (char1 instanceof Bullet && char2 instanceof Asteroid) {
				const [bullet, asteroid] = [char1, char2]
				if (checkCollision(bullet, asteroid)) {
					// Display effects.
					makeSparks(char1.obs, bullet, 6, checkAngle(asteroid, bullet))
					bullet.destroy()
					this.characters.delete(bullet.id)

					// Apply damage to asteroid.
					asteroid.emit(DAMAGE, 10)

					// If asteroid health is -tive, destroy it.
					asteroid.once(HEALTH_ZERO, () => {
						this.characters.delete(asteroid.id)
					})
				}
			}

			if (char1 instanceof Beam && char2 instanceof Asteroid) {
				const [laser, asteroid] = [char1, char2]
				if (checkLaserCollision(laser, asteroid)) {
					// TODO: Get the laser damage.
					asteroid.emit(DAMAGE, 1)

					// If asteroid health is -tive, destroy it.
					asteroid.once(HEALTH_ZERO, () => {
						this.characters.delete(asteroid.id)
					})
				}
			}
		}
	}
	pause() {
		this.requestId < 0 
			? this.start() 
			: this.stop()
	}
	start() {
		this.eventloop()
	}
	stop() {
		window.cancelAnimationFrame(this.requestId)
		this.requestId = -1
	}
	// Register the characters. New characters can be added dynamically too.
	register(cb: any) {
		cb(this)
	}
}


export function checkCollision(c1: SphereCharacter, c2: SphereCharacter): boolean {
  const deltaX = Math.pow(c1.x - c2.x, 2)
  const deltaY = Math.pow(c1.y - c2.y, 2)
  const radius = c1.radius + c2.radius
  return Math.sqrt(deltaX + deltaY) < radius
}

export function checkLaserCollision(c1: Character, c2: SphereCharacter): boolean {
  const deltaY = Math.tan(c1.theta) * (c2.x - c1.x)
  const y2 = c1.y + deltaY
  return Math.abs(c2.y - y2) < c2.radius
}

export function makeSparks(obs: Observer, character: SphereCharacter, count: number, theta0: number) {
  const degree = Math.PI / count
  const spread = Math2.random(5, 10)
  const { x: x0, y: y0 } = character 

  return Array(count).fill(null).map((_, i) => {
    const theta = theta0 + (i * degree - Math.PI / 2)
    const x = x0 + spread * Math.cos(theta)
    const y = y0 + spread * Math.sin(theta)
	const spark = new Particle(obs, x, y, 2, theta)
	spark.velocity = 0.5 
	return spark
  })
}

export function checkAngle(c1: Character, c2: Character) {
  return Math.atan2(c2.y - c1.y, c2.x - c1.x)
}
