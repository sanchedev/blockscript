import { useDragStore } from '../stores/drag-store'

export function useDrag() {
  const used = useDragStore((state) => state.used)
  const start = useDragStore((state) => state.start)
  const use = useDragStore((state) => state.use)
  const end = useDragStore((state) => state.end)

  return {
    used,
    start,
    use,
    end,
  }
}

export function useCurrentDrag() {
  const dragData = useDragStore((state) => state.dragData)
  return dragData
}
