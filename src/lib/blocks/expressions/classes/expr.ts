import z from 'zod'
import { PrimaryType, type Type } from '../../../types'
import { Expressions } from '../enum'
import { expressionsClasses } from '../records/classes'

export class Expr {
  static default?: Expr
  name = Expressions.Expression
  id: string
  type: Type = PrimaryType.null

  constructor(id?: string) {
    this.id = id ?? window.crypto.randomUUID()
  }

  copy(): Expr {
    return new Expr(this.id)
  }
  static configSchema = z.object({
    id: z.string(),
    name: z.enum(Object.values(Expressions)),
  })
  static createFrom(rawConfig: unknown): Expr | null {
    const { data } = this.configSchema.safeParse(rawConfig)
    if (data == null) return null
    const cls = (expressionsClasses as Record<string, typeof Expr | undefined>)[data.name]
    if (cls == null) return null
    return cls.createFrom(rawConfig)
  }
  export(): z.infer<typeof Expr.configSchema> {
    return {
      id: this.id,
      name: this.name,
    }
  }
}
