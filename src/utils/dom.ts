// DOM utilities

export function $(selector: string, context: Document | Element = document): Element | null {
  return context.querySelector(selector)
}

export function $$(selector: string, context: Document | Element = document): NodeListOf<Element> {
  return context.querySelectorAll(selector)
}

export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attributes: Record<string, string> = {},
  children: (Node | string)[] = []
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag)
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'class') {
      element.className = value
    } else if (key === 'style') {
      element.setAttribute('style', value)
    } else if (key.startsWith('on') && typeof value === 'function') {
      element.addEventListener(key.slice(2).toLowerCase(), value as EventListener)
    } else {
      element.setAttribute(key, value)
    }
  })
  children.forEach(child => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child))
    } else {
      element.appendChild(child)
    }
  })
  return element
}

export function addClass(element: Element, ...classes: string[]): void {
  element.classList.add(...classes)
}

export function removeClass(element: Element, ...classes: string[]): void {
  element.classList.remove(...classes)
}

export function toggleClass(element: Element, className: string, force?: boolean): boolean {
  return element.classList.toggle(className, force)
}

export function hasClass(element: Element, className: string): boolean {
  return element.classList.contains(className)
}

export function setAttributes(element: Element, attributes: Record<string, string>): void {
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value)
  })
}

export function getData(element: Element, key: string): string | null {
  return element.getAttribute(`data-${key}`)
}

export function setData(element: Element, key: string, value: string): void {
  element.setAttribute(`data-${key}`, value)
}

export function on<K extends keyof HTMLElementEventMap>(
  element: Element | Window | Document,
  event: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  options?: AddEventListenerOptions
): () => void {
  element.addEventListener(event, handler as EventListener, options)
  return () => element.removeEventListener(event, handler as EventListener, options)
}

export function once<K extends keyof HTMLElementEventMap>(
  element: Element | Window | Document,
  event: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  options?: AddEventListenerOptions
): void {
  const wrappedHandler = (e: Event) => {
    handler(e as HTMLElementEventMap[K])
    element.removeEventListener(event, wrappedHandler as EventListener, options)
  }
  element.addEventListener(event, wrappedHandler as EventListener, options)
}

export function delegate<K extends keyof HTMLElementEventMap>(
  container: Element,
  selector: string,
  event: K,
  handler: (event: HTMLElementEventMap[K], target: Element) => void,
  options?: AddEventListenerOptions
): () => void {
  const listener = (event: Event) => {
    const target = (event.target as Element).closest(selector)
    if (target && container.contains(target)) {
      handler(event as HTMLElementEventMap[K], target)
    }
  }
  container.addEventListener(event, listener as EventListener, options)
  return () => container.removeEventListener(event, listener as EventListener, options)
}

export function getOffset(element: Element): { top: number; left: number } {
  const rect = element.getBoundingClientRect()
  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX
  }
}

export function getViewportSize(): { width: number; height: number } {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  }
}

export function isInViewport(element: Element, threshold = 0): boolean {
  const rect = element.getBoundingClientRect()
  const viewport = getViewportSize()
  return (
    rect.top <= viewport.height * (1 - threshold) &&
    rect.bottom >= viewport.height * threshold &&
    rect.left <= viewport.width * (1 - threshold) &&
    rect.right >= viewport.width * threshold
  )
}

export function scrollTo(element: Element | string, options: ScrollIntoViewOptions = { behavior: 'smooth', block: 'start' }): void {
  const target = typeof element === 'string' ? $(element) : element
  if (target) {
    target.scrollIntoView(options)
  }
}

export function lockScroll(): void {
  document.body.style.overflow = 'hidden'
  document.body.style.paddingRight = `${window.innerWidth - document.body.clientWidth}px`
}

export function unlockScroll(): void {
  document.body.style.overflow = ''
  document.body.style.paddingRight = ''
}

export function focusTrap(element: Element): () => void {
  const focusableElements = element.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  const handler = (e: Event) => {
    const ke = e as KeyboardEvent
    if (ke.key !== 'Tab') return

    if (ke.shiftKey) {
      if (document.activeElement === firstElement) {
        ke.preventDefault()
        lastElement?.focus()
      }
    } else {
      if (document.activeElement === lastElement) {
        ke.preventDefault()
        firstElement?.focus()
      }
    }
  }

  element.addEventListener('keydown', handler)
  firstElement?.focus()

  return () => {
    element.removeEventListener('keydown', handler)
  }
}