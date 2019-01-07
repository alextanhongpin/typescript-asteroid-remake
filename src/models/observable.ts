export interface Observer {
	on(event: string, fn: Function): void
	off(event: string, fn: Function): void
	emit(event: string, ...args: any[]): void
}

export class Observable implements Observer {
	private events: Record<string, Function[]> = {}
	on(event: string, fn: Function) {
		if (!(event in this.events)) {
			this.events[event] = []
		}
		this.events[event].push(fn)
	}
	off(event: string, fn: Function) {
		if (event in this.events) {
			this.events[event] = this.events[event].filter((prev: Function) => {
				return fn !== prev
			})
			if (!this.events[event].length) {
				delete this.events[event]
			}
		}
	}
	emit(event: string, ...args: any[]) {
		if (event in this.events) {
			for (let fn of this.events[event]) {
				fn.apply(this, args)
			}
		}
	}
}
