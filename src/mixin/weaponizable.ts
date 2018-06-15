import Body from "../core/body";
import { Weapon, WeaponType } from "../core/weapon";

export interface WeaponState {
  choice: WeaponType;
  weapons: Weapon[];
  x: number;
  y: number;
  theta: number;
  observerTheta: number
}

export default class Weaponizable {
  _weaponState: WeaponState = {
    x: 0,
    y: 0,
    theta: 0,
    observerTheta: 0,
    choice: -1,
    weapons: []
  }
  _setWeapons(...weapons: Weapon[]) {
    this._weaponState.weapons = weapons
    if (this._weaponState.weapons.length) {
      this._weaponState.choice = this._weaponState.weapons[0].type
    }
  }
  _getWeapon(): Weapon {
    let { weapons, choice } = this._weaponState
    return weapons[choice]
  }
  _swapWeapon() {
    this._weaponState.choice++
    if (this._weaponState.choice > this._weaponState.weapons.length - 1) {
      this._weaponState.choice = 0
    }
    // switch (this._weaponState.choice) {
    //   case WeaponType.Laser:
    //     this.emit('message', 'the laser is beautiful (but useless)')
    //     break
    //   case WeaponType.Bullet:
    //     this.emit('message', 'old school weapon works wonders')
    //     break
    // }
  }
  _drawWeapon(ctx: CanvasRenderingContext2D) {
    let { weapons } = this._weaponState
    weapons.forEach(weapon => weapon.draw(ctx))
  }
  _updateWeapon() {
    let { weapons, x, y, theta } = this._weaponState
    weapons.forEach(weapon => {
      if (weapon.type === WeaponType.Laser) {
        Object.values(weapon.ammos).forEach((ammo: Body) => {
          ammo.x = x
          ammo.y = y
          ammo.theta = theta
        })
      }

      weapon.update()
    })
  }
}