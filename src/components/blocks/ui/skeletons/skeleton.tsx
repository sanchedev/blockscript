import type { ExprId } from '../../../../lib/ui/exprs'
import type { StmtId } from '../../../../lib/ui/stmts'
import type { DragBlockId } from '../../../../stores/block-drag-store'
import { ExprComp } from '../../expressions/expr'
import { StmtComp } from '../../statements/stmt'
import type { BlockDragElement } from '../block-drag'

interface SkeletonProps extends BlockDragElement {
  id: DragBlockId
  position?: { x: number; y: number }
}

export function Skeleton({ id, position, ...rest }: SkeletonProps) {
  if (id.startsWith('expr='))
    return <ExprComp id={id as ExprId} position={position} disabled {...rest} />
  return <StmtComp id={id as StmtId} position={position} disabled {...rest} />
}
