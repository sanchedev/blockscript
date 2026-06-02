import { useEffect, useRef } from 'react'
import { Console } from './components/console'
import { Entry } from './components/entry'
import { Header } from './components/header'
import { ErrorProvider } from './providers/error'
import { OutputProvider } from './providers/output'
import { exportSavedFile, loadSavedFile } from './lib/serializer/saved-file'
import { useRootStmt } from './stores/root-stmt'
import { useStmtDrag } from './stores/stmt-drags'
import { useExprDrag } from './stores/expr-drags'

function Persist() {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    try {
      const raw = localStorage.getItem('blockscript-save')
      if (!raw) return
      const saved = loadSavedFile(JSON.parse(raw))
      if (saved.root) {
        useRootStmt.getState().setStmt(saved.root)
      }
      if (saved.scatteredStmts.length > 0 || saved.scatteredExprs.length > 0) {
        useStmtDrag.setState({
          positions: saved.scatteredStmts.map(({ stmt, x, y }) => ({ stmt, x, y })),
        })
        useExprDrag.setState({
          positions: saved.scatteredExprs.map(({ expr, x, y }) => ({ expr, x, y })),
        })
      }
    } catch {
      /* corrupto → estado nuevo */
    }
  }, [])

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    const save = () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        const root = useRootStmt.getState().stmt
        const stmtPositions = useStmtDrag.getState().positions
        const exprPositions = useExprDrag.getState().positions
        const data = exportSavedFile(root, stmtPositions, exprPositions)
        localStorage.setItem('blockscript-save', JSON.stringify(data))
      }, 5000)
    }
    const unsubRoot = useRootStmt.subscribe(save)
    const unsubStmts = useStmtDrag.subscribe(save)
    const unsubExprs = useExprDrag.subscribe(save)
    return () => {
      unsubRoot()
      unsubStmts()
      unsubExprs()
      clearTimeout(timer)
    }
  }, [])

  return null
}

function App() {
  return (
    <ErrorProvider>
      <OutputProvider>
        <Persist />
        <div className='flex flex-col w-full h-screen max-w-screen overflow-hidden bg-white text-slate-950'>
          <Header />
          <Entry />
        </div>
        <Console />
      </OutputProvider>
    </ErrorProvider>
  )
}

export default App
