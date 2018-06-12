import Body from "./Body";
import KeyCode from "../utils/KeyCode";
import Math2 from "../utils/Math2";
import { Weapon, WeaponType } from "./Weapon";

class Ship extends Body {
  private weapons: Weapon[];
  private weaponChoice: WeaponType;
  constructor(x: number, y: number, theta: number, velocity: number, radius: number, friction: number) {
    super(x, y, theta, velocity, radius, friction)
    this.weapons = []
    this.weaponChoice = -1
  }
  setWeapons(...weapons: Weapon[]): Ship {
    this.weapons = weapons
    if (this.weapons.length) {
      this.weaponChoice = this.weapons[0].type
    }
    return this
  }
  setup() {
    document.addEventListener('keydown', (evt) => {
      switch (evt.keyCode) {
        case KeyCode.Left:
          this.theta -= Math2.degreeToTheta(10)
          break
        case KeyCode.Right:
          this.theta += Math2.degreeToTheta(10)
          break
        case KeyCode.Up:
          this.velocity = 5
          break
        case KeyCode.Shift:
          // Perform teleportation
          this.x = Math2.random(0, window.innerWidth)
          this.y = Math2.random(0, window.innerHeight)
          break
        case KeyCode.Space:
          // Fire ahead!
          this.getWeapon().reload(this)
          break
        case KeyCode.Enter:
          // Switch Weapons
          this.swapWeapon()
          break
      }
    })
  }
  getWeapon(): Weapon {
    return this.weapons[this.weaponChoice]
  }
  swapWeapon() {
    this.weaponChoice++
    if (this.weaponChoice > this.weapons.length - 1) {
      this.weaponChoice = 0
    }
  }
  _update() {
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

    this.weapons.forEach(weapon => {
      if (weapon.type === WeaponType.Laser) {
        Object.values(weapon.ammos).forEach((ammo: Body) => {
          ammo.x = this.x
          ammo.y = this.y
          ammo.theta = this.theta
        })
      }
      weapon.update()
    })
  }
  _draw(ctx: CanvasRenderingContext2D) {
    let dimension = this.radius

    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(-dimension, -dimension)
    ctx.lineTo(dimension, 0)
    ctx.lineTo(-dimension, dimension)
    ctx.closePath()

    ctx.fillStyle = 'white'
    ctx.fill()
  }
  _drawOthers(ctx: CanvasRenderingContext2D) {
    this.weapons.forEach(w => w.draw(ctx))
  }
}

export default Ship