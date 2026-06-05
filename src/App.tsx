import { useEffect, useRef } from 'react'
import { Console } from './components/console'
import { Entry } from './components/entry'
import { Header } from './components/header'
import { ErrorProvider } from './providers/error'
import { OutputProvider } from './providers/output'
import { exportSavedFile, loadSavedFile } from './lib/serializer/saved-file'
import { useRootStmt } from './stores/root-stmt'
import { useBlockDragStore } from './stores/block-drag-store'

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
        useBlockDragStore.setState({
          positions: [...saved.scatteredStmts, ...saved.scatteredExprs],
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
        const positions = useBlockDragStore.getState().positions
        const data = exportSavedFile(root, positions)
        localStorage.setItem('blockscript-save', JSON.stringify(data))
      }, 5000)
    }
    const unsubRoot = useRootStmt.subscribe(save)
    const unsubBlocks = useBlockDragStore.subscribe(save)
    return () => {
      unsubRoot()
      unsubBlocks()
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
