class Vector {
  private x: number;
  private y: number;
  private theta: number;
  private friction: number;

  constructor(theta: number) {
    this.theta = theta
    this.x = Math.cos(this.theta)
    this.y = Math.sin(this.theta)
    this.friction = 0
  }
  distance(point: Vector) {
    let x = Math.pow(this.x - point.x, 2)
    let y = Math.pow(this.y - point.y, 2)
    return Math.sqrt(x + y)
  }
  setVelocity(velocity: number) {
    this.x = Math.cos(this.theta) * velocity
    this.y = Math.sin(this.theta) * velocity
  }
  setFriction(friction: number) {
    this.friction = friction
  }
  getX(): number {
    if (this.friction) {
      this.x *= this.friction
    }
    return this.x
  }
  getY(): number {
    if (this.friction) {
      this.y *= this.friction
    }
    return this.y
  }  
  getTheta(): number {
    return this.theta
  }
  setTheta(theta: number) {
    this.theta = theta
  }
}

export default Vector