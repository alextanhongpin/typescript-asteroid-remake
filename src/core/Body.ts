class Body {
  x: number;
  y: number;
  theta: number;
  velocity: number;
  friction?: number;
  radius: number;
  constructor(x: number, y: number, theta: number, velocity: number, radius: number, friction: number) {
    this.x = x
    this.y = y
    this.theta = theta
    this.velocity = velocity
    this.radius = radius
    this.friction = friction
    this.setup()
  }
  setup() { }
  _draw(_ctx: CanvasRenderingContext2D) {
    throw new Error('draw is not implemented')
  }
  _drawOthers(_ctx: CanvasRenderingContext2D) {
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.theta)
    this._draw(ctx)
    ctx.restore()
    this._drawOthers(ctx)
  }
  _update() { }
  update() {
    this.x += Math.cos(this.theta) * this.velocity
    this.y += Math.sin(this.theta) * this.velocity
    if (this.friction) {
      this.velocity *= this.friction
    }
    this._update()
  }
  collision(body: Body): boolean {
    let x = Math.pow(this.x - body.x, 2)
    let y = Math.pow(this.y - body.y, 2)
    let radius = this.radius + body.radius
    return Math.sqrt(x + y) < radius
  }
}

export default Body