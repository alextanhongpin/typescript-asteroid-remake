import KeyCode from "../utils/KeyCode"
import CanvasShape from "../interfaces/CanvasShape";

class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private shapes: CanvasShape[];
  private requestId: number;
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')!
    this.requestId = -1
    this.shapes  = []
  }
  register(...shapes: CanvasShape[]): Game {
    this.shapes = shapes
    return this
  }
  update() {
    let {ctx} = this
    ctx.restore()
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.shapes.forEach(shape => {
      shape.draw(ctx)
      shape.update()
    })
    this.requestId = this.run()
  }
  run (): number {
    return window.requestAnimationFrame(this.update.bind(this))
  }
  pause() {
    if (this.requestId > 0) {
      window.cancelAnimationFrame(this.requestId)
      this.requestId = -1
    } else {
      this.run()
    }
  }
  bindListener(): Game {
    document.addEventListener('keydown', (evt) => {
      if (evt.keyCode === KeyCode.Pause) {
        this.pause()
      }
    })
    return this
  }
}

export default Game