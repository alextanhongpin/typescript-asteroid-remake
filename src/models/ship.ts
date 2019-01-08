import { Character, SphereCharacter } from 'models/character'
import Math2 from 'utils/math2'
import { Controller } from 'models/controller'
import { Teleportable } from 'models/teleportable'

export class Ship extends SphereCharacter implements Character, Teleportable {
	theta: number = 0
	velocity: number = 1

	readonly friction: number = 0.95
	readonly speed: number = 8
	readonly rotation: number = Math2.degreeToTheta(10)

	draw(ctx: CanvasRenderingContext2D) {
		const alpha = 1
		const { x, y, radius, theta } = this
		ctx.save()
		ctx.translate(x, y)
		ctx.rotate(theta)
		ctx.beginPath()
		ctx.moveTo(0, 0)
		ctx.lineTo(-radius, -radius)
		ctx.lineTo(radius, 0)
		ctx.lineTo(-radius, radius)
		ctx.globalAlpha = alpha
		ctx.fillStyle = 'white'
		ctx.fill()
		ctx.closePath()
		ctx.restore()
	}

	registerKeyboard(ctrl: Controller) {
		ctrl.on('key:up', () => this.up())
		ctrl.on('key:left', () => this.left())
		ctrl.on('key:right', () => this.right())
		ctrl.on('key:shift', () => this.shift())
		// ctrl.on('key:space', this.space)
		// ctrl.on('key:enter', this.enter)
	}

	private up () {
		this.velocity = this.speed
	}

	private right () {
		this.theta += this.rotation
	}

	private left () {
		this.theta -= this.rotation
	}

	private shift () {
		this.teleport()
	}

	// Creates an empty implementation first, decorate it later.
	teleport () {}
}
