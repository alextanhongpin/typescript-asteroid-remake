import { Observable } from 'models/observable';
import KeyCode from 'models/keycode';

export const UP = Symbol('up');
export const DOWN = Symbol('down');
export const LEFT = Symbol('left');
export const RIGHT = Symbol('right');
export const SPACE = Symbol('space');
export const SHIFT = Symbol('shift');
export const ENTER = Symbol('enter');

export class Controller extends Observable {}

export class KeyboardController extends Controller {
  handler: any;

  constructor() {
    super();
    this.handler = this.bindEvents.bind(this);
    document.addEventListener('keydown', this.handler, false);
  }

  private bindEvents(evt: KeyboardEvent) {
    evt.keyCode === KeyCode.Up && this.emit(UP);
    evt.keyCode === KeyCode.Left && this.emit(LEFT);
    evt.keyCode === KeyCode.Right && this.emit(RIGHT);
    evt.keyCode === KeyCode.Shift && this.emit(SHIFT);
    evt.keyCode === KeyCode.Space && this.emit(SPACE);
    evt.keyCode === KeyCode.Enter && this.emit(ENTER);
  }
}
