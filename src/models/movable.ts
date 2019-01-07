export type MovableConstructor<T = Movable> = new (...args: any[]) => T

export interface Movable {
	id: number;

	x: number;
	y: number;

	velocity: number;
	theta: number;
	friction: number;

	draw(ctx: CanvasRenderingContext2D): void
}
