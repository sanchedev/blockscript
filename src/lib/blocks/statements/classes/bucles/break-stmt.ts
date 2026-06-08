import { Stmt } from '../stmt'
import { Statements } from '../../enum'

export class BreakStmt extends Stmt {
  static default = new BreakStmt()
  name = Statements.Break

  toString(): string {
    return 'romper'
  }
}
