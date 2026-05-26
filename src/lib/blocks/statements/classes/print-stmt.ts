import type { Expr } from '../../expressions'
import { NullLiteralExpr } from '../../expressions/classes'
import { Stmt } from '../classes/stmt'
import { Statements } from '../enum'
import { ExprStmt } from './expr-stmt'

export class PrintStmt extends Stmt {
  name = Statements.Print

  expression: Expr = new NullLiteralExpr()

  edit(expression: Expr) {
    this.expression = expression
  }
  copy(): PrintStmt {
    const stmt = new PrintStmt(this.id)
    stmt.expression = this.expression.copy()
    return stmt
  }
  migrateFrom(source: Stmt) {
    if (source instanceof ExprStmt) {
      this.expression = source.expression.copy()
    } else {
      this.expression = new NullLiteralExpr()
    }
  }
}
