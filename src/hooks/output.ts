import { use } from 'react'
import { OutputCtx } from '../contexts/output'

export function useOutputRun() {
  return use(OutputCtx).run
}

export function useOutput() {
  const { run, isRunning } = use(OutputCtx)
  return { run, isRunning }
}
