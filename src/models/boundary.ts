import { CharacterConstructor } from 'models/character'

export function withRepeatBoundary<T extends CharacterConstructor>(width: number, height: number): (TBase: T) => T  {
	return function (TBase: T): T {
		return class extends TBase {
			draw (ctx: CanvasRenderingContext2D) {
				super.draw(ctx)
				if (this.x < 0) this.x = width
				if (this.x > width) this.x = 0
				if (this.y < 0) this.y = height
				if (this.y > height) this.y = 0
			}
		}
	}
}

