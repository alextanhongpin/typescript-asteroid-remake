import Vector from "./Vector"
import Point from "./Point"
import KeyCode from "../utils/KeyCode"
import Math2 from "../utils/Math2"
import Weapon from "../interfaces/Weapon";
import WeaponEnum from "./WeaponEnum";

class Ship {
  private point: Point;
  private vector: Vector;
  private weapons: Weapon[];
  private weapon: WeaponEnum;
  private scale: number;
  constructor(point: Point, vector: Vector, scale = 15) {
    this.point = point
    this.vector = vector
    this.scale = scale
    this.weapons = []
    this.weapon = WeaponEnum.Bullets
    this.bindListener()
  }
  setWeapons (...weapons: Weapon[]): Ship {
    this.weapons = weapons
    this.weapon = weapons && weapons.length && weapons[0].type
    return this
  }
  changeWeapon () {
    // this.weapons[this.weapon].clear()
    this.weapon++
    if (this.weapon >= this.weapons.length) {
      this.weapon = 0
    }
  }
  bindListener () {
    document.addEventListener('keydown', (evt) => {
      switch(evt.keyCode) {
        case KeyCode.Left: 
          this.turnLeft()
          break
        case KeyCode.Right:
          this.turnRight()
          break
        case KeyCode.Up:
          this.moveForward()
          break
        case KeyCode.Shift:
          this.teleport()
          break
        case KeyCode.Space:
          this.fire(this.point, this.vector)
          break
        case KeyCode.Enter:
          this.changeWeapon()
          break
      }
    })
  }
  fire(point: Point, vector: Vector) {
    this.weapons[this.weapon].fire(point, vector)
  }
  turnLeft () {
    this.vector.setTheta(this.vector.getTheta() - Math2.degreeToTheta(10))
  }
  turnRight () {
    this.vector.setTheta(this.vector.getTheta() + Math2.degreeToTheta(10))
  }
  moveForward () {
    this.vector.setVelocity(5)
  }
  teleport () {
    this.point.setX(Math2.random(0, window.innerWidth))
    this.point.setY(Math2.random(0, window.innerHeight))
  }
  private _drawShip (ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.translate(this.point.getX(), this.point.getY())
    ctx.rotate(this.vector.getTheta())
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(-this.scale, -this.scale)
    ctx.lineTo(this.scale, 0)
    ctx.lineTo(-this.scale, this.scale)
    ctx.closePath()
    ctx.strokeStyle = 'white'
    ctx.stroke()
    ctx.restore()
  }
  private _drawWeapon (ctx: CanvasRenderingContext2D) {
    // if (this.weapons.length) {
      // this.weapons[this.weapon].draw(ctx)
    // }
    this.weapons.forEach(weapon => weapon.draw(ctx))
  }
  private _updateShip () {
    this.point.setX(this.point.getX() + this.vector.getX())
    this.point.setY(this.point.getY() + this.vector.getY())
  }
  private _updateWeapon () {
    // if (this.weapons.length) {
    //   this.weapons[this.weapon].update()
    // }
    this.weapons.forEach(weapon => weapon.update())
  }
  draw (ctx: CanvasRenderingContext2D) {
    this._drawShip(ctx)
    this._drawWeapon(ctx)
  }
  update () {
    this._updateShip()
    this._updateWeapon()
  }
}

export default Ship

// class Ship {
//   private weapons: string[];
//   private weaponChoice: number;
  
//   constructor (x = 0, y = 0, theta = 0) {
//     this.weapons = ['bullet', 'laser']
//     this.weaponChoice = 0
//     this.x = x
//     this.y = y
//     this.vx = 0
//     this.vy = 0
//     this.theta = theta

//     this.distance = 1
//     this.friction = 0.95
//     this.rotation = 10 // 1 rotation is equal 10 degrees

//     this.scale = 3 // 1 point equals 10px
//     this.actions()
//     // Isolate to weapon class
//     this.bullets = []
//     this.laser = []

//     this.isDamaged = false
//     // message(this.weapons[this.weaponChoice])
//     this.collisionTime = null
//   }
//   actions () {
//     document.addEventListener('keydown', (evt) => {
//       if (evt.keyCode === KeyCode.Enter) {
//         this.weaponChoice++
//         if (this.weaponChoice > this.weapons.length - 1) {
//           this.weaponChoice = 0
//         }
//         const choice = this.weapons[this.weaponChoice]
//         if (choice === 'bullet') {
//           this.laser = []
//         } else {
//           this.bullets = []
//         }
//         message(this.weapons[this.weaponChoice])
//       }
//       if (evt.keyCode === KeyCode.Up) {
//         this.vx += this.distance * Math.cos(this.theta)
//         this.vy += this.distance * Math.sin(this.theta)
//       }

