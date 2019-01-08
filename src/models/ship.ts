import { Character, SphereCharacter } from 'models/character'

export class Ship extends SphereCharacter implements Character {
	theta: number = 0;
	velocity: number = 1;
	friction: number = 0.95;

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
}
