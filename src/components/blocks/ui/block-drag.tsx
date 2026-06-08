import clsx from 'clsx'
import { useTransformContext } from 'react-zoom-pan-pinch'
import { useBlockDrag } from '../../../hooks/block-drag'
import { useCurrentDrag, useDrag } from '../../../hooks/drag'
import { Stmt } from '../../../lib/blocks/statements'
import { Expr } from '../../../lib/blocks/expressions'
import { useRenderTree } from '../../../hooks/render-tree'

export function BlockDrag({
  obj,
  disabled = false,
  className,
  onRemove,
  ...rest
}: {
  obj: Stmt | Expr
  disabled?: boolean
  onRemove: () => void
} & React.HTMLAttributes<HTMLDivElement>) {
  const { start, end, move } = useDrag()
  const data = useCurrentDrag()

  const renderTree = useRenderTree()
  const { remove } = useBlockDrag()

  const { state } = useTransformContext()

  const type = obj instanceof Expr ? 'expr' : 'stmt'
  const id = `${type}=${obj.id}`

  const handleDragStart = (ev: React.DragEvent) => {
    ev.stopPropagation()
    ev.dataTransfer.setData('text/plain', id)
    ev.dataTransfer.setDragImage(new Image(), 0, 0)
    const { left, top } = ev.currentTarget.getBoundingClientRect()
    start({
      obj,
      pickPosition: { x: ev.clientX - left, y: ev.clientY - top },
      unlock: () => {
        if (!remove(obj.id)) onRemove()
        renderTree()
      },
    })
    move(calcPos(left, top))
    ev.dataTransfer.dropEffect = 'move'
  }
  const handleDrag = (ev: React.DragEvent) => {
    ev.stopPropagation()
    move(
      calcPos(
        ev.clientX - (data?.pickPosition.x ?? 0),
        ev.clientY - (data?.pickPosition.y ?? 0),
      ),
    )
  }
  const handleDragEnd = (ev: React.DragEvent) => {
    ev.stopPropagation()
    end()
  }

  const calcPos = (cX: number, cY: number) => {
    const { positionX, positionY, scale } = state

    const x = -(positionX - cX + 0) / scale
    const y = -(positionY - cY + 64) / scale

    return { x, y }
  }

  function iS<T>(t: T, f?: T) {
    return !disabled ? t : f
  }

  return (
    <div
      id={id}
      draggable={iS(true)}
      className={clsx(
        'locked',
        data?.obj.id === obj.id && 'opacity-0',
        className,
      )}
      onDragStart={iS(handleDragStart)}
      onDrag={iS(handleDrag)}
      onDragEnd={iS(handleDragEnd)}
      {...rest}
    />
  )
}
