import { Expressions } from '../../enum'
import { Expr } from '../expr'
import { NumberLiteralExpr } from '../valores/number-literal'
import { ReadExpr } from '../valores/read'
import { ToStringExpr } from '../conversion/to-string'
import { StringLiteralExpr } from '../valores/string-literal'
import { PrimaryType } from '../../../../types'

export class ToNumberExpr extends Expr {
  name = Expressions.ToNumber

  expression: Expr = new StringLiteralExpr()

  type = PrimaryType.number

  edit(expression: Expr) {
    this.expression = expression
  }

  copy(): ToNumberExpr {
    const expr = new ToNumberExpr()
    expr.expression = this.expression.copy()
    return expr
  }

  migrateFrom(source: Expr) {
    if (source instanceof StringLiteralExpr) {
      this.expression = source.copy()
    } else if (source instanceof NumberLiteralExpr) {
      this.expression = source.copy()
    } else if (source instanceof ToStringExpr) {
      this.expression = source.expression.copy()
    } else if (source instanceof ReadExpr) {
      this.expression = source.prompt.copy()
    } else {
      this.expression = new StringLiteralExpr()
    }
  }
}
