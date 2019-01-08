import { Vector } from 'models/vector'
import { Movable } from 'models/movable'
import { Drawable } from 'models/drawable'
import { Updatable } from 'models/updatable'

export type CharacterConstructor<T = Character> = new (...args: any[]) => T

// Character represents a game character, and can be a ship, alien etc.
export class Character implements Vector, Movable, Drawable, Updatable {
	id: symbol
	x: number
	y: number
	velocity: number = 1
	theta: number = 0
	friction: number = 0.95

	constructor (ns: string, x: number, y: number) {
		this.id = Symbol(ns)
		this.x = x
		this.y = y
	}

	draw (ctx: CanvasRenderingContext2D) {
		ctx.save()
	}
	update () {
		if (!this.velocity) {
			return
		}
		this.x += Math.cos(this.theta) * this.velocity
		this.y += Math.sin(this.theta) * this.velocity
		if (this.friction > 0) {
			this.velocity *= this.friction
		}
	}
}

export class SphereCharacter extends Character {
	radius: number
	constructor (ns: string, x: number, y: number, radius: number) {
		super(ns, x, y)
		this.radius = radius
	}

	draw (ctx: CanvasRenderingContext2D) {
		ctx.save()
		ctx.translate(this.x, this.y)
		ctx.beginPath()
		ctx.arc(0, 0, this.radius, 0, Math.PI * 2, false)
		ctx.fillStyle = 'white'
		ctx.fill()
		ctx.closePath()
		ctx.restore()
	}
}
	
export class RectangleCharacter extends Character {
	width: number
	height: number

	constructor (
		ns: string,
		x: number,
		y: number,
		width: number,
		height: number
	) {
		super(ns, x, y)
		this.width = width
		this.height = height
	}

	draw (ctx: CanvasRenderingContext2D) {
		ctx.save()
		ctx.translate(this.x, this.y)
		ctx.beginPath()
		ctx.rect(0, 0, this.width, this.height)
		ctx.fillStyle = 'white'
		ctx.fill()
		ctx.closePath()
		ctx.restore()
	}
}
