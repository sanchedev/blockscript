import z from 'zod'
import { Expressions } from '../../enum'
import { Expr } from '../expr'
import { PrimaryType } from '../../../../types'
import { ExprContainer } from '../../../shared/classes/expr-container'
import { ErrorType } from '../../../../errors'
import { field } from '../../../shared/field-decorator'

export enum BinaryOp {
  Add = '+',
  Sub = '-',
  Mul = '*',
  Div = '/',
  Mod = '%',
}

export class BinaryExpr extends Expr {
  static default = new BinaryExpr()
  name = Expressions.Binary

  @field.exprContainer({
    validate(expr) {
      if (expr.type !== PrimaryType.number)
        return {
          type: ErrorType.Type,
          message: `La operación aritmética requiere número en ambos lados, recibió ${expr.type} a la izquierda`,
        }
      return null
    },
    requiredMsg: 'No se ha establecido un número a la izquierda',
  })
  left: ExprContainer = new ExprContainer(this)

  @field.scalar(z.enum(BinaryOp))
  operator: BinaryOp = BinaryOp.Add

  @field.exprContainer({
    validate(expr) {
      if (expr.type !== PrimaryType.number)
        return {
          type: ErrorType.Type,
          message: `La operación aritmética requiere número en ambos lados, recibió ${expr.type} a la derecha`,
        }
      return null
    },
    requiredMsg: 'No se ha establecido un número a la derecha',
  })
  right: ExprContainer = new ExprContainer(this)

  type = PrimaryType.number

  changeOperator(operator: BinaryOp) { this.operator = operator }
}
