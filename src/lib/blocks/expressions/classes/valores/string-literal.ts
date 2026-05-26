import { Expressions } from '../../enum'
import { BooleanLiteralExpr } from '../valores/boolean-literal'
import { NumberLiteralExpr } from '../valores/number-literal'
import { Expr } from '../expr'
import { PrimaryType } from '../../../../types'

export class StringLiteralExpr extends Expr {
  name = Expressions.StringLiteral

  literal = ''

  type = PrimaryType.string

  edit(literal: string) {
    this.literal = literal
  }
  copy(): StringLiteralExpr {
    const expr = new StringLiteralExpr()
    expr.literal = this.literal
    return expr
  }
  migrateFrom(source: Expr) {
    if (source instanceof NumberLiteralExpr) {
      this.literal = String(source.literal)
    } else if (source instanceof BooleanLiteralExpr) {
      this.literal = source.literal ? 'true' : 'false'
    } else if (source instanceof StringLiteralExpr) {
      this.literal = source.literal
    } else {
      this.literal = ''
    }
  }
}
