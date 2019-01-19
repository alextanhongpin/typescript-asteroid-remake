import { CharacterConstructor } from 'models/character';

export class Boundary {
  constructor(
    private x0 = 0,
    private x1 = window.innerWidth,
    private y0 = 0,
    private y1 = window.innerHeight,
  ) {}
  get midX(): number {
    return this.x1 / 2;
  }
  get midY(): number {
    return this.y1 / 2;
  }
  ltX(x: number): boolean {
    return x < this.x0;
  }
  gtX(x: number): boolean {
    return x > this.x1;
  }
  ltY(y: number): boolean {
    return y < this.y0;
  }
  gtY(y: number): boolean {
    return y > this.y1;
  }
  isOutOfBound(x: number, y: number): boolean {
    return this.gtX(x) || this.ltX(x) || this.gtY(y) || this.ltY(y);
  }
  get minX() {
    return this.x0;
  }
  get maxX() {
    return this.x1;
  }
  get minY() {
    return this.y0;
  }
  get maxY() {
    return this.y1;
  }
}

export function withRepeatBoundary<T extends CharacterConstructor>(
  boundary: Boundary,
): (TBase: T) => T {
  return function(TBase: T): T {
    return class extends TBase {
      update() {
        super.update();
        const { x, y } = this;
        if (boundary.ltX(x)) this.x = boundary.maxX;
        if (boundary.gtX(x)) this.x = boundary.minX;
        if (boundary.ltY(y)) this.y = boundary.maxY;
        if (boundary.gtY(y)) this.y = boundary.minY;
      }
    };
  };
}

export function withOutOfBound<T extends CharacterConstructor>(
  boundary: Boundary,
): (TBase: T) => T {
  return function(TBase: T): T {
    return class extends TBase {
      update() {
        super.update();
        if (boundary.isOutOfBound(this.x, this.y)) {
          this.destroy();
        }
      }
    };
  };
}
