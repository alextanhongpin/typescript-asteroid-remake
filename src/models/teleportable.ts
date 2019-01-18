import {  CharacterConstructor } from 'models/character'
import { Observer } from 'models/observable'
import { Particle } from 'models/particle'
import Math2 from 'utils/math2'

export interface Teleportable {
	teleport(): void
}

export function makeParticles(obs: Observer, count: number, posX: number, posY: number): Particle[] {
  let radian = 2 * Math.PI / count
  return Array(count).fill(null).map((_, i) => {
    const theta = i * radian
    const spread = 20
	const radius = 2
    const x = posX + spread * Math.cos(theta)
    const y = posY + spread * Math.sin(theta)
    return new Particle(obs, x, y, radius, theta)
  })
}

export function withTeleport<T extends CharacterConstructor>(TBase: T): T {
	return class extends TBase implements Teleportable {
		private particles: Particle[] = []
		teleport () {
			const { x, y } = this
			this.x = Math2.random(0, window.innerWidth)
			this.y = Math2.random(0, window.innerHeight)
			this.particles = makeParticles(this.obs, 12, x, y)
		}
		draw(ctx: CanvasRenderingContext2D) {
			super.draw(ctx)
			this.particles.forEach(particle => particle.draw(ctx))
		}
		update() {
			super.update()
			if (!this.particles.length) {
				return
			}

			// Taking the first one should be sufficient.
			const radius = this.particles[0].radius
			// const radius = this.particles.reduce((acc: number, particle: Particle) => {
			//     return acc + particle.radius
			// }, 0)

			if (!radius) {
				const particles = this.particles
				for (let particle of particles) {
					this.obs.emit('unregister', particle)
				}
				this.particles = []
				return
			}

			this.particles.forEach(particle => particle.update())
		}
	}
}
