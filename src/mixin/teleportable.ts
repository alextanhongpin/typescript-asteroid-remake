import Body from "../core/body";
import Math2 from "../utils/math2";
import Particle from "../core/particle";

export interface TeleportState {
  count: number;
  particles: Particle[];
}

export default class Teleportable {
  _teleportState: TeleportState;
  constructor(state: TeleportState) {
    this._teleportState = state
  }
  _makeParticle(theta: number, x: number, y: number): Particle {
    let thetaX = Math.cos(theta)
    let thetaY = Math.sin(theta)
    let spread = 25

    let particle = new Particle()
    particle.x = x + thetaX * spread
    particle.y = y + thetaY * spread
    particle.theta = theta
    particle.velocity = -0.5
    particle.radius = 2
    particle.friction = 0.95
    return particle
  }
  _makeParticles(count: number, x: number, y: number): Particle[] {
    let degree = 360 / count
    return Array(count).fill(0).map((_, i) => {
      let theta = Math2.degreeToTheta(degree * i)
      return this._makeParticle(theta, x, y)
    })
  }
  _teleport(body: Body) {
    let { count } = this._teleportState
    this._teleportState.particles = this._makeParticles(count, body.x, body.y)
    body.x = Math2.random(0, window.innerWidth)
    body.y = Math2.random(0, window.innerHeight)
  }
  _drawTeleportable(ctx: CanvasRenderingContext2D) {
    let { particles } = this._teleportState
    particles.forEach(p => p.draw(ctx))
  }
  _updateTeleportable() {
    let { particles } = this._teleportState
    particles.forEach(p => {
      // Modify radius
      p.radius -= 0.05
      p.update()
      if (p.radius < 0) {
        this._teleportState.particles = []
      }
    })
  }
}
