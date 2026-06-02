import { createContext } from 'react'
import type { EvalError, Location } from '../lib/errors'
import type { ExportedDefineds } from '../lib/validator/defineds'

export interface ErrorContext {
  defineds: ExportedDefineds
  errors: EvalError[]
  getErrorByLocation(...locations: Location[]): EvalError | undefined
  validate(): void
}

export const ErrorCtx = createContext<ErrorContext>(null!)
