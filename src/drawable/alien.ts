import Drawable from './drawable'

class Alien implements Drawable {
  x: number = 0;
  y: number = 0;
  theta: number = 0;
  radius: number = 0;
  eyeX = 5;
  eyeY = 5;
  eyeTheta = 0;
  // Having a method _drawAlien(ctx) rather than draw(ctx) makes it easy to stack multiple
  // draw layers (e.g. when adding special effect, bullets etc)
  _drawAlien(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.translate(this.x, this.y)

    // Head
    ctx.beginPath()
    ctx.moveTo(-15, -3)
    ctx.bezierCurveTo(-20, -15, 20, -15, 15, -3)
    ctx.strokeStyle = 'white'
    ctx.stroke()
    ctx.closePath()

    // Tracking eye
    ctx.beginPath()
    ctx.arc(this.eyeX * Math.cos(this.eyeTheta), -5 + this.eyeY * Math.sin(this.eyeTheta), 2, 0, Math.PI * 2, false)
    ctx.fillStyle = 'white'
    ctx.fill()
    ctx.closePath()

    // Middle body
    ctx.beginPath()
    ctx.rect(-20, -3, 40, 3)
    ctx.strokeStyle = 'white'
    ctx.stroke()
    ctx.closePath()

    // Bottom
    ctx.beginPath()
    ctx.moveTo(20, 0)
    ctx.lineTo(30, 5)
    ctx.lineTo(-30, 5)
    ctx.lineTo(-20, 0)
    ctx.moveTo(15, 5)
    ctx.lineTo(18, 10)
    ctx.moveTo(-15, 5)
    ctx.lineTo(-18, 10)
    ctx.strokeStyle = 'white'
    ctx.stroke()
    ctx.closePath()
    ctx.restore()
  }
  // Every drawable will have it's own update logic
  _updateAlien() {
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

export default Alien