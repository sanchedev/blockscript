import { Signal } from './signal'

export const currentDragPosition = new Signal<[x: number, y: number]>([0, 0])
