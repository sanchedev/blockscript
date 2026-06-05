/* eslint-disable @typescript-eslint/no-explicit-any */
import type z from 'zod'
import type { ErrorInfo } from '../../errors'
import type { Expr } from '../expressions'
import type { ExprContainer } from './classes/expr-container'
import type { FieldConfig } from './field-types'

function field(config: FieldConfig) {
  return (_: undefined, ctx: ClassFieldDecoratorContext) => {
    const key = String(ctx.name)
    ctx.addInitializer(function (this: any) {
      const ctor = this.constructor as any
      if (!Object.hasOwn(ctor, '__fields')) ctor.__fields = {}
      ctor.__fields[key] = config

      if (config.kind === 'expr-container' && config.validate) {
        const container = this[key] as ExprContainer
        if (container)
          container.setValidator(config.validate.bind(this), config.requiredMsg)
      }
    })
  }
}

field.scalar = (schema: z.ZodType) =>
  field({ kind: 'scalar', schema })

field.exprContainer = (
  opts: {
    validate?: (this: any, expr: Expr) => ErrorInfo | null
    requiredMsg?: string
  } = {},
) => field({ kind: 'expr-container', ...opts })

field.blockStmt = () =>
  field({ kind: 'block-stmt' })

export { field }
