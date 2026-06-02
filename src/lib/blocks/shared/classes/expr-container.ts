import { ErrorType, type ErrorInfo } from '../../../errors'
import type { Expr } from '../../expressions'
import type { Stmt } from '../../statements'

export class ExprContainer {
  _expr: Expr | null = null

  #validator?: (expr: Expr) => ErrorInfo | null

  constructor(
    public parent: Stmt | Expr,
    validator?: (expr: Expr) => ErrorInfo | null,
    private requiredMessage?: string,
  ) {
    this.#validator = validator
  }

  set(expr: Expr | null) {
    this._expr = expr
  }
  get(): Expr | null {
    return this._expr
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
    return this.#validator?.(expr) ?? null
  }

  copy(): ExprContainer {
    const container = new ExprContainer(
      this.parent,
      this.#validator,
      this.requiredMessage,
    )
    container._expr = this._expr?.copy() ?? null
    return container
  }
  export(): unknown {
    return this._expr?.export() ?? null
  }
}
