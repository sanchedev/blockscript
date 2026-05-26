import type { Expr } from '../../expressions'
import { NullLiteralExpr } from '../../expressions/classes'
import { Stmt } from '../classes/stmt'
import { Statements } from '../enum'

export class ExprStmt extends Stmt {
  name = Statements.Expr

  expression: Expr = new NullLiteralExpr()

  edit(expression: Expr) {
    this.expression = expression
  }
  copy(): ExprStmt {
    const expr = new ExprStmt(this.id)
    expr.expression = this.expression.copy()
    return expr
  }
  migrateFrom() {
    this.expression = new NullLiteralExpr()
  }
}
