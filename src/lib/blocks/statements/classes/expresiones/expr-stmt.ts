import { ExprContainer } from '../../../shared/classes/expr-container'
import { Stmt } from '../stmt'
import { Statements } from '../../enum'
import { field } from '../../../shared/field-decorator'

export class ExprStmt extends Stmt {
  static default = new ExprStmt()
  name = Statements.Expr

  @field.exprContainer()
  expression = new ExprContainer(this)

  toString(): string {
    return `${this.expression.get()?.toString() ?? '?'};`
  }
}
