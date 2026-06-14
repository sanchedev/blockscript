import { useBlockDragStore } from '../stores/block-drag-store'

export function useBlockDrag() {
  const add = useBlockDragStore((state) => state.add)
  const move = useBlockDragStore((state) => state.move)
  const remove = useBlockDragStore((state) => state.remove)
  const has = useBlockDragStore((state) => state.has)

  return {
    add,
    move,
    remove,
    has,
  }
}

export function useBlockDragPositions() {
  return useBlockDragStore((state) => state.positions)
}
