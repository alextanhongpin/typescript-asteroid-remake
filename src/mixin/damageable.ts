export interface HealthState {
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  isVisible: boolean;
}

export default class Damageable {
  _healthState: HealthState;
  constructor(state: HealthState) {
    this._healthState = state
  }
  _drawHealth(ctx: CanvasRenderingContext2D) {
    let { hp, maxHp, x, y, isVisible } = this._healthState
    if (!isVisible) {
      return
    }
    let width = 50
    let height = 5
    let spacing = 1
    let padding = spacing * 2
    let hpRatio = hp / maxHp

    ctx.save()
    ctx.translate(x, y)
    ctx.beginPath()
    ctx.rect(0, 0, width, height)
    ctx.strokeStyle = 'white'
    ctx.stroke()
    ctx.closePath()

    ctx.beginPath()
    ctx.rect(spacing, spacing, Math.max(0, hpRatio * (width - padding)), height - padding)
    ctx.fillStyle = this._healthColor(hpRatio)
    ctx.fill()
    ctx.closePath()

    ctx.restore()
  }
  _healthColor(hpRatio: number): string {
    if (hpRatio < 0.25) {
      return 'red'
    }
    if (hpRatio < 0.5) {
      return 'orange'
    }
    return 'white'
  }
}