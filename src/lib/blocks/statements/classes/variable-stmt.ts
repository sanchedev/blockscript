import z from 'zod'
import { ExprContainer } from '../../shared/classes/expr-container'
import { Stmt } from '../classes/stmt'
import { Statements } from '../enum'
import { field } from '../../shared/field-decorator'

export class VariableStmt extends Stmt {
  static default = new VariableStmt()
  name = Statements.Variable

  @field.scalar(z.string())
  identifier: string = ''

  @field.exprContainer({ requiredMsg: 'No se ha establecido una valor a esta variable' })
  expression: ExprContainer = new ExprContainer(this)

  changeIdentifier(identifier: string) { this.identifier = identifier }
}
