import { CharacterConstructor } from 'models/character'
import Math2 from 'utils/math2'

export function withRepeatBoundary<T extends CharacterConstructor>(width: number, height: number): (TBase: T) => T  {
	return function (TBase: T): T {
		return class extends TBase {
			update () {
				super.update()
				if (this.x < 0) this.x = width
				if (this.x > width) this.x = 0
				if (this.y < 0) this.y = height
				if (this.y > height) this.y = 0
			}
		}
	}
}

export function isOutOfBound(x: number, y: number): boolean {
	return x < 0
		|| x > window.innerWidth 
		|| y < 0
		|| y > window.innerHeight
}

export function withOutOfBound<T extends CharacterConstructor>(TBase: T): T {
	return class extends TBase {
		update() {
			super.update()
			if (isOutOfBound(this.x, this.y)) {
				this.destroy()
			}
		}
	}
}

export function randomX () {
	return Math2.random(0, window.innerWidth)
}

export function randomY() {
	return Math2.random(0, window.innerHeight)
}
