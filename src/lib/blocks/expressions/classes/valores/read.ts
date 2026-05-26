import { Expressions } from '../../enum'
import { Expr } from '../expr'
import { StringLiteralExpr } from '../valores/string-literal'
import type { Expr as ExprType } from '../expr'
import { PrimaryType } from '../../../../types'

export class ReadExpr extends Expr {
  name = Expressions.Read

  prompt: ExprType = new StringLiteralExpr()

  type = PrimaryType.string

  edit(prompt: ExprType) {
    this.prompt = prompt
  }

  copy(): ReadExpr {
    const expr = new ReadExpr()
    expr.prompt = this.prompt.copy()
    return expr
  }

  migrateFrom(source: Expr) {
    if (source instanceof StringLiteralExpr) {
      this.prompt = source.copy()
    } else {
      this.prompt = new StringLiteralExpr()
    }
  }
}
