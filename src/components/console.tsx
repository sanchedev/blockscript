import { useRef, useEffect, use } from 'react'
import { OutputCtx } from '../contexts/output'
import { type EvalError } from '../lib/errors'
import { statementsLabels } from '../lib/blocks/statements/records/labels'
import { Button } from './ui/button'

export function Console() {
  const { result, clear } = use(OutputCtx)

  const consoleRef = useRef<HTMLDivElement | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight
    }
  }, [result])

  const startResize: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()

    const onMouseMove = (ev: MouseEvent) => {
      if (consoleRef.current == null) return
      const height = parseFloat(consoleRef.current.style.height)
      const nuevaAltura = height - ev.movementY

      consoleRef.current.style.height =
        Math.max(150, Math.min(nuevaAltura, 512)) + 'px'
    }

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  return (
    <div
      ref={consoleRef}
      className='shrink-0 h-96 overflow-hidden mt-4 border-t-2 border-slate-200 pt-3 relative select-none flex flex-col'
      style={{ height: 384 }}>
      <div
        onMouseDown={startResize}
        className='absolute top-0 left-0 right-0 h-1.5 cursor-ns-resize hover:bg-lime-400/60 transition-colors z-10'
        title='Arrastra hacia arriba para agrandar la consola'
      />

      <div className='flex justify-between items-center mb-2 px-1'>
        <h2 className='text-xl font-bold'>Consola</h2>
        <Button onClick={clear}>Limpiar</Button>
      </div>

      <div
        ref={scrollContainerRef}
        className='bg-slate-50 border-2 border-slate-200 rounded-xl p-3 font-mono overflow-y-auto flex-1'>
        {result?.errors && <ConsoleError errors={result.errors} />}
        {result?.output?.map((line, i) => (
          <pre
            key={i}
            className='text-sm text-slate-700 py-0.5 whitespace-pre-wrap break-all'>
            <span className='text-slate-400 select-none'>{'> '}</span>
            {line}
          </pre>
        ))}
      </div>
    </div>
  )
}

function ConsoleError({ errors }: { errors: EvalError[] }) {
  return errors.map((err) => {
    const key = err.location.map((l) => `${l.index}-${l.stmt}`).join('|')

    return (
      <div
        key={key}
        className='text-sm text-red-700 py-0.5 whitespace-pre-wrap break-all'>
        <pre>
          <span className='text-red-400 select-none'>✖ </span>
          <span className='font-bold'>{err.type}</span>: {err.message}
        </pre>
        <pre>
          <span className='font-bold'>{'\t'}En:</span>
        </pre>
        {err.location.map((lc) => (
          <pre key={lc.index + '-' + lc.stmt}>
            {'\t\t'}
            <span className='text-red-400'>[{lc.index}]: </span>
            {statementsLabels[lc.stmt]}
          </pre>
        ))}
        <pre>{'-'.repeat(100)}</pre>
      </div>
    )
  })
}
