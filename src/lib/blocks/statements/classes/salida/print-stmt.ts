import { ExprContainer } from '../../../shared/classes/expr-container'
import { Stmt } from '../stmt'
import { Statements } from '../../enum'
import { field } from '../../../shared/field-decorator'
import type { VisitorStmt } from '../../../shared/visitor'

export class PrintStmt extends Stmt {
  static default = new PrintStmt()
  name = Statements.Print

  @field.exprContainer()
  expression = new ExprContainer(this)

  accept(visitor: VisitorStmt): void {
    visitor.visitPrintStmt(this)
  }

  toString(): string {
    return `imprimir ${this.expression.get()?.toString() ?? '?'}`
  }
}
