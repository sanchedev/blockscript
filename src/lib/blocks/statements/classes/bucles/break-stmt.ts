import { Stmt } from '../stmt'
import { Statements } from '../../enum'
import type { VisitorStmt } from '../../../shared/visitor'

export class BreakStmt extends Stmt {
  static default = new BreakStmt()
  name = Statements.Break

  accept(visitor: VisitorStmt): void {
    visitor.visitBreakStmt(this)
  }

  toString(): string {
    return 'romper'
  }
}
