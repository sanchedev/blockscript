import { useRef, useState } from 'react'
import { OutputCtx } from '../contexts/output'
import { Interpreter, type InterpretResult } from '../lib/interpreter'
import type { EvalError } from '../lib/errors'
import { useConsoleStore } from '../stores/console-store'
import { buildTree } from '../lib/ui/build-tree'

export function OutputProvider(props: React.PropsWithChildren) {

  const [result, setResult] = useState<InterpretResult | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [time, setTime] = useState<number | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const abort = () => {
    abortRef.current?.abort()
  }

  const run = async () => {
    if (isRunning) return

    useConsoleStore.getState().openConsole()

    abortRef.current = new AbortController()
    const signal = abortRef.current.signal

    setTime(null)
    setIsRunning(true)

    const interpreter = new Interpreter()

    interpreter.onOutput = () => {
      setResult({ output: [...interpreter.output], errors: null })
    }

    setResult({ output: [], errors: null })

    try {
      const startTime = performance.now()
      const stmt = buildTree()
      const finalResult = await interpreter.interpret(stmt, signal)
      const endTime = performance.now()
      setTime(endTime - startTime)
      if (finalResult.errors) {
        setResult(finalResult)
      } else {
        setResult({ output: interpreter.output, errors: null })
      }
    } catch (error) {
      setResult({ output: null, errors: [error as EvalError] })
    } finally {
      setIsRunning(false)
    }
  }
  const clear = () => {
    if (isRunning) return

    setResult(null)
  }

  return (
    <OutputCtx
      value={{
        isRunning,
        result,
        run,
        abort,
        clear,
        time,
      }}>
      {props.children}
    </OutputCtx>
  )
}
