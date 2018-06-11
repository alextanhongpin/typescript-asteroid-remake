import WeaponEnum from '../models/WeaponEnum'
import CanvasShape from './CanvasShape';
import Point from '../models/Point';
import Vector from '../models/Vector';

// An example on extending interfaces with TypeScript
interface Weapon extends CanvasShape {
  type: WeaponEnum;
  ammos: CanvasShape[];
  fire(point: Point, vector: Vector): void;
  clear(): void;
}

export default Weapon