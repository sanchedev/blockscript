import type { StmtId } from '../../../lib/ui/stmts'
import clsx from 'clsx'
import { StmtRenderer } from '../ui/stmt-renderer'
import { BlockDrag, type BlockDragElement } from '../ui/block-drag'
import { useBlockDragStore } from '../../../stores/block-drag-store'
import { useTreeStore } from '../../../stores/tree-store'
import { IconTrash } from '@tabler/icons-react'

interface StmtCompProps extends BlockDragElement {
  id: StmtId
  disabled: boolean
  onUnlock?: () => void
  position?: {
    x: number
    y: number
  }
}

export function StmtComp({
  id,
  disabled,
  onUnlock,
  position,
  className,
  ...rest
}: StmtCompProps) {
  const { remove: removePosition } = useBlockDragStore()

  const handleRemove = () => {
    if (!onUnlock) removePosition(id)
    else onUnlock()
    useTreeStore.getState().removeStmt(id)
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
      className={clsx(position && 'absolute', className)}
      style={
        position
          ? {
              top: position.y,
              left: position.x,
            }
          : undefined
      }
      {...rest}>
      <StmtRenderer id={id} disabled={disabled} />
    </BlockDrag>
  )
}
