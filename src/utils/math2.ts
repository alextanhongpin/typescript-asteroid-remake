interface Point {
  x: number;
  y: number;
}

class Math2 {
  static thetaToDegree(theta: number) {
    return (theta * Math.PI) / 2;
  }
  static degreeToTheta(degree: number) {
    return (degree * Math.PI) / 180;
  }
  static random(min: number, max: number) {
    return Math.floor(Math.random() * max) + min;
  }
  static angle(x1: number, y1: number, x2: number, y2: number) {
    return Math.atan2(y2 - y1, x2 - x1);
  }
  static angleBetween(p1: Point, p2: Point) {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x);
  }
  static randomTheta() {
    return Math2.random(0, 2 * Math.PI);
  }
  static randomX() {
    return Math2.random(0, window.innerWidth);
  }
  static randomY() {
    return Math2.random(0, window.innerHeight);
  }
}

export default Math2;
