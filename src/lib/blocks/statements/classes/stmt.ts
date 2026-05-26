import { Editable } from '../../editable'
import { Statements } from '../enum'

export abstract class Stmt extends Editable {
  id: string
  name: Statements = Statements.Stmt

  constructor(id?: string) {
    super()
    this.id = id ?? window.crypto.randomUUID()
  }

  abstract copy(): Stmt
  abstract migrateFrom(source: Stmt): void
}
