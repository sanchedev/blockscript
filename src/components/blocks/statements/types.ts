import type { Stmt } from '../../../lib/blocks/statements'

export interface StmtCompProps<T extends Stmt = Stmt> {
  stmt: T
}
