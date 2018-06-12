import KeyCode from "../utils/KeyCode";
import Body from "./Body";

class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private requestId: number;
  private isSetup: boolean;
  private bodies: Body[];
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d')!
    this.requestId = -1
    this.isSetup = false
    this.bodies = []
    // this.x = 0
  }
  setup(): Game {
    if (this.isSetup) {
      return this
    }
    document.addEventListener('keydown', (evt) => {
      if (evt.keyCode === KeyCode.Pause) {
        this.pause()
      }
    })
    this.isSetup = true
    return this
  }
  pause(): Game {
    this.requestId < 0 ? this.start() : this.stop()
    return this
  }
  start(): Game {
    this.draw()
    return this
  }
  stop(): Game {
    window.cancelAnimationFrame(this.requestId)
    this.requestId = -1
    return this
  }
  draw() {
    this.ctx.save()
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.bodies.forEach(body => {
      body.draw(this.ctx)
      body.update()
    })

    // this.ctx.save()
    // this.ctx.beginPath()
    // this.ctx.rect(this.x++, 0, 100, 100)
    // this.ctx.fillStyle = 'red'
    // this.ctx.fill()
    // this.ctx.closePath()
    // this.ctx.restore()

    this.requestId = window.requestAnimationFrame(this.draw.bind(this))
  }
  setBodies(...bodies: Body[]): Game {
    this.bodies = bodies
    return this
  }
}

export default Game