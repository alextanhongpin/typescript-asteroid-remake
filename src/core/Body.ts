export default abstract class Body {
  x: number = 0
  y: number = 0
  theta: number = 0
  velocity: number = 0
  friction: number = 0
  radius: number = 0
  observerTheta: number = 0;
  abstract draw(_ctx: CanvasRenderingContext2D): void
  update() {
    this.x += Math.cos(this.theta) * this.velocity
    this.y += Math.sin(this.theta) * this.velocity
    if (this.friction) {
      this.velocity *= this.friction
    }
  }
  rotate(theta: number) {
    this.theta += theta
  }
  collision(body: Body): boolean {
    let radius = this.radius + body.radius
    let x = Math.pow(this.x - body.x, 2)
    let y = Math.pow(this.y - body.y, 2)
    return Math.sqrt(x + y) < radius
  }
}
