import { ErrorType } from '../../../../errors'
import { Expressions } from '../../enum'
import { Expr } from '../expr'
import { PrimaryType } from '../../../../types'
import { ExprContainer } from '../../../shared/classes/expr-container'
import { field } from '../../../shared/field-decorator'

export class ToBooleanExpr extends Expr {
  static default = new ToBooleanExpr()
  name = Expressions.ToBoolean

  @field.exprContainer({
    validate(_container, expr) {
      if (expr.type !== PrimaryType.string)
        return {
          type: ErrorType.Type,
          message: `La conversión requiere texto, recibió ${expr.type}`,
        }
      return null
    },
    requiredMsg: 'No se ha establecido un texto para la conversión',
  })
  expression = new ExprContainer(this)

  type = PrimaryType.boolean

  toString(): string {
    return `booleano(${this.expression.get()?.toString() ?? '?'})`
  }
}
