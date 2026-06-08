import { create } from 'zustand'
import type { Stmt } from '../lib/blocks/statements'
import type { Expr } from '../lib/blocks/expressions'

interface Position {
  x: number
  y: number
}

interface DragData {
  obj: Stmt | Expr
  pickPosition: { x: number; y: number }
  unlock(): void
}

interface DragStore {
  dragData: DragData | null
  position: Position | null
  used: boolean
  start(dragData: DragData): void
  move(position: Position): void
  use(): void
  end(): void
}

export const useDragStore = create<DragStore>((set, get) => ({
  dragData: null,
  position: null,
  used: false,
  start(dragData) {
    set({ dragData })
  },
  move(position) {
    set({ position })
  },
  use() {
    if (get().dragData == null) return
    set({ used: true })
  },
  end() {
    set({ dragData: null, used: false, position: null })
  },
}))
