import { create } from 'zustand'
import type { DragBlockId } from './block-drag-store'

interface DragData {
  id: DragBlockId
  pickPosition: { x: number; y: number }
  unlock(): void
}

interface DragStore {
  dragData: DragData | null
  used: boolean
  start(dragData: DragData): void
  use(): void
  end(): void
}

export const useDragStore = create<DragStore>((set, get) => ({
  dragData: null,
  used: false,
  start(dragData) {
    set({ dragData })
  },
  use() {
    if (get().dragData == null) return
    set({ used: true })
  },
  end() {
    set({ dragData: null, used: false })
  },
}))
