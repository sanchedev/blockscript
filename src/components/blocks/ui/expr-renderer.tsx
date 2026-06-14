import type { ExprId } from '../../../lib/ui/exprs'
import { useTreeStore } from '../../../stores/tree-store'
import { Expressions } from '../../../lib/blocks/expressions/enum'
import { NumberLiteralExprComp } from '../expressions/valores/number-literal'
import { StringLiteralExprComp } from '../expressions/valores/string-literal'
import { BooleanLiteralExprComp } from '../expressions/valores/boolean-literal'
import { NullLiteralExprComp } from '../expressions/valores/null-literal'
import { BinaryExprComp } from '../expressions/operaciones/binary'
import { BinaryCompExprComp } from '../expressions/operaciones/binary-comp'
import { LogicalExprComp } from '../expressions/operaciones/logical'
import { VariableExprComp } from '../expressions/variables/variable'
import { AssignExprComp } from '../expressions/variables/assign'
import { AssignOpExprComp } from '../expressions/variables/assign-op'
import { IncrementExprComp } from '../expressions/variables/increment'
import { ReadExprComp } from '../expressions/valores/read'
import { ConcatExprComp } from '../expressions/conversion/concat'
import { ToStringExprComp } from '../expressions/conversion/to-string'
import { ToNumberExprComp } from '../expressions/conversion/to-number'
import { ToBooleanExprComp } from '../expressions/conversion/to-boolean'

export function ExprRenderer({
  id,
  disabled,
}: {
  id: ExprId
  disabled: boolean
}) {
  const opt = useTreeStore((s) => s.exprs[id])
  if (opt == null) return null

  switch (opt.name) {
    case Expressions.NumberLiteral:
      return <NumberLiteralExprComp id={id} disabled={disabled} />
    case Expressions.StringLiteral:
      return <StringLiteralExprComp id={id} disabled={disabled} />
    case Expressions.BooleanLiteral:
      return <BooleanLiteralExprComp id={id} disabled={disabled} />
    case Expressions.NullLiteral:
      return <NullLiteralExprComp id={id} disabled={disabled} />
    case Expressions.Binary:
      return <BinaryExprComp id={id} disabled={disabled} />
    case Expressions.BinaryComp:
      return <BinaryCompExprComp id={id} disabled={disabled} />
    case Expressions.Logical:
      return <LogicalExprComp id={id} disabled={disabled} />
    case Expressions.Variable:
      return <VariableExprComp id={id} disabled={disabled} />
    case Expressions.Assign:
      return <AssignExprComp id={id} disabled={disabled} />
    case Expressions.AssignOp:
      return <AssignOpExprComp id={id} disabled={disabled} />
    case Expressions.Increment:
      return <IncrementExprComp id={id} disabled={disabled} />
    case Expressions.Read:
      return <ReadExprComp id={id} disabled={disabled} />
    case Expressions.Concat:
      return <ConcatExprComp id={id} disabled={disabled} />
    case Expressions.ToString:
      return <ToStringExprComp id={id} disabled={disabled} />
    case Expressions.ToNumber:
      return <ToNumberExprComp id={id} disabled={disabled} />
    case Expressions.ToBoolean:
      return <ToBooleanExprComp id={id} disabled={disabled} />
    default:
      return null
  }
}
