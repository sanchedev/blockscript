import { Expressions } from '../../enum'
import { Expr } from '../expr'
import { BinaryCompExpr } from '../operaciones/binary-comp'
import { BinaryExpr } from '../operaciones/binary'
import { StringLiteralExpr } from '../valores/string-literal'
import { PrimaryType } from '../../../../types'

export class ConcatExpr extends Expr {
  name = Expressions.Concat

  left: Expr = new StringLiteralExpr()
  right: Expr = new StringLiteralExpr()

  type = PrimaryType.string

  edit(left: Expr, right: Expr) {
    this.left = left
    this.right = right
  }

  copy(): ConcatExpr {
    const expr = new ConcatExpr()
    expr.left = this.left.copy()
    expr.right = this.right.copy()
    return expr
  }

  migrateFrom(source: Expr) {
    if (source instanceof StringLiteralExpr) {
      this.left = source.copy()
    } else if (source instanceof ConcatExpr) {
      this.left = source.left.copy()
      this.right = source.right.copy()
    } else if (source instanceof BinaryExpr || source instanceof BinaryCompExpr) {
      this.left = source.left.copy()
      this.right = source.right.copy()
    } else {
      this.left = new StringLiteralExpr()
    }
  }
}
