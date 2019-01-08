import { CharacterConstructor } from 'models/character'
import Math2 from 'utils/math2'

export interface Teleportable {
	teleport(): void
}

export function withTeleport<T extends CharacterConstructor>(TBase: T): T {
	return class extends TBase {
		teleport () {
			this.x = Math2.random(0, window.innerWidth)
			this.y = Math2.random(0, window.innerHeight)
		}
	}
}
