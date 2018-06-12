import Body from "./Body";

class HealthBar extends Body {
  isVisible?: boolean;
  draw(ctx: CanvasRenderingContext2D) {
    if (!this.isVisible) {
      return
    }
    let width = 50
    let height = 5
    let spacing = 1
    let padding = spacing * 2
    let hpRatio = this.hp / this.maxHp

    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.theta)
    ctx.beginPath()
    ctx.rect(0, 0, width, height)
    ctx.strokeStyle = 'white'
    ctx.stroke()
    ctx.closePath()

    ctx.beginPath()
    ctx.rect(spacing, spacing, Math.max(0, hpRatio * (width - padding)), height - padding)
    if (hpRatio < 0.25) {
      ctx.fillStyle = 'red'
    } else if (hpRatio < 0.5) {
      ctx.fillStyle = 'orange'
    } else {
      ctx.fillStyle = 'white'
    }
    ctx.fill()
    ctx.closePath()

    ctx.restore()
  }
}

export default HealthBar
