import type { Expr } from '../../expressions'
import { NumberLiteralExpr } from '../../expressions/classes'
import { Stmt } from '../classes/stmt'
import { Statements } from '../enum'
import { ExprStmt } from './expr-stmt'

export class WaitStmt extends Stmt {
  name = Statements.Wait

  duration: Expr = new NumberLiteralExpr()

  edit(duration: Expr) {
    this.duration = duration
  }
  copy(): WaitStmt {
    const stmt = new WaitStmt(this.id)
    stmt.duration = this.duration.copy()
    return stmt
  }
  migrateFrom(source: Stmt) {
    if (source instanceof ExprStmt) {
      this.duration = source.expression.copy()
    } else {
      this.duration = new NumberLiteralExpr()
    }
  }
}
