import { create } from 'zustand'
import type { Stmt } from '../lib/blocks/statements'
import type { Expr } from '../lib/blocks/expressions'

interface DragData {
  obj: Stmt | Expr
  pickPosition: { x: number; y: number }
  unlock(): void
}

interface DragStore {
  data: DragData | null
  startDrag(data: DragData): void
  endDrag(): void
}

export const useDrag = create<DragStore>((set) => ({
  data: null,
  startDrag(data) {
    set({ data })
  },
  endDrag() {
    set({ data: null })
  },
}))
