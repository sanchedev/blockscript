import z from 'zod'
import { ExprContainer } from '../../../shared/classes/expr-container'
import { Stmt } from '../stmt'
import { Statements } from '../../enum'
import { field } from '../../../shared/field-decorator'
import type { VisitorStmt } from '../../../shared/visitor'

export class VariableStmt extends Stmt {
  static default = new VariableStmt()
  name = Statements.Variable

  @field.scalar(z.string())
  identifier: string = ''

  @field.exprContainer({
    requiredMsg: 'No se ha establecido una valor a esta variable',
  })
  expression = new ExprContainer(this)

  changeIdentifier(identifier: string) {
    this.identifier = identifier
  }

  accept(visitor: VisitorStmt): void {
    visitor.visitVariableStmt(this)
  }

  toString(): string {
    return `sea ${this.identifier} = ${this.expression.get()?.toString() ?? '?'}`
  }
}
