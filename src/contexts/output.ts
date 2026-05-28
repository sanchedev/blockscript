import { createContext } from 'react'
import type { InterpretResult } from '../lib/interpreter'

interface OutputContext {
  run(): void
  clear(): void
  isRunning: boolean
  result: InterpretResult | null
  time: number | null
}

export const OutputCtx = createContext<OutputContext>(null!)
