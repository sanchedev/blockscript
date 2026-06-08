import z from 'zod'
import { ErrorType } from '../../../../errors'
import { PrimaryType } from '../../../../types'
import { ExprContainer } from '../../../shared/classes/expr-container'
import { Expressions } from '../../enum'
import { Expr } from '../expr'
import { field } from '../../../shared/field-decorator'

export enum AssignOp {
  AddAssign = '+=',
  SubAssign = '-=',
  MulAssign = '*=',
  DivAssign = '/=',
  ModAssign = '%=',
}

export class AssignOpExpr extends Expr {
  static default = new AssignOpExpr()
  name = Expressions.AssignOp

  @field.scalar(z.string())
  identifier: string = ''

  @field.scalar(z.enum(AssignOp))
  operator: AssignOp = AssignOp.AddAssign

  @field.exprContainer({
    validate(_container, expr) {
      if (expr.type !== PrimaryType.number)
        return {
          type: ErrorType.Type,
          message: `La asignación requiere número, recibió ${expr.type}`,
        }
      return null
    },
    requiredMsg: 'No se ha establecido un valor a la asignación',
  })
  expression = new ExprContainer(this)

  type = PrimaryType.number

  changeIdentifier(identifier: string) { this.identifier = identifier }
  changeOperator(operator: AssignOp) { this.operator = operator }

  toString(): string {
    return `${this.identifier} ${this.operator} ${this.expression.get()?.toString() ?? '?'}`
  }
}
