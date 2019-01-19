import { SphereCharacter } from 'models/character';
import Math2 from 'utils/math2';

export class Asteroid extends SphereCharacter {
  friction = 0;
  velocity = Math2.random(0.5, 2);
  theta = Math2.randomTheta();
}
