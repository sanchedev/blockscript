import { Expressions } from '../../enum'
import { Expr } from '../expr'
import { PrimaryType } from '../../../../types'
import { ExprContainer } from '../../../shared/classes/expr-container'
import { field } from '../../../shared/field-decorator'

export class ToStringExpr extends Expr {
  static default = new ToStringExpr()
  name = Expressions.ToString

  @field.exprContainer({ requiredMsg: 'No se ha establecido un dato para la conversión' })
  expression = new ExprContainer(this)

  type = PrimaryType.string
}
