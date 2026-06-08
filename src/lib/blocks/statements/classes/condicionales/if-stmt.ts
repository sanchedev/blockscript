import { ErrorType } from '../../../../errors'
import { PrimaryType } from '../../../../types'
import { ExprContainer } from '../../../shared/classes/expr-container'
import { Stmt } from '../stmt'
import { Statements } from '../../enum'
import { BlockStmt } from '../block-stmt'
import { field } from '../../../shared/field-decorator'

export class IfStmt extends Stmt {
  static default = new IfStmt()
  name = Statements.If

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
  thenBody: BlockStmt = new BlockStmt()
}
