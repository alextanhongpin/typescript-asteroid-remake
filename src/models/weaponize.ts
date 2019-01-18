import { Character, CharacterConstructor, SphereCharacter, RectangleCharacter } from 'models/character'
import { Bullet } from 'models/bullet'
import { isOutOfBound } from 'models/boundary'

interface Weapon {
	shoot (char: Character): void
	draw (ctx: CanvasRenderingContext2D): void
	update(): void
}

class Gun implements Weapon {
	private bullets: Map<symbol,Bullet> = new Map()
	constructor(private ammo: number) {
	}
	shoot (character: Character) {
			if (this.bullets.size >= this.ammo) {
				return
			} 
			const { x, y, theta, obs } = character
			const radius = 2
			const bullet = new Bullet(obs, x, y, radius)
			bullet.theta = theta
			this.bullets.set(bullet.id, bullet)
	}
	draw (ctx: CanvasRenderingContext2D) {
			for (let [, bullet] of this.bullets) {
				bullet.draw(ctx)
			}
	}
	update () {
		for (let [id, bullet] of this.bullets) {
			if (isOutOfBound(bullet.x, bullet.y)) {
				this.bullets.delete(id)
				continue
			}
			bullet.update()
		}
	}
}

class Laser implements Weapon {
	private beam: Beam | null = null;
	character: Character|null = null;
	constructor(private seconds: number) {
	}
	shoot (character: SphereCharacter) {
		if (this.beam) {
			return
		}
		this.character = character
		const { x, y, radius, theta, obs } = character
		const beam = new Beam(obs, x, y, -1, -1)
		beam.radius = radius
		beam.theta = theta
		this.beam = beam
		setTimeout(() => {
			this.beam = null
		}, this.seconds)
	}
	draw (ctx: CanvasRenderingContext2D) {
		this.beam && this.beam.draw(ctx)
	}
	update () {
		if (!this.beam) {
			return
		}
		if (!this.character) {
			return
		}
		this.beam.x = this.character.x
		this.beam.y = this.character.y
		this.beam.theta = this.character.theta
		this.beam && this.beam.update()
	}
} 

class Beam extends RectangleCharacter {
	radius: number = 1
	theta: number = 0
	friction: number = 0

	draw (ctx: CanvasRenderingContext2D) {
    const { x, y, theta, radius } = this
	  const thetaX = Math.cos(theta)
	  const thetaY = Math.sin(theta)

	  ctx.save()
	  ctx.translate(x, y)
	  ctx.beginPath()
	  ctx.moveTo(thetaX * radius, thetaY * radius)
	  ctx.lineTo(thetaX * window.innerWidth, thetaY * window.innerWidth)
	  ctx.lineWidth = 3
	  ctx.strokeStyle = _rainbowGradient(ctx)
	  ctx.stroke()
	  ctx.closePath()
	  ctx.restore()
	}
}

function _rainbowGradient(ctx: CanvasRenderingContext2D): CanvasGradient {
  let gradient = ctx.createLinearGradient(10, 0, 500, 0)
  gradient.addColorStop(0, 'red')
  gradient.addColorStop(1 / 6, 'orange')
  gradient.addColorStop(2 / 6, 'yellow')
  gradient.addColorStop(3 / 6, 'green')
  gradient.addColorStop(4 / 6, 'blue')
  gradient.addColorStop(5 / 6, 'indigo')
  gradient.addColorStop(1, 'violet')
  return gradient
}

export function withBullets<T extends CharacterConstructor>(TBase: T): T {
	return class extends TBase {
		private weapons: Weapon[] = [new Gun(10), new Laser(1000)]
		private selection: number = 0

		weapon() {
			this.selection = (this.selection+1)%this.weapons.length
		}

		shoot () {
			const weapon = this.weapons[this.selection]
			weapon.shoot(this)
		}

		draw (ctx: CanvasRenderingContext2D) {
			super.draw(ctx)
			const weapon = this.weapons[this.selection]
			weapon.draw(ctx)
		}

		update () {
			super.update()
			const weapon = this.weapons[this.selection]
			weapon.update()
		}
	}
}
