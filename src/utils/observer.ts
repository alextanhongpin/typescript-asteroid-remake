export type ObserverEvents = {
  [index: string]: string
}

export class Observer {
  private events: { [id: string]: Function[] }
  constructor() {
    this.events = {}
  }
  on(event: string, fn: Function) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(fn)
  }
  emit(event: string, ...args: any[]) {
    if (this.events[event] && this.events[event].length > 0) {
      this.events[event].forEach((fn: Function) => fn(...args))
    }
  }
  off(event: string) {
    if (this.events[event]) {
      delete this.events[event]
    }
  }
}

export function makeObserver(): Observer {
  return new Observer()
}
