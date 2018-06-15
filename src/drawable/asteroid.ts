import Drawable from "./drawable";

export default class Asteroid implements Drawable {
  x: number = 0;
  y: number = 0;
  theta: number = 0;
  radius: number = 0;
  _drawAsteroid(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.theta)
    ctx.beginPath()
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2, false)
    ctx.strokeStyle = 'white'
    ctx.stroke()
    ctx.closePath()
    ctx.restore()
  }
  _updateAsteroid() {
    if (this.x > window.innerWidth) {
      this.x = 0
    }
    if (this.x < 0) {
      this.x = window.innerWidth
    }
    if (this.y > window.innerHeight) {
      this.y = 0
    }
    if (this.y < 0) {
      this.y = window.innerHeight
    }
  }
}
