import { useCurrentDrag, useDragPosition } from '../../../../hooks/drag'
import { Skeleton } from './skeleton'

export function DragSkeleton() {
  const position = useDragPosition()
  const data = useCurrentDrag()

  if (data == null) return

  return (
    <Skeleton
      obj={data.obj}
      position={position ?? { x: 0, y: 0 }}
      className='opacity-100 z-20 pointer-events-none'
    />
  )
}
