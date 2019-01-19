import { Character, SphereCharacter } from 'models/character';
import {
  Controller,
  UP,
  LEFT,
  RIGHT,
  SHIFT,
  SPACE,
  ENTER,
} from 'models/controller';
import { SHOOT, SWAP_WEAPON } from 'models/weaponize';
import { TELEPORT } from 'models/teleportable';
import Math2 from 'utils/math2';

export class Ship extends SphereCharacter implements Character {
  theta: number = 0;
  velocity: number = 1;

  readonly color: string = 'white';
  readonly friction: number = 0.95;
  readonly speed: number = 8;
  readonly rotation: number = Math2.degreeToTheta(10);

  draw(ctx: CanvasRenderingContext2D) {
    const { x, y, color, radius, theta, alpha } = this;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(theta);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-radius, -radius);
    ctx.lineTo(radius, 0);
    ctx.lineTo(-radius, radius);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }

  registerController(c: Controller) {
    c.on(UP, () => this.up());
    c.on(LEFT, () => this.left());
    c.on(RIGHT, () => this.right());
    c.on(SHIFT, () => this.emit(TELEPORT));
    c.on(SPACE, () => this.emit(SHOOT));
    c.on(ENTER, () => this.emit(SWAP_WEAPON));
  }

  private up() {
    this.velocity = this.speed;
  }

  private right() {
    this.theta += this.rotation;
  }

  private left() {
    this.theta -= this.rotation;
  }
}
