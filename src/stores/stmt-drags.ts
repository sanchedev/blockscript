import { create } from 'zustand'
import type { Stmt } from '../lib/blocks/statements'

interface StmtDragStore {
  positions: { stmt: Stmt; x: number; y: number }[]
  add(stmt: Stmt, x: number, y: number): void
  move(id: string, x: number, y: number): void
  remove(id: string): void
  find(id: string): Stmt | undefined
  has(id: string): boolean
}

export const useStmtDrag = create<StmtDragStore>((set, get) => ({
  positions: [],
  add(stmt, x, y) {
    set({ positions: [...get().positions, { stmt, x, y }] })
  },
  move(id, x, y) {
    const positions = get().positions.slice()
    const posIndex = positions.findIndex(({ stmt }) => stmt.id === id)
    if (posIndex === -1) return

    const pos = { ...positions[posIndex], x, y }
    positions[posIndex] = pos
    set({ positions })
  },
  remove(id) {
    const positions = get().positions.slice()
    const posIndex = positions.findIndex(({ stmt }) => stmt.id === id)
    if (posIndex === -1) return

    positions.splice(posIndex, 1)
    set({ positions })
  },
  find(id) {
    return get().positions.find(({ stmt }) => stmt.id === id)?.stmt
  },
  has(id) {
    return get().positions.some(({ stmt }) => stmt.id === id)
  },
}))
