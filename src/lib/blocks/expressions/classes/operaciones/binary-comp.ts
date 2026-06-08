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

  static allowsMixedTypes(op: BinaryCompOp) {
    return op === BinaryCompOp.Eq || op === BinaryCompOp.Neq
  }

  @field.exprContainer<BinaryCompExpr>({
    validate(container, expr) {
      if (
        expr.type !== PrimaryType.number &&
        !BinaryCompExpr.allowsMixedTypes(container.parent.operator)
      )
        return {
          type: ErrorType.Type,
          message: `La comparación requiere número en ambos lados, recibió ${expr.type} a la izquierda`,
        }
      const rightExpr = container.parent.right.get()
      if (rightExpr && expr.type !== rightExpr.type)
        return {
          type: ErrorType.Type,
          message: `La comparación requiere el mismo tipo que la derecha (${rightExpr.type}) en ambos lados, recibió ${expr.type} a la izquierda`,
        }
      return null
    },
    requiredMsg: 'No se ha establecido un número a la izquierda',
  })
  left = new ExprContainer(this)

  @field.scalar(z.enum(BinaryCompOp))
  operator: BinaryCompOp = BinaryCompOp.Gt

  @field.exprContainer<BinaryCompExpr>({
    validate(container, expr) {
      if (
        expr.type !== PrimaryType.number &&
        !BinaryCompExpr.allowsMixedTypes(container.parent.operator)
      )
        return {
          type: ErrorType.Type,
          message: `La comparación requiere número en ambos lados, recibió ${expr.type} a la derecha`,
        }
      const leftExpr = container.parent.left.get()
      if (leftExpr && expr.type !== leftExpr.type)
        return {
          type: ErrorType.Type,
          message: `La comparación requiere el mismo tipo que la izquierda (${leftExpr.type}) en ambos lados, recibió ${expr.type} a la derecha`,
        }
      return null
    },
    requiredMsg: 'No se ha establecido un número a la derecha',
  })
  right = new ExprContainer(this)

  type = PrimaryType.boolean

  changeOperator(operator: BinaryCompOp) {
    this.operator = operator
  }
}
