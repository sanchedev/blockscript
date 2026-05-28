import { useState } from 'react'
import { OutputCtx } from '../contexts/output'
import { useGlobalStmt } from '../hooks/global-stmt'
import { Interpreter, type InterpretResult } from '../lib/interpreter'
import type { EvalError } from '../lib/errors'
import { serialize } from '../lib/serializer'
import { useConsoleStore } from '../stores/console-store'

export function OutputProvider(props: React.PropsWithChildren) {
  const { stmt } = useGlobalStmt()

  const [result, setResult] = useState<InterpretResult | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  const run = async () => {
    if (isRunning) return

    useConsoleStore.getState().openConsole()
    localStorage.setItem('blockscript-save', JSON.stringify(serialize(stmt)))

    setIsRunning(true)

    const interpreter = new Interpreter()

    interpreter.onOutput = () => {
      setResult({ output: [...interpreter.output], errors: null })
    }

    setResult({ output: [], errors: null })

    try {
      const finalResult = await interpreter.interpret(stmt.children)
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
        clear,
      }}>
      {props.children}
    </OutputCtx>
  )
}
