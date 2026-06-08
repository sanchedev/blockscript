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
import { use } from 'react'
import { ExprCtx } from '../../../contexts/expr'
import { ExprContainerCtx } from '../../../contexts/expr-container'
import { BlockDrag } from '../ui/block-drag'

export function ExprComp({
  expr,
  disabled,
  position,
  className,
  ...rest
}: ExprCompProps & {
  position?: { x: number; y: number }
} & React.HTMLAttributes<HTMLDivElement>) {
  const { container } = use(ExprContainerCtx) ?? {}

  return (
    <ExprCtx
      value={{
        parent: container?.parent,
      }}>
      <BlockDrag
        obj={expr}
        disabled={disabled}
        onRemove={() => container != null && (container.set(null) ?? true)}
        className={clsx(position && 'absolute', className)}
        style={{
          top: position?.y,
          left: position?.x,
        }}
        {...rest}>
        {expr instanceof StringLiteralExpr && (
          <StringLiteralExprComp expr={expr} disabled={disabled} />
        )}
        {expr instanceof NullLiteralExpr && (
          <NullLiteralExprComp expr={expr} disabled={disabled} />
        )}
        {expr instanceof NumberLiteralExpr && (
          <NumberLiteralExprComp expr={expr} disabled={disabled} />
        )}
        {expr instanceof BooleanLiteralExpr && (
          <BooleanLiteralExprComp expr={expr} disabled={disabled} />
        )}
        {expr instanceof BinaryExpr && (
          <BinaryExprComp expr={expr} disabled={disabled} />
        )}
        {expr instanceof BinaryCompExpr && (
          <BinaryCompExprComp expr={expr} disabled={disabled} />
        )}
        {expr instanceof VariableExpr && (
          <VariableExprComp expr={expr} disabled={disabled} />
        )}
        {expr instanceof AssignExpr && (
          <AssignExprComp expr={expr} disabled={disabled} />
        )}
        {expr instanceof AssignOpExpr && (
          <AssignOpExprComp expr={expr} disabled={disabled} />
        )}
        {expr instanceof IncrementExpr && (
          <IncrementExprComp expr={expr} disabled={disabled} />
        )}
        {expr instanceof ReadExpr && (
          <ReadExprComp expr={expr} disabled={disabled} />
        )}
        {expr instanceof ConcatExpr && (
          <ConcatExprComp expr={expr} disabled={disabled} />
        )}
        {expr instanceof ToStringExpr && (
          <ToStringExprComp expr={expr} disabled={disabled} />
        )}
        {expr instanceof ToNumberExpr && (
          <ToNumberExprComp expr={expr} disabled={disabled} />
        )}
        {expr instanceof ToBooleanExpr && (
          <ToBooleanExprComp expr={expr} disabled={disabled} />
        )}
        {expr instanceof LogicalExpr && (
          <LogicalExprComp expr={expr} disabled={disabled} />
        )}
      </BlockDrag>
    </ExprCtx>
  )
}
