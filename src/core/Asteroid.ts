import Body from "./Body";
import HealthBar from "./HealthBar";
import Spark from "./Spark";


class Asteroid extends Body {
  healthBar?: HealthBar;
  effect?: Spark;
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
  _drawHealthBar(ctx: CanvasRenderingContext2D) {
    if (this.healthBar) {
      this.healthBar.draw(ctx)
    }
  }
  _drawEffect(ctx: CanvasRenderingContext2D) {
    this.effect!.draw(ctx)
  }
  draw(ctx: CanvasRenderingContext2D) {
    this._drawAsteroid(ctx)
    this._drawHealthBar(ctx)
    this._drawEffect(ctx)
  }
  update() {
    super.update()
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

    if (this.healthBar) {
      this.healthBar.x = this.x
      this.healthBar.y = this.y - 20
      this.healthBar.hp = this.hp
      this.healthBar.update()
    }

    this.effect!.update()
  }
  setHealthBar(healthBar: HealthBar): Asteroid {
    this.healthBar = healthBar
    this.healthBar.hp = this.hp
    return this
  }
  setEffect(effect: Spark): Asteroid {
    this.effect = effect
    return this
  }
}

export default Asteroid