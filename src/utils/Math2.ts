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
}

export default Math2