import { SphereCharacter } from 'models/character'
import { Observer } from 'models/observable'
import { Weapon } from 'models/weaponize'

export class Bullet extends SphereCharacter {
	velocity: number = 8 
	friction: number = 0
	constructor (
		obs: Observer,
		x: number,
		y: number,
		radius: number,
		isFilled: boolean,
		private parent: Weapon
	) {
		super(obs, x, y, radius, isFilled)
	}
	destroy () {
		this.parent.destroy(this)
	}
}
