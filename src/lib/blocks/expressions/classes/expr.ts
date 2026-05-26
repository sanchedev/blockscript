import { PrimaryType, type Type } from '../../../types'
import { Editable } from '../../editable'

export abstract class Expr extends Editable {
  name = 'expr'
  type: Type = PrimaryType.null

  abstract copy(): Expr
  abstract migrateFrom(source: Expr): void
}
