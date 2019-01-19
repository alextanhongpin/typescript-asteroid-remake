import { Character, CharacterConstructor, SphereCharacter } from 'models/character'
import Math2 from 'utils/math2'
import { withOutOfBound } from 'models/boundary'

export class Alien extends SphereCharacter {
	friction = 0.99;
	velocity = 3;
	theta = Math2.random(0, 2 * Math.PI)
	trackers: Character[] = []
	programInterval = Math2.random(2750, 3250)

	constructor(...props: any[]) {
		super(...props)

		window.setInterval(() => this.flightProgram(), this.programInterval)

		this.once('track', (character: Character) => {
			this.trackers.push(character)
		})
	}

	flightProgram() {
		this.friction = 0.99
		this.velocity = 3
		this.theta = Math2.random(0, 2 * Math.PI)
		this.x = Math2.random(0, window.innerWidth)
		this.y = Math2.random(0, window.innerHeight)
		this.shootProgram()
		window.setTimeout(() => {
			this.shootProgram()
		}, 1000) 
	}

	shootProgram () {
		for (let character of this.trackers) {
			this.emit('shoot', character)
		}
	}

	draw(ctx: CanvasRenderingContext2D) {
	  const { x, y, alpha } = this
	  ctx.save()
	  ctx.translate(x, y)

	  // Head
	  ctx.beginPath()
	  ctx.moveTo(-15, -3)
	  ctx.bezierCurveTo(-20, -15, 20, -15, 15, -3)
	  ctx.strokeStyle = 'white'
	  ctx.globalAlpha = alpha
	  ctx.stroke()
	  ctx.closePath()

	  // Body
	  ctx.beginPath()
	  ctx.rect(-20, -3, 40, 3)
	  ctx.strokeStyle = 'white'
	  ctx.globalAlpha = alpha
	  ctx.stroke()
	  ctx.closePath()

	  // Bottom
	  ctx.beginPath()
	  ctx.moveTo(20, 0)
	  ctx.lineTo(30, 5)
	  ctx.lineTo(-30, 5)
	  ctx.lineTo(-20, 0)
	  ctx.moveTo(15, 5)
	  ctx.lineTo(18, 10)
	  ctx.moveTo(-15, 5)
	  ctx.lineTo(-18, 10)
	  ctx.strokeStyle = 'white'
	  ctx.globalAlpha = alpha
	  ctx.stroke()
	  ctx.closePath()
	  ctx.restore()

	  // Tracking eye.
	  ctx.save()
	  ctx.translate(x, y)
	  ctx.beginPath()
		
		const theta = this.trackers.length
			? checkAngle(this, this.trackers[0])
			: 0
	  ctx.arc(5 * Math.cos(theta), 5 * Math.sin(theta), 2, 0, Math.PI * 2, false)
	  ctx.fillStyle = 'white'
	  ctx.fill()
	  ctx.closePath()
	  ctx.restore()
	}
}


export function withGun<T extends CharacterConstructor>(TBase: T): T {
	return class extends TBase {
		private gun: TrackerGun = new TrackerGun()
		constructor(...props: any[]) {
			super(...props)
			this.once('shoot', (character: Character) => {
				this.gun.shoot(this, character)
			})
		}
	}
}

export class AlienBullet extends SphereCharacter {
	friction = 0
	velocity = 5
}

class TrackerGun {
	bullets: Map<symbol, AlienBullet> = new Map()
	maxAmmo = 5
	shoot (character: Character, target: Character) {
		const { x, y, obs } = character
		const radius = 2
		if (this.bullets.size >= this.maxAmmo) {
			return
		}
		const bullet = new (withOutOfBound(AlienBullet))(obs, x, y, radius)
		bullet.theta = checkAngle(character, target)
		bullet.once('unregister', (character: Character) => {
			character.off('unregister')
			this.bullets.delete(character.id)
		})
		this.bullets.set(bullet.id, bullet)
	}
}

export function checkAngle(c1: Character, c2: Character) {
  return Math.atan2(c2.y - c1.y, c2.x - c1.x)
}
