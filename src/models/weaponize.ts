export function withBullets<T extends CharacterConstructor>(TBase: T): T {
	return class extends TBase {
		private bullets: Bullet[] = []
		shoot () {
		}
		draw () {
		}
		update () {
		}
	}
}
