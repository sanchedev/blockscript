import type { Fun } from './types'

export class Event<T extends unknown[]> {
  #listeners = new Set<Fun<T>>()
  #once = new Set<Fun<T>>()

  on(cb: Fun<T>) {
    this.#listeners.add(cb)
  }
  once(cb: Fun<T>) {
    this.#listeners.add(cb)
    this.#once.add(cb)
  }
  off(cb: Fun<T>) {
    this.#listeners.delete(cb)
    if (this.#once.has(cb)) {
      this.#once.delete(cb)
    }
  }

  emit(...args: T) {
    this.#listeners.forEach((fn) => fn(...args))
    this.#once.forEach((fn) => this.#listeners.delete(fn))
    this.#once.clear()
  }
}
