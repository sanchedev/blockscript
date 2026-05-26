import { Expressions } from '../../enum'
import { Expr } from '../expr'
import { NumberLiteralExpr } from '../valores/number-literal'
import { BinaryExpr } from '../operaciones/binary'
import { PrimaryType } from '../../../../types'

export enum BinaryCompOp {
  Gt = '>',
  Lt = '<',
  Gte = '>=',
  Lte = '<=',
  Eq = '==',
  Neq = '!=',
}

export class BinaryCompExpr extends Expr {
  name = Expressions.BinaryComp

  left: Expr = new NumberLiteralExpr()
  operator: BinaryCompOp = BinaryCompOp.Gt
  right: Expr = new NumberLiteralExpr()

  type = PrimaryType.boolean

  edit(left: Expr, operator: BinaryCompOp, right: Expr) {
    this.left = left
    this.operator = operator
    this.right = right
  }
  copy(): BinaryCompExpr {
    const expr = new BinaryCompExpr()
    expr.left = this.left.copy()
    expr.operator = this.operator
    expr.right = this.right.copy()
    return expr
  }
  migrateFrom(source: Expr) {
    if (source instanceof NumberLiteralExpr) {
      this.left = source.copy()
    } else if (source instanceof BinaryCompExpr) {
      this.left = source.left.copy()
      this.operator = source.operator
      this.right = source.right.copy()
    } else if (source instanceof BinaryExpr) {
      this.left = source.left.copy()
      this.right = source.right.copy()
    }
  }
}
