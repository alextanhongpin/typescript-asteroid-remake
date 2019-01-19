type Event = symbol | string

export interface Observer {
	on(event: Event, fn: Function): void
	once(event: Event, fn: Function): void
	off(event: Event): void
	emit(event: Event, ...args: any[]): void
}

export class Observable implements Observer {
	private events: Map<Event, Function[]> = new Map()
	on(event: Event, fn: Function) {
		if (!(this.events.has(event))) {
			this.events.set(event, [])
		}
		this.events.get(event)!.push(fn)
	}
	once(event: Event, fn: Function) {
		if (this.events.has(event)) {
			return
		}
		this.events.set(event, [fn])
	}
	off(event: Event) {
		this.events.delete(event)
	}
	emit(event: Event, ...args: any[]) {
		const events = this.events.get(event)
		if (events) {
			events.forEach(event => event.apply(this, args))
		}
	}
}
