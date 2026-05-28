import { Expressions } from '../../enum'
import { Expr } from '../expr'
import { NumberLiteralExpr } from '../valores/number-literal'
import { BinaryCompExpr } from '../operaciones/binary-comp'
import { PrimaryType } from '../../../../types'

export enum BinaryOp {
  Add = '+',
  Sub = '-',
  Mul = '*',
  Div = '/',
  Mod = '%',
}

export class BinaryExpr extends Expr {
  name = Expressions.Binary

  left: Expr = new NumberLiteralExpr()
  operator: BinaryOp = BinaryOp.Add
  right: Expr = new NumberLiteralExpr()

  type = PrimaryType.number

  edit(left: Expr, operator: BinaryOp, right: Expr) {
    this.left = left
    this.operator = operator
    this.right = right
  }
  copy(): BinaryExpr {
    const expr = new BinaryExpr()
    expr.left = this.left.copy()
    expr.operator = this.operator
    expr.right = this.right.copy()
    return expr
  }
  migrateFrom(source: Expr) {
    if (source instanceof NumberLiteralExpr) {
      this.left = source.copy()
    } else if (source instanceof BinaryExpr) {
      this.left = source.left.copy()
      this.operator = source.operator
      this.right = source.right.copy()
    } else if (source instanceof BinaryCompExpr) {
      this.left = source.left.copy()
      this.right = source.right.copy()
    }
  }
}
