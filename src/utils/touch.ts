export function onTouch(element: HTMLElement, fn: Function) {
  element.addEventListener('touchstart', (evt: TouchEvent) => {
    evt.preventDefault()
    fn && fn()
  }, { passive: false })
}

export function isTouchDevice(): boolean {
  let prefixes = ' -webkit- -moz- -o- -ms- '.split(' ')
  let mq = function (query: string) {
    return window.matchMedia(query).matches
  }

  if (('ontouchstart' in window) || (window as any).DocumentTouch && document instanceof (window as any).DocumentTouch) {
    return true
  }
  // include the 'heartz' as a way to have a non matching MQ to help terminate the join
  // https://git.io/vznFH
  let query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('')
  return mq(query)
}

// let down = "mousedown", up = "mouseup", move = "mousemove", out = "mouseleave";
//
// if ((window as any).PointerEvent) {
//     down = "pointerdown";
//     move = "pointermove";
//     up = "pointerup";
//     out = "pointerleave";
// } else if ((('ontouchstart' in window) || (window as any).DocumentTouch && document instanceof DocumentTouch)) {
//     down = "touchstart";
//     move = "touchmove";
//     up = "touchend";
//     out = "touchend";
// }
