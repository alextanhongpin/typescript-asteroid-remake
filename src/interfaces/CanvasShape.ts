interface CanvasShape {
  draw(ctx: CanvasRenderingContext2D): void
  update(): void
}

export default CanvasShape