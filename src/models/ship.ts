import { Movable } from 'models/movable'

export class Ship implements Movable {
	id: number = -1;

	x: number;
	y: number;

	radius: number = 15;
	theta: number = 0;
	velocity: number = 1;
	friction: number = 0.95;

	constructor(x: number, y: number) {
		this.x = x
		this.y = y
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
}
