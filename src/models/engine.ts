import { Movable } from 'models/movable'
export interface Engine {
	ctx: CanvasRenderingContext2D;
	canvas: HTMLCanvasElement;
	movables: Record<number, Movable>;
	// new(canvas: HTMLCanvasElement): Engine
	draw (): void
	start(): void 
	stop(): void 
	pause(): void 
	register(...args: Movable[]): void
}

export class GameEngine implements Engine {
	ctx: CanvasRenderingContext2D;
	canvas: HTMLCanvasElement
	movables: Record<string, Movable> = {};

	private requestId: number = -1;
	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas
		this.ctx = canvas.getContext('2d')!
	}
	update (m: Movable) {
		if (!m.velocity) {
			return
		}
		m.x += Math.cos(m.theta) * m.velocity
		m.y += Math.sin(m.theta) * m.velocity
		if (m.friction > 0) {
			m.velocity *= m.friction
		}
	}
	draw() {
		this.ctx.save()
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
		for (let id in this.movables) {
			const movable = this.movables[id]
			movable.draw(this.ctx)
			this.update(movable)
		}
		this.requestId = window.requestAnimationFrame(this.draw.bind(this))
	}
	pause() {
		this.requestId < 0 ? this.start() : this.stop()
	}
	start() {
		this.draw()
	}
	stop() {
		window.cancelAnimationFrame(this.requestId)
		this.requestId = -1
	}
	register(...movables: Movable[]) {
		for (let m of movables) {
			this.movables[m.id] = m
		}
	}
}

