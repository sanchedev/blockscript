import { Stmt } from '../stmt'
import { Statements } from '../../enum'
import type { VisitorStmt } from '../../../shared/visitor'

export class ContinueStmt extends Stmt {
  static default = new ContinueStmt()
  name = Statements.Continue

  accept(visitor: VisitorStmt): void {
    visitor.visitContinueStmt(this)
  }

  toString(): string {
    return 'continuar'
  }
}
