import Body from "./Body"
import HealthBar from "./HealthBar";
import Math2 from "../utils/Math2";
import Effect from "./Effect";
import { Weapon, WeaponType } from "./Weapon";

class Alien extends Body {
  healthBar?: HealthBar
  eyeX = 5;
  eyeY = 5;
  eyeTheta = 0;
  private effect?: Effect;
  private weapons: Weapon[];
  private weaponChoice: WeaponType;
  constructor(x: number, y: number, theta: number, velocity: number, radius: number, friction: number, hp: number) {
    super(x, y, theta, velocity, radius, friction, hp)
    this.weapons = []
    this.weaponChoice = -1
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.translate(this.x, this.y)

    // The head
    ctx.beginPath()
    ctx.moveTo(-15, -3)
    ctx.bezierCurveTo(-20, -15, 20, -15, 15, -3)
    ctx.strokeStyle = 'white'
    ctx.stroke()
    ctx.closePath()

    // The eye
    ctx.beginPath()
    ctx.arc(this.eyeX * Math.cos(this.eyeTheta), -5 + this.eyeY * Math.sin(this.eyeTheta), 2, 0, Math.PI * 2, false)
    ctx.fillStyle = 'white'
    ctx.fill()
    ctx.closePath()

    ctx.beginPath()
    ctx.rect(-20, -3, 40, 3)
    ctx.strokeStyle = 'white'
    ctx.stroke()
    ctx.closePath()

    ctx.beginPath()
    ctx.moveTo(20, 0)
    ctx.lineTo(30, 5)
    ctx.lineTo(-30, 5)
    ctx.lineTo(-20, 0)
    ctx.moveTo(15, 5)
    ctx.lineTo(18, 10)
    ctx.moveTo(-15, 5)
    ctx.lineTo(-18, 10)
    ctx.strokeStyle = 'white'
    ctx.stroke()
    ctx.closePath()

    ctx.restore()

    this.healthBar!.draw(ctx)
    this.effect!.draw(ctx)
    this.weapons.forEach(w => w.draw(ctx))
  }
  setup() {
    window.setInterval(() => {
      this.effect!.setup(this)
      this.x = Math2.random(0, window.innerWidth)
      this.y = Math2.random(0, window.innerWidth)
      this.theta = Math2.random(0, Math.PI * 2)
      this.velocity = 0

      // Shoot twice
      for (let i = 0; i < 2; i += 1) {
        window.setTimeout(() => {
          if (i === 0) {
            this.velocity = Math2.random(1, 3)
          }
          this.observerTheta = this.eyeTheta
          this.getWeapon().reload(this)
        }, 500 * i)
      }
    }, 3000)
  }
  setWeapons(...weapons: Weapon[]): Alien {
    this.weapons = weapons
    if (this.weapons.length) {
      this.weaponChoice = this.weapons[0].type
    }
    return this
  }
  getWeapon(): Weapon {
    return this.weapons[this.weaponChoice]
  }
  setEffect(effect: Effect): Alien {
    this.effect = effect
    return this
  }
  setHealthBar(healthBar: HealthBar): Alien {
    this.healthBar = healthBar
    this.healthBar.hp = this.hp
    return this
  }
  update() {
    super.update()
    if (this.x > window.innerWidth) {
      this.x = 0
    }
    if (this.x < 0) {
      this.x = window.innerWidth
    }
    if (this.y > window.innerHeight) {
      this.y = 0
    }
    if (this.y < 0) {
      this.y = window.innerHeight
    }
    if (this.healthBar) {
      this.healthBar.hp = this.hp
      this.healthBar.x = this.x
      this.healthBar.y = this.y - 20
      this.healthBar.update()
    }
    this.effect!.update()
    this.weapons.forEach(weapon => weapon.update())
  }
}

export default Alien