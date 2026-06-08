import { useBlockDragStore } from '../stores/block-drag-store'

export function useBlockDrag() {
  const add = useBlockDragStore((state) => state.add)
  const move = useBlockDragStore((state) => state.move)
  const replace = useBlockDragStore((state) => state.replace)
  const remove = useBlockDragStore((state) => state.remove)
  const find = useBlockDragStore((state) => state.find)
  const has = useBlockDragStore((state) => state.has)

  return {
    add,
    move,
    replace,
    remove,
    find,
    has,
  }
}

export function useBlockDragPositions() {
  const positions = useBlockDragStore((state) => state.positions)
  return positions
}
