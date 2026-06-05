import z from 'zod'
import { Expressions } from '../../enum'
import { Expr } from '../expr'
import { PrimaryType } from '../../../../types'
import { ExprContainer } from '../../../shared/classes/expr-container'
import { ErrorType } from '../../../../errors'
import { field } from '../../../shared/field-decorator'

export enum BinaryCompOp {
  Gt = '>',
  Lt = '<',
  Gte = '>=',
  Lte = '<=',
  Eq = '==',
  Neq = '!=',
}

export class BinaryCompExpr extends Expr {
  static default = new BinaryCompExpr()
  name = Expressions.BinaryComp

  @field.exprContainer({
    validate(this: BinaryCompExpr, expr) {
      if (expr.type !== PrimaryType.number && this.operator !== BinaryCompOp.Eq && this.operator !== BinaryCompOp.Neq)
        return {
          type: ErrorType.Type,
          message: `La comparación requiere número en ambos lados, recibió ${expr.type} a la izquierda`,
        }
      const type = this.right.get()?.type ?? PrimaryType.null
      if (expr.type !== type)
        return {
          type: ErrorType.Type,
          message: `La comparación requiere el mismo tipo que la derecha ${type} en ambos lados, recibió ${expr.type} a la izquierda`,
        }
      return null
    },
    requiredMsg: 'No se ha establecido un número a la izquierda',
  })
  left: ExprContainer = new ExprContainer(this)

  @field.scalar(z.enum(BinaryCompOp))
  operator: BinaryCompOp = BinaryCompOp.Gt

  @field.exprContainer({
    validate(this: BinaryCompExpr, expr) {
      if (expr.type !== PrimaryType.number && this.operator !== BinaryCompOp.Eq && this.operator !== BinaryCompOp.Neq)
        return {
          type: ErrorType.Type,
          message: `La comparación requiere número en ambos lados, recibió ${expr.type} a la derecha`,
        }
      const type = this.left.get()?.type ?? PrimaryType.null
      if (expr.type !== type)
        return {
          type: ErrorType.Type,
          message: `La comparación requiere el mismo tipo que la izquierda ${type} en ambos lados, recibió ${expr.type} a la derecha`,
        }
      return null
    },
    requiredMsg: 'No se ha establecido un número a la derecha',
  })
  right: ExprContainer = new ExprContainer(this)

  type = PrimaryType.boolean

  changeOperator(operator: BinaryCompOp) { this.operator = operator }
}
