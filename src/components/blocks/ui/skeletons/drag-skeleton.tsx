import { useEffect, useState } from 'react'
import { useCurrentDrag } from '../../../../hooks/drag'
import { Skeleton } from './skeleton'
import { currentDragPosition } from '../../../../lib/event/events'

export function DragSkeleton() {
  const data = useCurrentDrag()
  const [[x, y], setPos] = useState(currentDragPosition.get())

  useEffect(() => {
    const handleDragPosChange = (x: number, y: number) => {
      if (data == null) return
      setPos([x, y])
    }

    currentDragPosition.on(handleDragPosChange)
    return () => {
      currentDragPosition.off(handleDragPosChange)
    }
  }, [data])

  if (data == null) return

  return (
    <Skeleton
      id={data.id}
      position={{ x, y }}
      className='opacity-100 z-20 pointer-events-none'
    />
  )
}
