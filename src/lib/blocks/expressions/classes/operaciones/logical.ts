import z from 'zod'
import { Expressions } from '../../enum'
import { Expr } from '../expr'
import { PrimaryType } from '../../../../types'
import { ExprContainer } from '../../../shared/classes/expr-container'
import { ErrorType } from '../../../../errors'
import { field } from '../../../shared/field-decorator'

export enum LogicalOp {
  And = 'Y',
  Or = 'O',
}

export class LogicalExpr extends Expr {
  static default = new LogicalExpr()
  name = Expressions.Logical

  @field.exprContainer({
    validate(expr) {
      if (expr.type !== PrimaryType.boolean)
        return {
          type: ErrorType.Type,
          message: `La operación lógica requiere V / F en ambos lados, recibió ${expr.type} a la izquierda`,
        }
      return null
    },
    requiredMsg: 'No se ha establecido un V / F a la izquierda',
  })
  left: ExprContainer = new ExprContainer(this)

  @field.scalar(z.enum(LogicalOp))
  operator: LogicalOp = LogicalOp.And

  @field.exprContainer({
    validate(expr) {
      if (expr.type !== PrimaryType.boolean)
        return {
          type: ErrorType.Type,
          message: `La operación lógica requiere V / F en ambos lados, recibió ${expr.type} a la derecha`,
        }
      return null
    },
    requiredMsg: 'No se ha establecido un V / F a la derecha',
  })
  right: ExprContainer = new ExprContainer(this)

  type = PrimaryType.boolean

  changeOperator(operator: LogicalOp) { this.operator = operator }
}
