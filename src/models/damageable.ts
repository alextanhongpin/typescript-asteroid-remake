import { CharacterConstructor } from 'models/character'

export interface Damageable {
	hp: number
	maxHp: number

	damage(n: number): boolean
}

export function withHealthBar<T extends CharacterConstructor>(TBase: T): T {
	return class extends TBase implements Damageable {
		hp: number = 100
		maxHp: number = 100
		width: number = 50
		height: number = 5
		spacing: number = 1
		padding: number = 2
		visible: boolean = false 
		damage (n: number) {
			this.hp -= n
			if (this.hp < 0) {
				this.hp = 0
			}
			return this.hp === 0 
		}
		draw (ctx: CanvasRenderingContext2D) {
			super.draw(ctx)
			if (!this.visible) {
				return
			}

			// if isVisible
			const { width, height, spacing, padding, hp, maxHp, x, y } = this
			const hpRatio = hp / maxHp

			ctx.save()
			ctx.translate(x - width/2, y - width/2)

			// Border
			ctx.beginPath()
			ctx.rect(0, 0, width, height)
			ctx.strokeStyle = 'white'
			ctx.stroke()
			ctx.closePath()

			// Health bar
			ctx.beginPath()
			ctx.rect(spacing, spacing, Math.max(0, hpRatio * (width - padding)), height - padding)
			ctx.fillStyle = this.healthColor(hpRatio)
			ctx.fill()
			ctx.closePath()
			ctx.restore()
		}
		healthColor(ratio: number): string {
			if (ratio < 0.25) {
				return 'red'
			}
			if (ratio < 0.5) {
				return 'orange'
			}
			return 'white'
		}
	}
}
