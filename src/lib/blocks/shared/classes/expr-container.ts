import { ErrorType, type ErrorInfo } from '../../../errors'
import type { Expr } from '../../expressions'
import type { Stmt } from '../../statements'

export type Validator<T extends Stmt | Expr> = (
  self: ExprContainer<T>,
  expr: Expr,
) => ErrorInfo | null

export class ExprContainer<T extends Stmt | Expr> {
  _expr: Expr | null = null

  _validator?: Validator<T>

  constructor(
    public parent: T,
    validator?: Validator<T>,
    private requiredMessage?: string,
  ) {
    this._validator = validator
  }

  set(expr: Expr | null) {
    this._expr = expr
  }
  get(): Expr | null {
    return this._expr
  }

  setValidator(validator: Validator<T> | undefined, requiredMessage?: string) {
    this._validator = validator?.bind(this)
    if (requiredMessage !== undefined) this.requiredMessage = requiredMessage
  }

  validate(): ErrorInfo | null {
    return this.validateWith(this._expr)
  }
  validateWith(expr: Expr | null): ErrorInfo | null {
    if (expr == null) {
      if (this.requiredMessage != null)
        return {
          type: ErrorType.Required,
          message: this.requiredMessage,
        }
      return null
    }
    return this._validator?.(this, expr) ?? null
  }

  copy(): ExprContainer<T> {
    const container = new ExprContainer<T>(
      this.parent,
      this._validator,
      this.requiredMessage,
    )
    container._expr = this._expr?.copy() ?? null
    return container
  }
  export(): unknown {
    return this._expr?.export() ?? null
  }
}
