import z from 'zod'
import { PrimaryType } from '../../../../types'
import { ExprContainer } from '../../../shared/classes/expr-container'
import { Expressions } from '../../enum'
import { Expr } from '../expr'
import { field } from '../../../shared/field-decorator'

export class AssignExpr extends Expr {
  static default = new AssignExpr()
  name = Expressions.Assign

  @field.scalar(z.string())
  identifier: string = ''

  @field.exprContainer({ requiredMsg: 'No se ha establecido un valor a la asignación' })
  expression = new ExprContainer(this)

  @field.scalar(z.enum(PrimaryType))
  type: PrimaryType = PrimaryType.null

  changeIdentifier(identifier: string) { this.identifier = identifier }
}
