import { PrimaryType } from '../../../../types'
import { Expressions } from '../../enum'
import { Expr } from '../expr'
import { AssignExpr } from '../variables/assign'
import { VariableExpr } from '../variables/variable'

export enum IncrementOp {
  Increment = '++',
  Decrement = '--',
}

export class IncrementExpr extends Expr {
  name = Expressions.Increment

  identifier = ''
  operator: IncrementOp = IncrementOp.Increment
  type = PrimaryType.number

  edit(identifier: string, operator: IncrementOp) {
    this.identifier = identifier
    this.operator = operator
  }

  copy(): IncrementExpr {
    const expr = new IncrementExpr()
    expr.identifier = this.identifier
    expr.operator = this.operator
    expr.type = this.type
    return expr
  }

  migrateFrom(source: Expr) {
    if (source instanceof IncrementExpr) {
      this.identifier = source.identifier
      this.operator = source.operator
    } else if (source instanceof AssignExpr) {
      this.identifier = source.identifier
    } else if (source instanceof VariableExpr) {
      this.identifier = source.identifier
    } else {
      this.identifier = ''
      this.operator = IncrementOp.Increment
    }
  }
}
