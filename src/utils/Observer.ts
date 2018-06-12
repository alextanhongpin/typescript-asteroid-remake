class Observer {
  private events: { [id: string]: Function }
  constructor() {
    this.events = {}
  }
  on(event: string, fn: Function) {
    if (!this.events[event]) {
      this.events[event] = fn
    }
  }
  emit(event: string, ...args: any[]) {
    if (this.events[event]) {
      this.events[event](...args)
    }
  }
}

export default Observer