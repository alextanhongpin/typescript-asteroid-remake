import Body from "./body";
import Particle from "./particle";
import Math2 from '../utils/math2'

class Spark {
  particles: Particle[];
  private count: number;
  constructor(count: number) {
    this.count = count;
    this.particles = []
  }
  setup(body: Body) {
    let degree = 180 / this.count
    this.particles = Array(this.count).fill(0).map((_, i) => {
      let theta = Math2.degreeToTheta(degree * i) + (body.observerTheta ? body.observerTheta - Math.PI / 2 : 0)
      let thetaX = Math.cos(theta)
      let thetaY = Math.sin(theta)
      let spread = 10

      let particle = new Particle()
      particle.x = body.x + thetaX * spread
      particle.y = body.y + thetaY * spread
      particle.velocity = 0.5
      particle.radius = 2
      particle.friction = 0.95
      return particle
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