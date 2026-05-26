import { Expressions } from '../../enum'
import { BooleanLiteralExpr } from '../valores/boolean-literal'
import { StringLiteralExpr } from '../valores/string-literal'
import { Expr } from '../expr'
import { BinaryExpr } from '../operaciones/binary'
import { BinaryCompExpr } from '../operaciones/binary-comp'
import { PrimaryType } from '../../../../types'

export class NumberLiteralExpr extends Expr {
  name = Expressions.NumberLiteral

  literal = 0

  type = PrimaryType.number

  edit(literal: number) {
    this.literal = literal
  }
  copy(): NumberLiteralExpr {
    const expr = new NumberLiteralExpr()
    expr.literal = this.literal
    return expr
  }
  migrateFrom(source: Expr) {
    if (source instanceof StringLiteralExpr) {
      const num = Number(source.literal)
      this.literal = isNaN(num) ? 0 : num
    } else if (source instanceof BooleanLiteralExpr) {
      this.literal = source.literal ? 1 : 0
    } else if (source instanceof NumberLiteralExpr) {
      this.literal = source.literal
    } else if (source instanceof BinaryExpr) {
      this.migrateFrom(source.left)
    } else if (source instanceof BinaryCompExpr) {
      this.migrateFrom(source.left)
    } else {
      this.literal = 0
    }
  }
}
