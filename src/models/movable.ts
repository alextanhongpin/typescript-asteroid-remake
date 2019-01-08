import { Observer, Observable } from 'models/observable'
import KeyCode from 'utils/keycode'

export interface Movable {
	velocity: number;
	theta: number;
	friction: number;
}

export class Controller extends Observable implements Observer {
}

export class KeyboardController extends Controller {
	handler: any;

	constructor() {
		super()
		this.handler = this.bindEvents.bind(this)
    document.addEventListener('keydown', this.handler, false)
	}

	private bindEvents (evt: KeyboardEvent) {
    evt.keyCode === KeyCode.Up && this.emit('key:up')
    evt.keyCode === KeyCode.Left && this.emit('key:left') 
    evt.keyCode === KeyCode.Right && this.emit('key:right') 
    evt.keyCode === KeyCode.Shift && this.emit('key:shift') 
    evt.keyCode === KeyCode.Space && this.emit('key:space') 
    evt.keyCode === KeyCode.Enter && this.emit('key:enter') 
	}
}
