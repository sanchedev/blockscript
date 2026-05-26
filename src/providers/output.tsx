import { useState } from 'react'
import { OutputCtx } from '../contexts/output'
import { useGlobalStmt } from '../hooks/global-stmt'
import { Interpreter, type InterpretResult } from '../lib/interpreter'
import { serialize } from '../lib/serializer'

export function OutputProvider(props: React.PropsWithChildren) {
  const { stmt } = useGlobalStmt()

  const [result, setResult] = useState<InterpretResult | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  const run = () => {
    if (isRunning) return

    localStorage.setItem('blockscript-save', JSON.stringify(serialize(stmt)))

    setIsRunning(true)
    const result = new Interpreter().interpret(stmt.children)
    setResult(result)
    setIsRunning(false)
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
