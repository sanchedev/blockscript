/* eslint-disable @typescript-eslint/no-explicit-any */
import type z from 'zod'
import type { Expr } from '../expressions'
import type { ExprContainer } from './classes/expr-container'
import type { ExprContainerField, FieldConfig } from './field-types'
import type { Stmt } from '../statements'

function field(config: FieldConfig) {
  return (_: undefined, ctx: ClassFieldDecoratorContext) => {
    const key = String(ctx.name)
    ctx.addInitializer(function (this: any) {
      const ctor = this.constructor as any
      if (!Object.hasOwn(ctor, '__fields')) ctor.__fields = {}
      ctor.__fields[key] = config

      if (config.kind === 'expr-container' && config.validate) {
        const container = this[key] as ExprContainer<Stmt | Expr>
        if (container)
          container.setValidator(config.validate.bind(this), config.requiredMsg)
      }
    })
  }
}

field.scalar = (schema: z.ZodType) => field({ kind: 'scalar', schema })

field.exprContainer = <T extends Stmt | Expr>(
  opts: Omit<ExprContainerField<T>, 'kind'> = {},
) => field({ kind: 'expr-container', ...opts } as FieldConfig)

field.blockStmt = () => field({ kind: 'block-stmt' })

export { field }
