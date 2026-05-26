import { Expr } from '../expr'

export class NullLiteralExpr extends Expr {
  name = 'null-literal'

  literal = null

  edit() {}

  copy(): NullLiteralExpr {
    const expr = new NullLiteralExpr()
    return expr
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  migrateFrom(_source: Expr) {
    this.literal = null
  }
}
