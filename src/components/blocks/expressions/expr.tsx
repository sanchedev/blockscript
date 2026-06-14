import type { ExprId } from '../../../lib/ui/exprs'
import clsx from 'clsx'
import { ExprRenderer } from '../ui/expr-renderer'
import { BlockDrag, type BlockDragElement } from '../ui/block-drag'
import { IconTrash } from '@tabler/icons-react'
import { useBlockDragStore } from '../../../stores/block-drag-store'
import { useTreeStore } from '../../../stores/tree-store'

interface ExprCompProps extends BlockDragElement {
  id: ExprId
  disabled: boolean
  onUnlock?: () => void
  position?: {
    x: number
    y: number
  }
}

export function ExprComp({
  id,
  disabled,
  onUnlock,
  position,
  className,
  ...rest
}: ExprCompProps) {
  const { remove: removePosition } = useBlockDragStore()

  const handleRemove = () => {
    if (!onUnlock) removePosition(id)
    else onUnlock()
    useTreeStore.getState().removeExpr(id)
  }

  const handleUnlock = () => {
    if (!onUnlock) removePosition(id)
    else onUnlock()
  }

  return (
    <BlockDrag
      dragId={id}
      disabled={disabled}
      onRemove={handleRemove}
      onUnlock={handleUnlock}
      contextMenuOptions={[
        {
          icon: IconTrash,
          label: 'Eliminar',
          variant: 'destructive',
          action: handleRemove,
        },
      ]}
      className={clsx(position ? 'absolute' : 'relative', className)}
      style={
        position
          ? {
              top: position.y,
              left: position.x,
            }
          : undefined
      }
      {...rest}>
      <ExprRenderer id={id} disabled={disabled} />
    </BlockDrag>
  )
}
