import { PrimaryType } from '../../../../types'
import { Expressions } from '../../enum'
import { Expr } from '../expr'
import { NullLiteralExpr } from '../valores/null-literal'

export class AssignExpr extends Expr {
  name = Expressions.Assign

  identifier = ''
  expression: Expr = new NullLiteralExpr()
  type = PrimaryType.null

  edit(identifier: string, expression: Expr) {
    this.identifier = identifier
    this.expression = expression
    this.type = expression.type
  }
  copy(): AssignExpr {
    const expr = new AssignExpr()
    expr.identifier = this.identifier
    expr.expression = this.expression.copy()
    expr.type = this.type
    return expr
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  migrateFrom(_source: Expr) {
    this.identifier = ''
    this.expression = new NullLiteralExpr()
  }
}
