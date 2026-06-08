import { useTransformContext } from 'react-zoom-pan-pinch'
import { ExprComp } from './blocks/expressions/expr'
import { BlockStmtComp } from './blocks/statements/block'
import { Expr } from '../lib/blocks/expressions'
import { StmtComp } from './blocks/statements/stmt'
import { useRootStmt } from '../stores/root-stmt'
import { useBlockDrag, useBlockDragPositions } from '../hooks/block-drag'
import { useCurrentDrag, useDrag } from '../hooks/drag'
import { DragSkeleton } from './blocks/ui/skeletons/drag-skeleton'
import { RenderTreeCtx } from '../contexts/render-tree'

export function Board() {
  const stmt = useRootStmt((state) => state.stmt)
  const reload = useRootStmt((state) => state.reload)
  const { add, move, find } = useBlockDrag()
  const data = useCurrentDrag()
  const { end } = useDrag()
  const { state } = useTransformContext()

  const handleDragOver = (ev: React.DragEvent) => {
    ev.preventDefault()
    ev.stopPropagation()
  }
  const handleDrop = (ev: React.DragEvent) => {
    ev.preventDefault()
    ev.stopPropagation()
    end()

    if (data == null) return
    const obj = data.obj

    const { positionX, positionY, scale } = state

    const x = (positionX - ev.clientX + data.pickPosition.x + 0) / scale
    const y = (positionY - ev.clientY + data.pickPosition.y + 64) / scale

    if (find(obj.id) == null) {
      data.unlock()
      add(obj, x, y)
    } else {
      move(obj.id, x, y)
    }
  }

  return (
    <main
      id='board'
      className='relative px-480 py-480 w-5000 h-5000'
      onDragOver={handleDragOver}
      onDrop={handleDrop}>
      <DragSkeleton />
      <BlockDrags />
      <RenderTreeCtx value={() => reload()}>
        <BlockStmtComp stmt={stmt} main fit disabled={false} />
      </RenderTreeCtx>
    </main>
  )
}

function BlockDrags() {
  const positions = useBlockDragPositions()
  const { replace } = useBlockDrag()

  return positions.map(({ block, x, y }) => (
    <RenderTreeCtx key={block.id} value={() => replace(block.copy())}>
      {block instanceof Expr ? (
        <ExprComp expr={block} position={{ x: -x, y: -y }} disabled={false} />
      ) : (
        <StmtComp stmt={block} position={{ x: -x, y: -y }} disabled={false} />
      )}
    </RenderTreeCtx>
  ))
}
