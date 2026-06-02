import {
  AssignExpr,
  AssignOpExpr,
  BinaryCompExpr,
  BinaryExpr,
  BooleanLiteralExpr,
  ConcatExpr,
  IncrementExpr,
  LogicalExpr,
  NullLiteralExpr,
  NumberLiteralExpr,
  StringLiteralExpr,
  ToBooleanExpr,
  ToNumberExpr,
  ToStringExpr,
  VariableExpr,
  ReadExpr,
} from '../../../lib/blocks/expressions'
import { AssignExprComp } from './variables/assign'
import { AssignOpExprComp } from './variables/assign-op'
import { BinaryCompExprComp } from './operaciones/binary-comp'
import { BinaryExprComp } from './operaciones/binary'
import { BooleanLiteralExprComp } from './valores/boolean-literal'
import { ConcatExprComp } from './conversion/concat'
import { IncrementExprComp } from './variables/increment'
import { LogicalExprComp } from './operaciones/logical'
import { NullLiteralExprComp } from './valores/null-literal'
import { NumberLiteralExprComp } from './valores/number-literal'
import { StringLiteralExprComp } from './valores/string-literal'
import { ToBooleanExprComp } from './conversion/to-boolean'
import { ToNumberExprComp } from './conversion/to-number'
import { ToStringExprComp } from './conversion/to-string'
import { VariableExprComp } from './variables/variable'
import { ReadExprComp } from './valores/read'
import type { ExprCompProps } from './types'
import clsx from 'clsx'
import { useDrag } from '../../../stores/drag-store'
import { use, useState } from 'react'
import { ExprCtx } from '../../../contexts/expr'
import { ExprContainerCtx } from '../../../contexts/expr-container'
import { useExprDrag } from '../../../stores/expr-drags'
import { ExprSkeleton } from '../ui/skeletons/expr-skeleton'
import { useTransformContext } from 'react-zoom-pan-pinch'

export function ExprComp(
  props: ExprCompProps & { position?: { x: number; y: number } },
) {
  const { container, triggerUpdate } = use(ExprContainerCtx) ?? {}

  const [expr, setExpr] = useState(props.expr)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const startDrag = useDrag((state) => state.startDrag)
  const data = useDrag((state) => state.data)
  const endDrag = useDrag((state) => state.endDrag)
  const removeDrag = useExprDrag((state) => state.remove)

  const { state } = useTransformContext()

  const id = `expr=${expr.id}`
  const handleDragStart = (ev: React.DragEvent) => {
    ev.stopPropagation()
    ev.dataTransfer.setData('text/plain', id)
    ev.dataTransfer.setDragImage(new Image(), 0, 0)
    const { left, top } = ev.currentTarget.getBoundingClientRect()
    startDrag({
      obj: expr,
      pickPosition: { x: ev.clientX - left, y: ev.clientY - top },
      unlock: () => {
        if (container) container?.set(null)
        else removeDrag(expr.id)
        triggerUpdate?.()
      },
    })
    calcPosSkeleton(ev.clientX, ev.clientY)
    ev.dataTransfer.dropEffect = 'move'
  }
  const handleDrag = (ev: React.DragEvent) => {
    ev.stopPropagation()
    calcPosSkeleton(ev.clientX, ev.clientY)
  }
  const handleDragEnd = (ev: React.DragEvent) => {
    ev.stopPropagation()
    endDrag()
  }

  const calcPosSkeleton = (clientX: number, clientY: number) => {
    const { positionX, positionY, scale } = state
    const { x, y } = {
      x: -(clientX + 0),
      y: -(clientY - 64),
    }

    const newX = -(positionX + x) / scale
    const newY = -(positionY + y) / scale

    setPos({ x: newX, y: newY })
  }

  return (
    <ExprCtx
      value={{
        parent: container?.parent,
        triggerUpdate: () => {
          const newExpr = expr.copy()
          container?.set(newExpr)
          setExpr(newExpr)
          triggerUpdate?.()
        },
      }}>
      <div
        id={id}
        draggable
        className={clsx('locked', props.position && 'absolute')}
        style={{ top: props.position?.y, left: props.position?.x }}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}>
        {data?.obj.id === expr.id && (
          <div
            className='absolute top-0 left-0 z-50 pointer-events-none'
            style={{
              top: pos.y - (props.position?.y ?? 0),
              left: pos.x - (props.position?.x ?? 0),
              transformOrigin: '0 0',
            }}>
            <ExprSkeleton expr={expr} />
          </div>
        )}
        <div
          className={clsx(
            'transition-transform duration-300',
            data?.obj.id === expr.id && 'opacity-25 scale-0',
          )}>
          {expr instanceof StringLiteralExpr && (
            <StringLiteralExprComp expr={expr as StringLiteralExpr} />
          )}
          {expr instanceof NullLiteralExpr && (
            <NullLiteralExprComp expr={expr as NullLiteralExpr} />
          )}
          {expr instanceof NumberLiteralExpr && (
            <NumberLiteralExprComp expr={expr as NumberLiteralExpr} />
          )}
          {expr instanceof BooleanLiteralExpr && (
            <BooleanLiteralExprComp expr={expr as BooleanLiteralExpr} />
          )}
          {expr instanceof BinaryExpr && (
            <BinaryExprComp expr={expr as BinaryExpr} />
          )}
          {expr instanceof BinaryCompExpr && (
            <BinaryCompExprComp expr={expr as BinaryCompExpr} />
          )}
          {expr instanceof VariableExpr && (
            <VariableExprComp expr={expr as VariableExpr} />
          )}
          {expr instanceof AssignExpr && (
            <AssignExprComp expr={expr as AssignExpr} />
          )}
          {expr instanceof AssignOpExpr && (
            <AssignOpExprComp expr={expr as AssignOpExpr} />
          )}
          {expr instanceof IncrementExpr && (
            <IncrementExprComp expr={expr as IncrementExpr} />
          )}
          {expr instanceof ReadExpr && <ReadExprComp expr={expr as ReadExpr} />}
          {expr instanceof ConcatExpr && (
            <ConcatExprComp expr={expr as ConcatExpr} />
          )}
          {expr instanceof ToStringExpr && (
            <ToStringExprComp expr={expr as ToStringExpr} />
          )}
          {expr instanceof ToNumberExpr && (
            <ToNumberExprComp expr={expr as ToNumberExpr} />
          )}
          {expr instanceof ToBooleanExpr && (
            <ToBooleanExprComp expr={expr as ToBooleanExpr} />
          )}
          {expr instanceof LogicalExpr && (
            <LogicalExprComp expr={expr as LogicalExpr} />
          )}
        </div>
      </div>
    </ExprCtx>
  )
}
