import { Character, SphereCharacter } from 'models/character'
import Math2 from 'utils/math2'
import { Controller } from 'models/movable'

export class Ship extends SphereCharacter implements Character {
	theta: number = 0
	velocity: number = 1
	friction: number = 0.95

	get speed (): number {
		return 8
	}

	get rotation () {
    return Math2.degreeToTheta(10)
	}

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
	registerController(ctrl: Controller) {
		ctrl.on('key:up', this.up)
		ctrl.on('key:left', this.left)
		ctrl.on('key:right', this.right)
		// ctrl.on('key:shift', this.shift)
		// ctrl.on('key:space', this.space)
		// ctrl.on('key:enter', this.enter)
	}
	up () {
		this.velocity = Ship.speed()
	}
	right () {
    this.theta += Ship.rotation()
	}
	left () {
    this.theta -= Ship.rotation()
	}
}
