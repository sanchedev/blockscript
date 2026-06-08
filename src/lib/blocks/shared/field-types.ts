import type z from 'zod'
import type { Expr } from '../expressions'
import type { Stmt } from '../statements'
import type { ErrorInfo } from '../../errors'
import type { ExprContainer } from './classes/expr-container'

interface ScalarField {
  kind: 'scalar'
  schema: z.ZodType
}

export interface ExprContainerField<K extends Stmt | Expr = Stmt | Expr> {
  kind: 'expr-container'
  validate?: (self: ExprContainer<K>, expr: Expr) => ErrorInfo | null
  requiredMsg?: string
}

interface BlockStmtField {
  kind: 'block-stmt'
}

export type FieldConfig = ScalarField | ExprContainerField | BlockStmtField

export type FieldMap = Record<string, FieldConfig>
