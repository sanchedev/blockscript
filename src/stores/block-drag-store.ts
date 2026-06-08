import { create } from 'zustand'
import type { Expr } from '../lib/blocks/expressions'
import type { Stmt } from '../lib/blocks/statements'

interface BlockDragStore {
  positions: { block: Stmt | Expr; x: number; y: number }[]
  add(block: Stmt | Expr, x: number, y: number): void
  move(id: string, x: number, y: number): void
  replace(block: Stmt | Expr): boolean
  remove(id: string): boolean
  find(id: string): Stmt | Expr | undefined
  has(id: string): boolean
}

export const useBlockDragStore = create<BlockDragStore>((set, get) => ({
  positions: [],
  add(block, x, y) {
    set({ positions: [...get().positions, { block, x, y }] })
  },
  move(id, x, y) {
    const positions = get().positions.slice()
    const posIndex = positions.findIndex(({ block }) => block.id === id)
    if (posIndex === -1) return

    const pos = { ...positions[posIndex], x, y }
    positions[posIndex] = pos
    set({ positions })
  },
  replace(block) {
    const oldPosition = get().positions.find(
      ({ block: b }) => b.id === block.id,
    )

    if (oldPosition == null) return false

    const position = { ...oldPosition, block }
    set({ positions: [...get().positions, position] })

    return true
  },
  remove(id) {
    const oldPositions = get().positions
    const positions = oldPositions.filter(({ block }) => block.id !== id)
    if (oldPositions.length === positions.length) return false

    set({ positions })
    return true
  },
  find(id) {
    return get().positions.find(({ block }) => block.id === id)?.block
  },
  has(id) {
    return get().positions.some(({ block }) => block.id === id)
  },
}))
