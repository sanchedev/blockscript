import { PrimaryType, type Type } from '../../../../types'
import { Expressions } from '../../enum'
import { Expr } from '../expr'

export class VariableExpr extends Expr {
  name = Expressions.Variable

  identifier = ''

  type: Type = PrimaryType.null

  edit(identifier: string, type: Type) {
    this.identifier = identifier
    if (type != null) this.type = type
  }
  copy(): VariableExpr {
    const expr = new VariableExpr()
    expr.identifier = this.identifier
    expr.type = this.type
    return expr
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  migrateFrom(_source: Expr) {
    this.identifier = ''
  }
}
