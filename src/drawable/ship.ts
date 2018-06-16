import Drawable from "./drawable";

export default class Ship implements Drawable {
  x: number = 0;
  y: number = 0;
  radius: number = 0;
  theta: number = 0;
  isFlickering: boolean = false;
  alphaState: boolean = false;
  alpha: number = 1;
  _updateShip() {
    this.x = (this.x + window.innerWidth) % window.innerWidth
    this.y = (this.y + window.innerHeight) % window.innerHeight
  }
  _drawShip(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.theta)
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(-this.radius, -this.radius)
    ctx.lineTo(this.radius, 0)
    ctx.lineTo(-this.radius, this.radius)
    this.computeGlobalAlpha(this.isFlickering)
    ctx.globalAlpha = this.alpha
    ctx.fillStyle = 'white'
    ctx.fill()
    ctx.closePath()
    ctx.restore()
  }
  computeGlobalAlpha(isFlickering: boolean) {
    if (isFlickering) {
      if (this.alpha > 0.05) {
        if (!this.alphaState) {
          this.alpha -= 0.05
        }
      } else {
        this.alphaState = true
      }
      if (this.alphaState) {
        this.alpha += 0.05
        if (this.alpha > 0.95) {
          this.alphaState = false
        }
      }
    } else {
      this.alpha = 1
    }
  }
}
