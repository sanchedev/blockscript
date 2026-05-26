import { AssignExpr, AssignOpExpr, BinaryCompExpr, BinaryExpr, BooleanLiteralExpr, IncrementExpr, NullLiteralExpr, NumberLiteralExpr, StringLiteralExpr, VariableExpr, ReadExpr, ConcatExpr, ToStringExpr, ToNumberExpr, ToBooleanExpr, LogicalExpr } from '../classes'
import { Expressions } from '../enum'

export const expressionsClasses = {
  [Expressions.StringLiteral]: StringLiteralExpr,
  [Expressions.NullLiteral]: NullLiteralExpr,
  [Expressions.NumberLiteral]: NumberLiteralExpr,
  [Expressions.BooleanLiteral]: BooleanLiteralExpr,
  [Expressions.Binary]: BinaryExpr,
  [Expressions.BinaryComp]: BinaryCompExpr,
  [Expressions.Variable]: VariableExpr,
  [Expressions.Assign]: AssignExpr,
  [Expressions.Read]: ReadExpr,
  [Expressions.Concat]: ConcatExpr,
  [Expressions.ToString]: ToStringExpr,
  [Expressions.ToNumber]: ToNumberExpr,
  [Expressions.ToBoolean]: ToBooleanExpr,
  [Expressions.Logical]: LogicalExpr,
  [Expressions.AssignOp]: AssignOpExpr,
  [Expressions.Increment]: IncrementExpr,
}
