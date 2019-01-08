import { Character } from 'models/Character'

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

export class GameEngine implements Engine, Pausable, Startable, Stoppable {
	ctx: CanvasRenderingContext2D
	canvas: HTMLCanvasElement
	characters: Map<symbol, Character> = new Map() 

	private requestId: number = -1;
	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas
		this.ctx = canvas.getContext('2d')!
	}
	update (m: Character) {
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
		const characters = Array.from(this.characters.values())
		for (let movable of characters) {
			movable.draw(this.ctx)
			this.update(movable)
		}
		this.requestId = window.requestAnimationFrame(this.draw.bind(this))
	}
	pause() {
		this.requestId < 0 
			? this.start() 
			: this.stop()
	}
	start() {
		this.draw()
	}
	stop() {
		window.cancelAnimationFrame(this.requestId)
		this.requestId = -1
	}
	register(...characters: Character[]) {
		for (let m of characters) {
			this.characters.set(m.id, m)
		}
	}
}

