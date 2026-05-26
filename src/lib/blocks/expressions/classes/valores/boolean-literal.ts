import { Expressions } from '../../enum'
import { NumberLiteralExpr } from '../valores/number-literal'
import { StringLiteralExpr } from '../valores/string-literal'
import { Expr } from '../expr'
import { PrimaryType } from '../../../../types'

export class BooleanLiteralExpr extends Expr {
  name = Expressions.BooleanLiteral

  literal = false

  type = PrimaryType.boolean

  edit(literal: boolean) {
    this.literal = literal
  }
  copy(): BooleanLiteralExpr {
    const expr = new BooleanLiteralExpr()
    expr.literal = this.literal
    return expr
  }
  migrateFrom(source: Expr) {
    if (source instanceof StringLiteralExpr) {
      this.literal = source.literal === 'true'
    } else if (source instanceof NumberLiteralExpr) {
      this.literal = source.literal !== 0
    } else if (source instanceof BooleanLiteralExpr) {
      this.literal = source.literal
    } else {
      this.literal = false
    }
  }
}
