import { Expressions } from '../../enum'
import { Expr } from '../expr'
import { ReadExpr } from '../valores/read'
import { StringLiteralExpr } from '../valores/string-literal'
import { PrimaryType } from '../../../../types'

export class ToStringExpr extends Expr {
  name = Expressions.ToString

  expression: Expr = new StringLiteralExpr()

  type = PrimaryType.string

  edit(expression: Expr) {
    this.expression = expression
  }

  copy(): ToStringExpr {
    const expr = new ToStringExpr()
    expr.expression = this.expression.copy()
    return expr
  }

  migrateFrom(source: Expr) {
    if (source instanceof StringLiteralExpr) {
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
