import { create } from 'zustand'
import type { Expr } from '../lib/blocks/expressions'

interface ExprDragStore {
  positions: { expr: Expr; x: number; y: number }[]
  add(expr: Expr, x: number, y: number): void
  move(id: string, x: number, y: number): void
  remove(id: string): void
  find(id: string): Expr | undefined
  has(id: string): boolean
}

export const useExprDrag = create<ExprDragStore>((set, get) => ({
  positions: [],
  add(expr, x, y) {
    set({ positions: [...get().positions, { expr, x, y }] })
  },
  move(id, x, y) {
    const positions = get().positions.slice()
    const posIndex = positions.findIndex(({ expr }) => expr.id === id)
    if (posIndex === -1) return

    const pos = { ...positions[posIndex], x, y }
    positions[posIndex] = pos
    set({ positions })
  },
  remove(id) {
    const positions = get().positions.slice()
    const posIndex = positions.findIndex(({ expr }) => expr.id === id)
    if (posIndex === -1) return

    positions.splice(posIndex, 1)
    set({ positions })
  },
  find(id) {
    return get().positions.find(({ expr }) => expr.id === id)?.expr
  },
  has(id) {
    return get().positions.some(({ expr }) => expr.id === id)
  },
}))
