class Math2 {
  static thetaToDegree(theta: number) {
    return theta * Math.PI / 2
  }
  static degreeToTheta(degree: number) {
    return degree * Math.PI / 180
  }
  static random(min: number, max: number) {
    return Math.floor(Math.random() * max) + min
  }
  static angle(x1: number, y1: number, x2: number, y2: number) {
    return Math.atan2(y2 - y1, x2 - x1)
  }
}

export default Math2
