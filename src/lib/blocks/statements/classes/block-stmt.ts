import z from 'zod'
import { Statements } from '../enum'
import { Stmt } from './stmt'

export class BlockStmt extends Stmt {
  static default = new BlockStmt()
  name = Statements.Block

  children: Stmt[] = []

  edit(...children: Stmt[]): void {
    this.children = children
  }

  copy(): BlockStmt {
    const stmt = new BlockStmt(this.id)
    stmt.children = this.children.filter(Boolean).map((c) => c.copy())
    return stmt
  }
  static configSchema = Stmt.configSchema.extend({
    children: z.array(z.unknown()),
  })
  static createFrom(rawConfig: unknown): BlockStmt | null {
    const { data } = this.configSchema.safeParse(rawConfig)
    if (data == null) return null
    const blockStmt = new BlockStmt(data.id)
    for (const childConfig of data.children) {
      const child = Stmt.createFrom(childConfig)
      if (child == null) return null
      blockStmt.children.push(child)
    }
    return blockStmt
  }
  export(): z.infer<typeof BlockStmt.configSchema> {
    return {
      ...super.export(),
      children: this.children.filter(Boolean).map((s) => s.export()),
    }
  }
}
