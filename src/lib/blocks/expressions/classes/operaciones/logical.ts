import { Expressions } from '../../enum'
import { Expr } from '../expr'
import { BooleanLiteralExpr } from '../valores/boolean-literal'
import { BinaryCompExpr } from '../operaciones/binary-comp'
import { ToBooleanExpr } from '../conversion/to-boolean'
import { PrimaryType } from '../../../../types'

export enum LogicalOp {
  And = 'Y',
  Or = 'O',
}

export class LogicalExpr extends Expr {
  name = Expressions.Logical

  left: Expr = new BooleanLiteralExpr()
  operator: LogicalOp = LogicalOp.And
  right: Expr = new BooleanLiteralExpr()

  type = PrimaryType.boolean

  edit(left: Expr, operator: LogicalOp, right: Expr) {
    this.left = left
    this.operator = operator
    this.right = right
  }

  copy(): LogicalExpr {
    const expr = new LogicalExpr()
    expr.left = this.left.copy()
    expr.operator = this.operator
    expr.right = this.right.copy()
    return expr
  }

  migrateFrom(source: Expr) {
    if (source instanceof BooleanLiteralExpr) {
      this.left = source.copy()
    } else if (source instanceof BinaryCompExpr) {
      this.left = source.left.copy()
      this.right = source.right.copy()
    } else if (source instanceof LogicalExpr) {
      this.left = source.left.copy()
      this.operator = source.operator
      this.right = source.right.copy()
    } else if (source instanceof ToBooleanExpr) {
      this.left = source.expression.copy()
    } else {
      this.left = new BooleanLiteralExpr()
      this.right = new BooleanLiteralExpr()
    }
  }
}
