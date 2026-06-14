import type { Fun } from './types'

export class Signal<T extends unknown[]> {
  #value: T

  #listeners = new Set<Fun<T>>()

  constructor(value: T) {
    this.#value = value
  }

  get() {
    return this.#value
  }

  on(cb: Fun<T>) {
    this.#listeners.add(cb)
  }
  off(cb: Fun<T>) {
    this.#listeners.delete(cb)
  }

  emit(...args: T) {
    this.#listeners.forEach((fn) => fn(...args))
  }
}
