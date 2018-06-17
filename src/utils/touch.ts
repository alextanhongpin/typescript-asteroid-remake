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

  if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
    return true
  }
  // include the 'heartz' as a way to have a non matching MQ to help terminate the join
  // https://git.io/vznFH
  let query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('')
  return mq(query)
}