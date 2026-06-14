import { create } from 'zustand'
import type { ExprId } from '../lib/ui/exprs'
import type { StmtId } from '../lib/ui/stmts'

export type DragBlockId = StmtId | ExprId

interface BlockDragStore {
  positions: { id: DragBlockId; x: number; y: number }[]
  add(id: DragBlockId, x: number, y: number): void
  move(id: string, x: number, y: number): void
  remove(id: string): boolean
  has(id: string): boolean
}

export const useBlockDragStore = create<BlockDragStore>((set, get) => ({
  positions: [],
  add(id, x, y) {
    set({
      positions: [...get().positions, { id, x, y }],
    })
  },
  move(id, x, y) {
    const positions = get().positions.slice()
    const posIndex = positions.findIndex((p) => p.id === id)
    if (posIndex === -1) return

    positions[posIndex] = { ...positions[posIndex], x, y }
    set({ positions })
  },
  remove(id) {
    const old = get().positions
    const positions = old.filter((p) => p.id !== id)
    if (old.length === positions.length) return false
    set({ positions })
    return true
  },
  has(id) {
    return get().positions.some((p) => p.id === id)
  },
}))
