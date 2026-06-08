import { use } from 'react'
import { OutputCtx } from '../contexts/output'
import { type EvalError } from '../lib/errors'
import { statementsLabels } from '../lib/blocks/statements/records/labels'
import { Button } from './ui/button'
import { IconEraser, IconX } from '@tabler/icons-react'
import { useConsole } from '../hooks/console'

export function Console() {
  const { result, clear, isRunning, time } = use(OutputCtx)
  const { open, closeConsole } = useConsole()

  if (!open) return

  return (
    <div
      className='fixed z-20 bg-white inset-x-0 bottom-0 shrink-0 max-h-[50vh] h-96 overflow-hidden mt-4 border-t-2 border-slate-200 p-2 select-none flex flex-col'
      style={{ height: 384 }}>
      <div className='flex justify-between items-center mb-2 px-1'>
        <h2 className='text-xl font-bold'>Consola</h2>
        <div className='flex gap-2'>
          {result && (
            <Button
              shape='square'
              onClick={clear}
              aria-label='Limpiar'
              icon={IconEraser}
            />
          )}
          <Button
            shape='square'
            onClick={closeConsole}
            aria-label='Cerrar'
            icon={IconX}
          />
        </div>
      </div>

      <div className='bg-slate-50 border-2 border-slate-200 rounded-xl p-3 font-mono overflow-y-auto flex-1 text-sm'>
        {result != null && (
          <pre className='text-slate-800 font-bold'>
            <span className='text-emerald-700'>➜ BlockScript</span>{' '}
            {time != null
              ? `(${(time / 1000).toFixed(2)}s)`
              : isRunning && (
                  <span className='text-slate-500 animate-pulse'>
                    Ejecutando...
                  </span>
                )}
          </pre>
        )}
        <br />
        {result?.errors &&
          result.errors.map((err, i) => (
            <ConsoleLogError
              key={`err-${err.location.map((l) => l.index).join(';')}:${i}`}
              error={err}
            />
          ))}
        {result?.output?.map((line, i) => (
          <ConsoleLog key={`output-${i}`} line={line} />
        ))}
      </div>
    </div>
  )
}

function ConsoleLog({ line }: { line: string }) {
  return (
    <pre className='text-slate-700 py-0.5 whitespace-pre-wrap break-all'>
      {line}
    </pre>
  )
}

function ConsoleLogError({ error }: { error: EvalError }) {
  return (
    <div className='text-red-700 py-0.5 whitespace-pre-wrap break-all'>
      <pre>
        <span className='text-red-400 select-none'>✖ </span>
        <span className='font-bold'>{error.type}</span>: {error.message}
      </pre>
      <pre>
        <span className='font-bold'>{'\t'}En:</span>
      </pre>
      {error.location.map((lc) => (
        <pre key={lc.index + '-' + lc.stmt}>
          {'\t\t'}
          <span className='text-red-400'>[{lc.index + 1}]: </span>
          {statementsLabels[lc.stmt]}
        </pre>
      ))}
      <pre>{'-'.repeat(100)}</pre>
    </div>
  )
}
