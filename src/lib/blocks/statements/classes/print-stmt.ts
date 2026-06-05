import { ExprContainer } from '../../shared/classes/expr-container'
import { Stmt } from '../classes/stmt'
import { Statements } from '../enum'
import { field } from '../../shared/field-decorator'

export class PrintStmt extends Stmt {
  static default = new PrintStmt()
  name = Statements.Print

  @field.exprContainer()
  expression: ExprContainer = new ExprContainer(this)
}
