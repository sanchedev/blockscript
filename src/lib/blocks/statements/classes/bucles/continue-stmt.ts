import { Stmt } from '../stmt'
import { Statements } from '../../enum'

export class ContinueStmt extends Stmt {
  static default = new ContinueStmt()
  name = Statements.Continue

  toString(): string {
    return 'continuar'
  }
}
