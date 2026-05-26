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
import { ExprCtx } from '../../../contexts/expression'

export function ExprComp(props: ExprCompProps) {
  return (
    <ExprCtx
      value={{
        expr: props.expr,
        parent: props.parent,
        edit: props.edit,
      }}>
      {props.expr instanceof StringLiteralExpr && (
        <StringLiteralExprComp
          {...(props as ExprCompProps<StringLiteralExpr>)}
        />
      )}
      {props.expr instanceof NullLiteralExpr && (
        <NullLiteralExprComp {...(props as ExprCompProps<NullLiteralExpr>)} />
      )}
      {props.expr instanceof NumberLiteralExpr && (
        <NumberLiteralExprComp
          {...(props as ExprCompProps<NumberLiteralExpr>)}
        />
      )}
      {props.expr instanceof BooleanLiteralExpr && (
        <BooleanLiteralExprComp
          {...(props as ExprCompProps<BooleanLiteralExpr>)}
        />
      )}
      {props.expr instanceof BinaryExpr && (
        <BinaryExprComp {...(props as ExprCompProps<BinaryExpr>)} />
      )}
      {props.expr instanceof BinaryCompExpr && (
        <BinaryCompExprComp {...(props as ExprCompProps<BinaryCompExpr>)} />
      )}
      {props.expr instanceof VariableExpr && (
        <VariableExprComp {...(props as ExprCompProps<VariableExpr>)} />
      )}
      {props.expr instanceof AssignExpr && (
        <AssignExprComp {...(props as ExprCompProps<AssignExpr>)} />
      )}
      {props.expr instanceof AssignOpExpr && (
        <AssignOpExprComp {...(props as ExprCompProps<AssignOpExpr>)} />
      )}
      {props.expr instanceof IncrementExpr && (
        <IncrementExprComp {...(props as ExprCompProps<IncrementExpr>)} />
      )}
      {props.expr instanceof ReadExpr && (
        <ReadExprComp {...(props as ExprCompProps<ReadExpr>)} />
      )}
      {props.expr instanceof ConcatExpr && (
        <ConcatExprComp {...(props as ExprCompProps<ConcatExpr>)} />
      )}
      {props.expr instanceof ToStringExpr && (
        <ToStringExprComp {...(props as ExprCompProps<ToStringExpr>)} />
      )}
      {props.expr instanceof ToNumberExpr && (
        <ToNumberExprComp {...(props as ExprCompProps<ToNumberExpr>)} />
      )}
      {props.expr instanceof ToBooleanExpr && (
        <ToBooleanExprComp {...(props as ExprCompProps<ToBooleanExpr>)} />
      )}
      {props.expr instanceof LogicalExpr && (
        <LogicalExprComp {...(props as ExprCompProps<LogicalExpr>)} />
      )}
    </ExprCtx>
  )
}
