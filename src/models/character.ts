import { Vector } from 'models/vector';
import { Movable } from 'models/movable';
import { Drawable } from 'models/drawable';
import { Updatable } from 'models/updatable';
import { Observer, Observable } from 'models/observable';
import { Destroyable } from 'models/destroyable';

export type CharacterConstructor<T = Character> = new (...args: any[]) => T;

export const REGISTER = Symbol('register');
export const DEREGISTER = Symbol('deregister');

// Character represents a game character, and can be a ship, alien etc.
export class Character extends Observable
  implements Vector, Movable, Drawable, Updatable, Destroyable {
  id: symbol;
  x: number;
  y: number;
  alpha: number = 1;
  friction: number = 0.95;
  obs: Observer;
  theta: number = 0;
  velocity: number = 1;

  constructor(obs: Observer, x: number, y: number) {
    super();
    this.id = Symbol(this.constructor.name);
    this.obs = obs;
    this.x = x;
    this.y = y;

    // Self-discovery through global registration.
    this.obs.emit(REGISTER, this);
  }

  draw(_: CanvasRenderingContext2D) {
    throw new Error('draw not implemented');
  }

  update() {
    if (!this.velocity) {
      return;
    }
    this.x += Math.cos(this.theta) * this.velocity;
    this.y += Math.sin(this.theta) * this.velocity;
    if (this.friction > 0) {
      this.velocity *= this.friction;
    }
  }
  destroy() {
    // Global-deregistration.
    this.obs.emit(DEREGISTER, this);
    this.emit(DEREGISTER, this);
  }
}

export class SphereCharacter extends Character {
  radius: number;
  isFilled: boolean;
  color = 'white';

  constructor(
    obs: Observer,
    x: number,
    y: number,
    radius: number,
    isFilled = true,
  ) {
    super(obs, x, y);
    this.radius = radius;
    this.isFilled = isFilled;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { x, y, radius, color } = this;
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2, false);
    if (this.isFilled) {
      ctx.fillStyle = color;
      ctx.fill();
    } else {
      ctx.strokeStyle = color;
      ctx.stroke();
    }
    ctx.closePath();
    ctx.restore();
  }
}

export class RectangleCharacter extends Character {
  width: number;
  height: number;
  color = 'white';

  constructor(
    obs: Observer,
    x: number,
    y: number,
    width: number,
    height: number,
  ) {
    super(obs, x, y);
    this.width = width;
    this.height = height;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { x, y, width, height, color } = this;

    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }
}
