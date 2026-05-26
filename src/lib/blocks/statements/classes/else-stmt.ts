import { Stmt } from '../classes/stmt'
import { Statements } from '../enum'
import { BlockStmt } from './block-stmt'

export class ElseStmt extends Stmt {
  name = Statements.Else

  body: BlockStmt = new BlockStmt()

  edit(body: BlockStmt) {
    this.body = body
  }

  copy(): ElseStmt {
    const stmt = new ElseStmt(this.id)
    stmt.body = this.body.copy() as BlockStmt
    return stmt
  }

  migrateFrom(source: Stmt) {
    if (source instanceof ElseStmt) {
      this.body = source.body.copy() as BlockStmt
    } else if (source instanceof BlockStmt) {
      this.body = source.copy() as BlockStmt
    } else {
      this.body = new BlockStmt()
      this.body.children.push(source.copy())
    }
  }
}
