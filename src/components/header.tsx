import {
  IconFilePlus,
  IconUpload,
  IconDownload,
  IconPlayerPlayFilled,
} from '@tabler/icons-react'
import { Button } from './ui/button'
import { Confirm } from './ui/confirm'
import { useRef, useState } from 'react'
import { useOutput } from '../hooks/output'
import { usePersistence } from '../hooks/persistence'
import { loadSavedFile } from '../lib/serializer/saved-file'
import { useMenu } from '../stores/menu-store'
import { useRootStmt } from '../stores/root-stmt'
import { useStmtDrag } from '../stores/stmt-drags'
import { useExprDrag } from '../stores/expr-drags'
import { BlockStmt } from '../lib/blocks/statements/classes/block-stmt'

export function Header() {
  const { run, isRunning } = useOutput()
  const toggle = useMenu((state) => state.toggle)
  const stmt = useRootStmt((state) => state.stmt)
  const setStmt = useRootStmt((state) => state.setStmt)
  const stmtDrags = useStmtDrag((state) => state.positions)
  const exprDrags = useExprDrag((state) => state.positions)
  const { exportToFile } = usePersistence(stmt, stmtDrags, exprDrags)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const saved = loadSavedFile(JSON.parse(reader.result as string))
        if (saved.root) {
          setStmt(saved.root)
          useStmtDrag.setState({ positions: saved.scatteredStmts.map(({ stmt, x, y }) => ({ stmt, x, y })) })
          useExprDrag.setState({ positions: saved.scatteredExprs.map(({ expr, x, y }) => ({ expr, x, y })) })
        }
      } catch {
        alert('El archivo no es válido.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleNew = () => {
    localStorage.removeItem('blockscript-save')
    setStmt(new BlockStmt())
    useStmtDrag.setState({ positions: [] })
    useExprDrag.setState({ positions: [] })
    setConfirmOpen(false)
  }

  return (
    <header className='w-full pr-4 h-16 flex justify-between items-center bg-linear-180 from-20% from-slate-100 to-slate-100/60 backdrop-blur-sm border-b-2 border-slate-200 shadow'>
      <div className='h-full select-none w-56 bg-linear-90 from-emerald-100/70 to-transparent pl-8 py-2'>
        <button
          className='m-1 size-10 bg-emerald-200 font-mono font-bold text-emerald-800 rounded-xl border-l-2 border-emerald-400 hover:shadow active:shadow-none active:bg-emerald-300 transition-all'
          aria-label='Abrir el menú'
          onClick={toggle}>
          bs
        </button>
      </div>
      <div className='flex gap-2'>
        <Button
          title='Nuevo'
          shape='square'
          onClick={() => setConfirmOpen(true)}
          icon={IconFilePlus}
        />
        <Button
          title='Importar'
          shape='square'
          onClick={() => fileInputRef.current?.click()}
          icon={IconUpload}
        />
        <Button
          title='Exportar'
          shape='square'
          onClick={exportToFile}
          icon={IconDownload}
        />
        <Button
          title='Ejecutar'
          shape='square'
          variant='primary'
          disabled={isRunning}
          onClick={run}
          icon={IconPlayerPlayFilled}
        />
      </div>
      <input
        ref={fileInputRef}
        type='file'
        accept='.bs'
        className='hidden'
        onChange={handleImport}
      />
      <Confirm
        title='Nuevo proyecto'
        description='Se borrará el proyecto actual. ¿Continuar?'
        open={confirmOpen}
        onAccept={handleNew}
        onCancel={() => setConfirmOpen(false)}
      />
    </header>
  )
}
