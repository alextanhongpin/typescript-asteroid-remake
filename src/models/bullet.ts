import { SphereCharacter } from 'models/character';

export class Bullet extends SphereCharacter {}

export class ShipBullet extends Bullet {
  velocity: number = 8;
  friction: number = 0;
}
export class AlienBullet extends Bullet {
  friction = 0;
  velocity = 5;
}
