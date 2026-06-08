import { Stmt } from '../stmt'
import { Statements } from '../../enum'
import { BlockStmt } from '../block-stmt'
import { field } from '../../../shared/field-decorator'

export class ElseStmt extends Stmt {
  static default = new ElseStmt()
  name = Statements.Else

  @field.blockStmt()
  body: BlockStmt = new BlockStmt()

  toString(): string {
    return `sino entonces ${this.body.toString()}`
  }
}
