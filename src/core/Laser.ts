import Body from "./Body";
import { WeaponType } from "./Weapon";

class Laser extends Body {
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.beginPath()


    let thetaX = Math.cos(this.theta)
    let thetaY = Math.sin(this.theta)
    ctx.moveTo(thetaX * this.radius, thetaY * this.radius)
    ctx.lineTo(thetaX * window.innerWidth, thetaY * window.innerWidth)
    ctx.lineWidth = 3

    let gradient = ctx.createLinearGradient(10, 0, 500, 0)
    gradient.addColorStop(0, 'red')
    gradient.addColorStop(1 / 6, 'orange')
    gradient.addColorStop(2 / 6, 'yellow')
    gradient.addColorStop(3 / 6, 'green')
    gradient.addColorStop(4 / 6, 'blue')
    gradient.addColorStop(5 / 6, 'indigo')
    gradient.addColorStop(1, 'violet')
    ctx.strokeStyle = gradient
    ctx.stroke()

    ctx.closePath()
    ctx.restore()
  }
}

class LaserWeapon {
  damage = 20;
  type: WeaponType;
  ammos: { [id: number]: Laser };
  count: number;
  radius: number;
  velocity: number;
  duration: number;
  private id: number;
  constructor(type: WeaponType, count: number, radius: number, velocity: number, duration: number) {
    this.type = type
    this.count = count
    this.radius = radius
    this.velocity = velocity
    this.duration = duration
    this.ammos = {}
    this.id = 0
  }
  reload(body: Body) {
    if (Object.keys(this.ammos).length < this.count) {
      let newBullet = new Laser(body.x, body.y, body.theta, this.velocity, this.radius, 0, 9999)
      this.ammos[++this.id] = newBullet
      let id = this.id
      window.setTimeout(() => {
        delete this.ammos[id]
      }, this.duration)
    }
  }
  empty() {
    this.ammos = []
  }
  draw(ctx: CanvasRenderingContext2D) {
    Object.values(this.ammos)
      .forEach((laser: Laser) => laser.draw(ctx))
  }
  update() {
    Object.values(this.ammos)
      .forEach((laser: Laser) => laser.update())
  }
}

export default LaserWeapon
