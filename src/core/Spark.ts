import Body from "./body";
import Particle from "./particle";

class Spark {
  particles: Particle[];
  private count: number;
  constructor(count: number) {
    this.count = count;
    this.particles = []
  }
  setup(_body: Body) {
    // let degree = 180 / this.count
    this.particles = Array(this.count).fill(0).map((_, _i) => {
      // let theta = Math2.degreeToTheta(degree * i) + (body.observerTheta ? body.observerTheta - Math.PI / 2 : 0)
      // let thetaX = Math.cos(theta)
      // let thetaY = Math.sin(theta)
      // let spread = 10

      // let x = body.x + thetaX * spread
      // let y = body.y + thetaY * spread
      // let velocity = 0.5
      // let radius = 2
      // let friction = 0.95
      // return new Particle(x, y, theta, velocity, radius, friction, 0)
      return new Particle()
    })
  }
  draw(ctx: CanvasRenderingContext2D) {
    this.particles.forEach(p => p.draw(ctx))
  }
  update() {
    this.particles.forEach(p => {
      // Modify radius
      p.radius -= 0.05
      p.update()
      if (p.radius < 0) {
        this.particles = []
      }
    })
  }
}

export default Spark