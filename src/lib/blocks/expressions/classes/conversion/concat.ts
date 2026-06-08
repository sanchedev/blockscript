import { ErrorType } from '../../../../errors'
import { Expressions } from '../../enum'
import { Expr } from '../expr'
import { PrimaryType } from '../../../../types'
import { ExprContainer } from '../../../shared/classes/expr-container'
import { field } from '../../../shared/field-decorator'

export class ConcatExpr extends Expr {
  static default = new ConcatExpr()
  name = Expressions.Concat

  @field.exprContainer({
    validate(_container, expr) {
      if (expr.type !== PrimaryType.string)
        return {
          type: ErrorType.Type,
          message: `La concatenación requiere texto en ambos lados, recibió ${expr.type} a la izquierda`,
        }
      return null
    },
    requiredMsg: 'No se ha establecido un texto a la izquierda',
  })
  left = new ExprContainer(this)

  @field.exprContainer({
    validate(_container, expr) {
      if (expr.type !== PrimaryType.string)
        return {
          type: ErrorType.Type,
          message: `La concatenación requiere texto en ambos lados, recibió ${expr.type} a la derecha`,
        }
      return null
    },
    requiredMsg: 'No se ha establecido un texto a la derecha',
  })
  right = new ExprContainer(this)

  type = PrimaryType.string
}
