import Body from "./Body";

export enum WeaponType {
  Bullet,
  Laser
}

export interface Weapon {
  damage: number;
  type: WeaponType;
  ammos: { [id: number]: Body };
  reload(body: Body): void;
  empty(): void;
  draw(ctx: CanvasRenderingContext2D): void;
  update(): void;
}
