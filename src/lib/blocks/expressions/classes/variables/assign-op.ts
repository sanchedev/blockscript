import { PrimaryType } from '../../../../types'
import { Expressions } from '../../enum'
import { Expr } from '../expr'
import { NumberLiteralExpr } from '../valores/number-literal'
import { AssignExpr } from '../variables/assign'
import { VariableExpr } from '../variables/variable'

export enum AssignOp {
  AddAssign = '+=',
  SubAssign = '-=',
  MulAssign = '*=',
  DivAssign = '/=',
}

export class AssignOpExpr extends Expr {
  name = Expressions.AssignOp

  identifier = ''
  operator: AssignOp = AssignOp.AddAssign
  expression: Expr = new NumberLiteralExpr()
  type = PrimaryType.number

  edit(identifier: string, operator: AssignOp, expression: Expr) {
    this.identifier = identifier
    this.operator = operator
    this.expression = expression
  }

  copy(): AssignOpExpr {
    const expr = new AssignOpExpr()
    expr.identifier = this.identifier
    expr.operator = this.operator
    expr.expression = this.expression.copy()
    expr.type = this.type
    return expr
  }

  migrateFrom(source: Expr) {
    if (source instanceof AssignOpExpr) {
      this.identifier = source.identifier
      this.operator = source.operator
      this.expression = source.expression.copy()
    } else if (source instanceof AssignExpr) {
      this.identifier = source.identifier
      this.operator = AssignOp.AddAssign
      this.expression = source.expression.copy()
    } else if (source instanceof VariableExpr) {
      this.identifier = source.identifier
      this.operator = AssignOp.AddAssign
      this.expression = new NumberLiteralExpr()
    } else {
      this.identifier = ''
      this.operator = AssignOp.AddAssign
      this.expression = new NumberLiteralExpr()
    }
  }
}
