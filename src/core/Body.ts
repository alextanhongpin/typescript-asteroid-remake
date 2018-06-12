import Observer from "../utils/Observer";

class Body {
  x: number;
  y: number;
  theta: number;
  velocity: number;
  friction?: number;
  radius: number;
  hp: number;
  maxHp: number;
  observerTheta?: number;
  private observer: Observer
  constructor(x: number, y: number, theta: number, velocity: number, radius: number, friction: number, hp: number) {
    this.x = x
    this.y = y
    this.theta = theta
    this.velocity = velocity
    this.radius = radius
    this.friction = friction
    this.hp = hp
    this.maxHp = hp
    this.observer = new Observer()
    this.setup()
  }
  setup() { }
  draw(_ctx: CanvasRenderingContext2D) {
    throw new Error('draw is not implemented')
  }
  update() {
    this.x += Math.cos(this.theta) * this.velocity
    this.y += Math.sin(this.theta) * this.velocity
    if (this.friction) {
      this.velocity *= this.friction
    }
  }
  collision(body: Body): boolean {
    let x = Math.pow(this.x - body.x, 2)
    let y = Math.pow(this.y - body.y, 2)
    let radius = this.radius + body.radius
    return Math.sqrt(x + y) < radius
  }
  setObserver(o: Observer) {
    this.observer = o
  }
  on(event: string, fn: Function) {
    this.observer.on(event, fn)
  }
  emit(event: string, ...args: any[]) {
    this.observer.emit(event, ...args)
  }
}

export default Body