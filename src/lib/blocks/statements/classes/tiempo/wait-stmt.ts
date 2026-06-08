import { ErrorType } from '../../../../errors'
import { PrimaryType } from '../../../../types'
import { ExprContainer } from '../../../shared/classes/expr-container'
import { Stmt } from '../stmt'
import { Statements } from '../../enum'
import { field } from '../../../shared/field-decorator'

export class WaitStmt extends Stmt {
  static default = new WaitStmt()
  name = Statements.Wait

  @field.exprContainer({
    validate(_container, expr) {
      if (expr.type !== PrimaryType.number)
        return {
          type: ErrorType.Type,
          message: `El tiempo de espera debe ser número, recibió ${expr.type}`,
        }
      return null
    },
    requiredMsg: 'No se ha establecido un tiempo de espera',
  })
  duration = new ExprContainer(this)

  toString(): string {
    return `esperar ${this.duration.get()?.toString() ?? '?'} ms`
  }
}