//       if (evt.keyCode === KeyCode.Right) {
//         this.theta += Math2.degreeToTheta(this.rotation)
//       }

//       if (evt.keyCode === KeyCode.Left) {
//         this.theta -= Math2.degreeToTheta(this.rotation)
//       }

//       if (evt.keyCode === KeyCode.Shift) {
//         this.teleport()
//       }

//       if (evt.keyCode === KeyCode.Space) {
//         this.fire()
//       }
//     })
//   }
//   checkCollision (...points) {
//     const distance = (p1, p2) => {
//       let x = Math.pow(p1.x - p2.x, 2)
//       let y = Math.pow(p1.y - p2.y, 2)
//       return Math.sqrt(x + y)
//     }
//     points.forEach((point) => {
//       let shipPoint = {x: this.x, y: this.y}
//       if (distance(shipPoint, point) < point.radius) {
//         if (this.collisionInterval) {
//           window.clearTimeout(this.collisionInterval)
//         }
//         this.isDamaged = true
//         this.collisionInterval = window.setTimeout(() => {
//           // Deduct hp, show recovering state
//           this.isDamaged = false
//           console.log('recover')
//         }, 1000)
//       }
//     })
//   }
//   fire () {
//     // Max 3 bullets
//     let weapon = this.weapons[this.weaponChoice]
//     if (weapon === 'bullet') {
//       if (this.bullets.length > 5) {
//         this.bullets.shift()
//       }
//       this.bullets.push(new Bullet(this.x, this.y, 3, this.theta))
//     }
//     if (weapon === 'laser') {
//       if (!this.laser.length) {
//         this.laser.push(new Laser(this.x, this.y, this.theta))
//         window.setTimeout(() => {
//           this.laser = []
//         }, 500)
//       }
//     }
//   }

//   teleport () {
//     this.x = Math.floor(Math.random() * window.innerWidth)
//     this.y = Math.floor(Math.random() * window.innerHeight)
//   }

//   move (boundX, boundY) {
//     this.vx *= this.friction
//     this.vy *= this.friction
//     this.x += this.vx
//     this.y += this.vy

//     // Handle the ship going out of bound
//     if (this.x < 0) {
//       this.x = boundX
//     }
//     if (this.x > boundX) {
//       this.x = 0
//     }
//     if (this.y < 0) {
//       this.y = boundY
//     }
//     if (this.y > boundY) {
//       this.y = 0
//     }

//     let weapon = this.weapons[this.weaponChoice]
//     if (weapon === 'bullet') {
//       this.bullets.forEach(bullet => bullet.move())
//     } else if (weapon === 'laser') {
//       this.laser.forEach(laser => laser.move(this.x, this.y, this.theta))
//     }
//   }
//   draw (ctx) {
//     ctx.save()
//     ctx.strokeStyle = 'white'
//     ctx.translate(this.x, this.y)
//     ctx.rotate(this.theta)
//     ctx.beginPath()
//     // Translate before rotate
//     if (this.isDamaged) {
//       ctx.globalAlpha = 0.5
//       if (!this.collisionTime) {
//         this.collisionTime = Date.now()
//       }

//       if (Date.now() - this.collisionTime > 200) {
//         ctx.globalAlpha = 0.5
//       }
//       if (Date.now() - this.collisionTime > 400) {
//         ctx.globalAlpha = 1
//       }
//       if (Date.now() - this.collisionTime > 600) {
//         ctx.globalAlpha = 0.5
//       }
//       if (Date.now() - this.collisionTime > 800) {
//         ctx.globalAlpha = 1
//       }

//       if (Date.now() - this.collisionTime > 1000) {
//         ctx.globalAlpha = 0.5
//         this.collisionTime = null
//       }
//     }
//     ctx.moveTo(0, 0)
//     ctx.lineTo(-5 * this.scale, -5 * this.scale)
//     ctx.lineTo(5 * this.scale, 0)
//     ctx.lineTo(-5 * this.scale, 5 * this.scale)
//     ctx.closePath()
//     ctx.stroke()
//     ctx.restore()

//     let weapon = this.weapons[this.weaponChoice]
//     if (weapon === 'bullet') {
//       this.bullets.forEach(bullet => bullet.draw(ctx))
//     } else if (weapon === 'laser') {
//       this.laser.forEach(laser => {
//         // Disable movement when shooting laser
//         // this.vx = 0
//         // this.vy = 0
//         laser.draw(ctx)
//       })
//     }
//   }
// }


// export default Ship