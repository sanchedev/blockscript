import { Expressions } from '../../enum'
import { Expr } from '../expr'
import { PrimaryType } from '../../../../types'
import { ExprContainer } from '../../../shared/classes/expr-container'
import { ErrorType } from '../../../../errors'
import { field } from '../../../shared/field-decorator'

export class ReadExpr extends Expr {
  static default = new ReadExpr()
  name = Expressions.Read

  @field.exprContainer({
    validate(_container, expr) {
      if (expr.type !== PrimaryType.string)
        return {
          type: ErrorType.Type,
          message: `La pregunta requiere texto, recibió ${expr.type}`,
        }
      return null
    },
    requiredMsg: 'No se ha establecido una pregunta',
  })
  prompt = new ExprContainer(this)

  type = PrimaryType.string

  toString(): string {
    return `leer(${this.prompt.get()?.toString() ?? '?'})`
  }
}
