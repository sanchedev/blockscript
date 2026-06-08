import { ErrorType } from '../../../../errors'
import { PrimaryType } from '../../../../types'
import { ExprContainer } from '../../../shared/classes/expr-container'
import { Stmt } from '../stmt'
import { Statements } from '../../enum'
import { BlockStmt } from '../block-stmt'
import { field } from '../../../shared/field-decorator'

export class WhileStmt extends Stmt {
  static default = new WhileStmt()
  name = Statements.While

  @field.exprContainer({
    validate(_container, expr) {
      if (expr.type !== PrimaryType.boolean)
        return {
          type: ErrorType.Type,
          message: `La condición debe ser V / F, recibió ${expr.type}`,
        }
      return null
    },
    requiredMsg: 'No se ha establecido una condición',
  })
  condition = new ExprContainer(this)

  @field.blockStmt()
  body: BlockStmt = new BlockStmt()

  toString(): string {
    return `mientras ${this.condition.get()?.toString() ?? '?'} hacer ${this.body.toString()}`
  }
}
