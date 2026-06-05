/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-this-alias */
import z from 'zod'
import { Statements } from '../enum'
import { statementsClasses } from '../records/classes'
import { Expr } from '../../expressions'
import type { FieldMap } from '../../shared/field-types'

export class Stmt {
  static __fields: FieldMap = {}
  static default?: Stmt
  id: string
  name: Statements = Statements.Stmt

  constructor(id?: string) {
    this.id = id ?? window.crypto.randomUUID()
  }

  copy(): Stmt {
    const Ctor = this.constructor as typeof Stmt
    const instance = new (Ctor as any)(this.id) as Stmt
    for (const { fields } of Ctor._walkFields()) {
      for (const [key, config] of Object.entries(fields)) {
        const val = (this as any)[key]
        if (config.kind === 'scalar') (instance as any)[key] = val
        else (instance as any)[key] = val.copy()
      }
    }
    return instance
  }

  static get configSchema() {
    const chain = this._walkFields()
    const shape: Record<string, z.ZodType> = {}
    for (const { fields } of chain) {
      for (const [key, config] of Object.entries(fields)) {
        shape[key] = config.kind === 'scalar' ? config.schema : z.unknown()
      }
    }
    return z.object({
      id: z.string(),
      name: z.enum(Object.values(Statements) as [string, ...string[]]),
    }).extend(shape) as any
  }

  static createFrom(rawConfig: unknown): Stmt | null {
    if (this === Stmt) {
      const { data } = z.object({ name: z.string() }).safeParse(rawConfig)
      if (data == null) return null
      const cls = (statementsClasses as Record<string, typeof Stmt | undefined>)[data.name]
      if (cls == null) return null
      return cls.createFrom(rawConfig)
    }

    const result = this.configSchema.safeParse(rawConfig)
    if (!result.success) return null
    const data = result.data as any
    const instance = new (this as any)(data.id) as Stmt

    for (const { fields } of this._walkFields()) {
      for (const [key, config] of Object.entries(fields)) {
        if (config.kind === 'scalar') {
          (instance as any)[key] = data[key]
        } else if (config.kind === 'expr-container') {
          (instance as any)[key]._expr = Expr.createFrom(data[key])
        } else if (config.kind === 'block-stmt') {
          const body = statementsClasses[Statements.Block].createFrom(data[key])
          if (body == null) return null
          ;(instance as any)[key] = body
        }
      }
    }
    return instance
  }

  export(): Record<string, unknown> {
    const result: Record<string, unknown> = {
      id: this.id,
      name: this.name,
    }
    for (const { fields } of (this.constructor as typeof Stmt)._walkFields()) {
      for (const [key, config] of Object.entries(fields)) {
        if (config.kind === 'scalar') {
          result[key] = (this as any)[key]
        } else if (config.kind === 'expr-container') {
          result[key] = (this as any)[key]._expr?.export() ?? null
        } else if (config.kind === 'block-stmt') {
          result[key] = (this as any)[key].export()
        }
      }
    }
    return result
  }

  static _walkFields(): { fields: FieldMap }[] {
    const chain: { fields: FieldMap }[] = []
    let ctor: typeof Stmt = this
    while (ctor && ctor.__fields) {
      if (Object.keys(ctor.__fields).length > 0) chain.unshift({ fields: ctor.__fields })
      ctor = Object.getPrototypeOf(ctor) as typeof Stmt
    }
    return chain
  }
}
