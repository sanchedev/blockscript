/* eslint-disable @typescript-eslint/no-explicit-any */
import type z from 'zod'
import type { ErrorInfo } from '../../errors'
import type { Expr } from '../expressions'

interface ScalarField {
  kind: 'scalar'
  schema: z.ZodType
}

interface ExprContainerField {
  kind: 'expr-container'
  validate?: (this: any, expr: Expr) => ErrorInfo | null
  requiredMsg?: string
}

interface BlockStmtField {
  kind: 'block-stmt'
}

export type FieldConfig = ScalarField | ExprContainerField | BlockStmtField

export type FieldMap = Record<string, FieldConfig>
