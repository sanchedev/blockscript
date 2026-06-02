import { useTransformContext } from 'react-zoom-pan-pinch'
import { useExprDrag } from '../stores/expr-drags'
import { ExprComp } from './blocks/expressions/expr'
import { BlockStmtComp } from './blocks/statements/block'
import { useStmtDrag } from '../stores/stmt-drags'
import { useDrag } from '../stores/drag-store'
import { Expr } from '../lib/blocks/expressions'
import { Stmt } from '../lib/blocks/statements'
import { StmtComp } from './blocks/statements/stmt'
import { useRootStmt } from '../stores/root-stmt'

export function Board() {
  const stmt = useRootStmt((state) => state.stmt)
  const expressions = useExprDrag((state) => state.positions)
  const statements = useStmtDrag((state) => state.positions)
  const addExpr = useExprDrag((state) => state.add)
  const addStmt = useStmtDrag((state) => state.add)
  const moveExpr = useExprDrag((state) => state.move)
  const moveStmt = useStmtDrag((state) => state.move)
  const findExpr = useExprDrag((state) => state.find)
  const findStmt = useStmtDrag((state) => state.find)
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
    if (obj instanceof Expr || obj instanceof Stmt) {
      const tools = {
        add(x: number, y: number) {
          if (obj instanceof Expr) addExpr(obj, x, y)
          else addStmt(obj, x, y)
        },
        find() {
          if (obj instanceof Expr) return findExpr(obj.id)
          else return findStmt(obj.id)
        },
        move(x: number, y: number) {
          if (obj instanceof Expr) moveExpr(obj.id, x, y)
          else moveStmt(obj.id, x, y)
        },
      }

      const { positionX, positionY, scale } = state
      const { x, y } = {
        x: -(ev.clientX - data.pickPosition.x + 0),
        y: -(ev.clientY - data.pickPosition.y - 64),
      }

      const newX = (positionX + x) / scale
      const newY = (positionY + y) / scale

      if (tools.find() == null) {
        tools.add(newX, newY)
        data.unlock?.()
      } else {
        tools.move(newX, newY)
      }
    }
  }

  return (
    <main
      id='board'
      className='relative px-[50vw] py-[50vh] min-w-[400vw] min-h-[400vh] w-5000 h-5000'
      onDragOver={handleDragOver}
      onDrop={handleDrop}>
      {statements.map(({ stmt, x, y }) => {
        const px = -x
        const py = -y
        return (
          <StmtComp key={stmt.id} stmt={stmt} position={{ x: px, y: py }} />
        )
      })}
      {expressions.map(({ expr, x, y }) => {
        const px = -x
        const py = -y
        return (
          <ExprComp key={expr.id} expr={expr} position={{ x: px, y: py }} />
        )
      })}
      <BlockStmtComp stmt={stmt} main fit />
    </main>
  )
}
