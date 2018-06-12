import Body from "./Body";

class Particle extends Body {
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.theta)
    ctx.beginPath()
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2, false)
    ctx.fillStyle = 'white'
    ctx.fill()
    ctx.closePath()
    ctx.restore()
  }
}

export default Particle