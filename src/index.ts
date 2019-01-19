import {
  withHealthBar,
  withTeleport,
  Boundary,
  withRepeatBoundary,
  withBullets,
  Ship,
  GameEngine,
  KeyboardController,
  Asteroid,
  Alien,
  TRACK,
  withGun,
  Observer,
} from 'models/index';

import Math2 from 'utils/math2';

'use strict';

(function() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const canvas = <HTMLCanvasElement>document.getElementById('canvas');
  canvas.width = width;
  canvas.height = height;

  const keyboard = new KeyboardController();
  const boundary = new Boundary();

  const game = new GameEngine(canvas);
  game.register((obs: Observer) => {
    const ship = makeShip(obs, boundary);
    ship.registerController(keyboard);

    const aliens = makeAlien(obs, boundary, 2);
    aliens.forEach((alien: any) => {
      alien.emit(TRACK, ship);
    });
    makeAsteroids(obs, boundary, 10);
  });
  game.start();
})();

function makeAlien(obs: Observer, boundary: Boundary, n: number): any {
  return Array(n)
    .fill(() => {
      const x = Math2.randomX();
      const y = Math2.randomY();
      const radius = 15;
      const bounded = withRepeatBoundary(boundary);
      return new (withHealthBar(false)(withGun(withBullets(bounded(Alien)))))(
        obs,
        x,
        y,
        radius,
      );
    })
    .map((fn) => fn());
}

function makeShip(obs: Observer, boundary: Boundary): any {
  // NOTE: The type is no longer Ship, but something that extends Ship.
  const bounded = withRepeatBoundary(boundary);
  const BattleShip = withBullets(
    withTeleport(withHealthBar(true)(bounded(Ship))),
  );
  const x = boundary.midX;
  const y = boundary.midY;
  const radius = 15;
  return new BattleShip(obs, x, y, radius);
}

function makeAsteroids(obs: Observer, boundary: Boundary, n: number): any {
  const bounded = withRepeatBoundary(boundary);
  const BoundedAsteroid = withHealthBar(false)(bounded(Asteroid));
  const [minRadius, maxRadius] = [30, 50];
  const asteroids = Array(n)
    .fill(() => {
      return new BoundedAsteroid(
        obs,
        Math2.randomX(),
        Math2.randomY(),
        Math2.random(minRadius, maxRadius),
        false,
      );
    })
    .map((fn) => fn());
  return asteroids;
}
