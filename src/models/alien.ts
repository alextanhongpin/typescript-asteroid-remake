import {
  Character,
  CharacterConstructor,
  SphereCharacter,
  DEREGISTER,
} from 'models/character';
export const TRACK = Symbol('track');
export const SHOOT = Symbol('shoot');
import Math2 from 'utils/math2';
import { AlienBullet, Bullet } from 'models/bullet';
import { Boundary, withOutOfBound } from 'models/boundary';
import { sleep } from 'utils/time';

export class Alien extends SphereCharacter {
  friction = 0.99;
  velocity = 5;
  theta = Math2.randomTheta();
  trackers: Character[] = [];
  readonly color = 'white';
  readonly programIntervalDuration = Math2.random(2750, 3250);
  readonly shootDuration = 1000;
  programInterval: number = 0;
  constructor(...props: any[]) {
    super(...props);
    this.programInterval = window.setInterval(
      () => this.flightProgram(),
      this.programIntervalDuration,
    );
    this.once(TRACK, (character: Character) => {
      this.trackers.push(character);
    });
    this.on(DEREGISTER, () => {
      window.clearInterval(this.programInterval);
    });
  }

  async flightProgram() {
    // Reset velocity.
    this.friction = 0.99;
    this.velocity = 5;

    // Change the orientation.
    this.theta = Math2.randomTheta();

    // Randomize location in the game world.
    this.x = Math2.randomX();
    this.y = Math2.randomY();

    // Shoot twice.
    this.shootProgram();
    await sleep(this.shootDuration);
    this.shootProgram();
  }

  shootProgram() {
    for (let character of this.trackers) {
      this.emit(SHOOT, character);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { x, y, alpha, color } = this;
    ctx.save();
    ctx.translate(x, y);

    // Head
    ctx.beginPath();
    ctx.moveTo(-15, -3);
    ctx.bezierCurveTo(-20, -15, 20, -15, 15, -3);
    ctx.strokeStyle = color;
    ctx.globalAlpha = alpha;
    ctx.stroke();
    ctx.closePath();

    // Body
    ctx.beginPath();
    ctx.rect(-20, -3, 40, 3);
    ctx.strokeStyle = color;
    ctx.globalAlpha = alpha;
    ctx.stroke();
    ctx.closePath();

    // Bottom
    ctx.beginPath();
    ctx.moveTo(20, 0);
    ctx.lineTo(30, 5);
    ctx.lineTo(-30, 5);
    ctx.lineTo(-20, 0);
    ctx.moveTo(15, 5);
    ctx.lineTo(18, 10);
    ctx.moveTo(-15, 5);
    ctx.lineTo(-18, 10);
    ctx.strokeStyle = color;
    ctx.globalAlpha = alpha;
    ctx.stroke();
    ctx.closePath();
    ctx.restore();

    // Tracking eye.
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();

    const theta = this.trackers.length
      ? Math2.angleBetween(this, this.trackers[0])
      : 0;
    ctx.arc(5 * Math.cos(theta), 5 * Math.sin(theta), 2, 0, Math.PI * 2, false);

    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }
}

export function withGun<T extends CharacterConstructor>(TBase: T): T {
  return class extends TBase {
    private gun: Gun = new Gun();
    constructor(...props: any[]) {
      super(...props);
      this.once(SHOOT, (character: Character) => {
        this.gun.shoot(this, character);
      });
    }
  };
}

class Gun {
  bullets: Map<symbol, Bullet> = new Map();
  readonly maxAmmo = 5;

  shoot(character: Character, target: Character) {
    if (this.bullets.size >= this.maxAmmo) {
      return;
    }
    const { x, y, obs } = character;
    const radius = 2;
    const bounded = withOutOfBound(new Boundary());

    const bullet = <AlienBullet>new (bounded(AlienBullet))(obs, x, y, radius);
    bullet.theta = Math2.angleBetween(character, target);
    bullet.once(DEREGISTER, (character: Character) => {
      character.off(DEREGISTER);
      this.bullets.delete(character.id);
    });
    this.bullets.set(bullet.id, bullet);
  }
}
