import Body from "./Body";
import { WeaponType } from "./Weapon";

class Bullet extends Body {
  _draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath()
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2, false)
    ctx.closePath()

    ctx.fillStyle = 'white'
    ctx.fill()
  }
}

class BulletWeapon {
  type: WeaponType;
  ammos: { [id: number]: Bullet };
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
      let newBullet = new Bullet(body.x, body.y, body.theta, this.velocity, this.radius, 0)
      // this.bullets.push(newBullet)
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
    Object.values(this.ammos).forEach((bullet: Bullet) => bullet.draw(ctx))
  }
  update() {
    Object.entries(this.ammos).forEach(([id, bullet]: [string, Bullet]) => {
      bullet.update()

      // Additional logic to remove bullets that are out of bound
      if (bullet.x > window.innerWidth ||
        bullet.x < 0 ||
        bullet.y > window.innerWidth ||
        bullet.y < 0) {
        delete this.ammos[Number(id)]
      }
    })
  }
}

export default BulletWeapon
