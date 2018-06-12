import Body from "./Body";
import KeyCode from "../utils/KeyCode";
import Math2 from "../utils/Math2";
import { Weapon, WeaponType } from "./Weapon";
import Effect from "./Effect";
import HealthBar from "./HealthBar";

class Ship extends Body {
  private weapons: Weapon[];
  private weaponChoice: WeaponType;
  private effect?: Effect;
  healthBar?: HealthBar
  isFlickering?: boolean;
  alphaState: boolean;
  alpha: number;
  constructor(x: number, y: number, theta: number, velocity: number, radius: number, friction: number, hp: number) {
    super(x, y, theta, velocity, radius, friction, hp)
    this.weapons = []
    this.weaponChoice = -1
    this.alphaState = false
    this.alpha = 1
  }
  setWeapons(...weapons: Weapon[]): Ship {
    this.weapons = weapons
    if (this.weapons.length) {
      this.weaponChoice = this.weapons[0].type
    }
    return this
  }
  setEffect(effect: Effect): Ship {
    this.effect = effect
    return this
  }
  setHealthBar(healthBar: HealthBar): Ship {
    this.healthBar = healthBar
    this.healthBar.hp = this.hp
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
          this.effect!.setup(this)
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
    switch (this.weaponChoice) {
      case WeaponType.Laser:
        this.emit('message', 'the laser is beautiful (but useless)')
        break
      case WeaponType.Bullet:
        this.emit('message', 'old school weapon works wonders')
        break
    }
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

    this.effect!.update()
    if (this.healthBar) {
      this.healthBar.hp = this.hp
      this.healthBar.x = this.x
      this.healthBar.y = this.y - 20
      this.healthBar.update()
    }
  }
  draw(ctx: CanvasRenderingContext2D) {
    this._drawShip(ctx)
    this._drawOthers(ctx)
  }
  _drawShip(ctx: CanvasRenderingContext2D) {
    let dimension = this.radius
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.theta)
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(-dimension, -dimension)
    ctx.lineTo(dimension, 0)
    ctx.lineTo(-dimension, dimension)


    if (this.isFlickering) {
      if (this.alpha > 0.05) {
        if (!this.alphaState) {
          this.alpha -= 0.05
        }
      } else {
        this.alphaState = true
      }
      if (this.alphaState) {
        this.alpha += 0.05
        if (this.alpha > 0.95) {
          this.alphaState = false
        }
      }
    } else {
      this.alpha = 1
    }
    ctx.globalAlpha = this.alpha
    ctx.fillStyle = 'white'
    ctx.fill()
    ctx.closePath()
    ctx.restore()
  }
  _drawOthers(ctx: CanvasRenderingContext2D) {
    this.weapons.forEach(w => w.draw(ctx))
    this.effect!.draw(ctx)
    this.healthBar!.draw(ctx)
  }
}

export default Ship