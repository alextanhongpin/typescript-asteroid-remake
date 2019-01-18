import { SphereCharacter } from 'models/character'
import { Observer } from 'models/observable'

export class Particle extends SphereCharacter {
	velocity: number = -0.5 
	friction: number = 0.95

	constructor(obs: Observer, x: number, y: number, radius: number, theta: number) {
		super(obs, x, y, radius)
		this.theta = theta
	}
	update() {
		this.radius -= 0.1
		if (this.radius <= 0) {
			this.radius = 0
			this.obs.emit('unregister', this)
			return
		}
		super.update()
	}
}
