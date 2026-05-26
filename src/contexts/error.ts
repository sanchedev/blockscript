import { createContext } from 'react'
import type { EvalError, Location } from '../lib/errors'

export interface ErrorContext {
  errors: EvalError[]
  getErrorByLocation(...locations: Location[]): EvalError | undefined
  validate(): void
}

export const ErrorCtx = createContext<ErrorContext>(null!)
