import { useTransformContext } from 'react-zoom-pan-pinch'
import { ExprComp } from './blocks/expressions/expr'
import { BlockStmtComp } from './blocks/statements/block'
import { useDrag } from '../stores/drag-store'
import { Expr } from '../lib/blocks/expressions'
import { StmtComp } from './blocks/statements/stmt'
import { useRootStmt } from '../stores/root-stmt'
import { useBlockDrag } from '../hooks/block-drag'

export function Board() {
  const stmt = useRootStmt((state) => state.stmt)
  const { positions, add, move, find } = useBlockDrag()
  const data = useDrag((state) => state.data)
  const endDrag = useDrag((state) => state.endDrag)
  const { state } = useTransformContext()

  const handleDragOver = (ev: React.DragEvent) => {
    ev.preventDefault()
    ev.stopPropagation()
  }
  const handleDrop = (ev: React.DragEvent) => {
    ev.preventDefault()
    ev.stopPropagation()
    endDrag()

    if (data == null) return
    const obj = data.obj

    const { positionX, positionY, scale } = state
    const { x, y } = {
      x: -(ev.clientX - data.pickPosition.x + 0),
      y: -(ev.clientY - data.pickPosition.y - 64),
    }

    const newX = (positionX + x) / scale
    const newY = (positionY + y) / scale

    if (find(obj.id) == null) {
      add(obj, newX, newY)
      data.unlock()
    } else {
      move(obj.id, newX, newY)
    }
  }

  return (
    <main
      id='board'
      className='relative px-[50vw] py-[50vh] min-w-[400vw] min-h-[400vh] w-5000 h-5000'
      onDragOver={handleDragOver}
      onDrop={handleDrop}>
      {positions.map(({ block, x, y }) =>
        block instanceof Expr ? (
          <ExprComp key={block.id} expr={block} position={{ x: -x, y: -y }} />
        ) : (
          <StmtComp key={block.id} stmt={block} position={{ x: -x, y: -y }} />
        ),
      )}
      <BlockStmtComp stmt={stmt} main fit />
    </main>
  )
}
