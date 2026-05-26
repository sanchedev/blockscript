import { Statements } from '../enum'
import { Stmt } from './stmt'

export class BlockStmt extends Stmt {
  name = Statements.Block

  children: Stmt[] = []

  edit(...children: Stmt[]): void {
    this.children = children
  }

  copy(): BlockStmt {
    const stmt = new BlockStmt(this.id)
    stmt.children = this.children.map((c) => c.copy())
    return stmt
  }

  migrateFrom(source: Stmt): void {
    this.children.push(source)
  }
}
