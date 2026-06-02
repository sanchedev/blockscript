import z from 'zod'
import { Statements } from '../enum'
import { statementsClasses } from '../records/classes'

export class Stmt {
  static default?: Stmt
  id: string
  name: Statements = Statements.Stmt

  constructor(id?: string) {
    this.id = id ?? window.crypto.randomUUID()
  }

  copy(): Stmt {
    return new Stmt(this.id)
  }
  static configSchema = z.object({
    id: z.string(),
    name: z.enum(Object.values(Statements)),
  })
  static createFrom(rawConfig: unknown): Stmt | null {
    const { data } = this.configSchema.safeParse(rawConfig)
    if (data == null) return null
    const cls = (statementsClasses as Record<string, typeof Stmt | undefined>)[data.name]
    if (cls == null) return null
    return cls.createFrom(rawConfig)
  }
  export(): z.infer<typeof Stmt.configSchema> {
    return {
      id: this.id,
      name: this.name,
    }
  }
}
