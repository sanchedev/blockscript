import {
  IconFilePlus,
  IconUpload,
  IconDownload,
  IconPlayerPlayFilled,
} from '@tabler/icons-react'
import { Button } from './ui/button'
import { Confirm } from './ui/confirm'
import { useRef, useState } from 'react'
import { useGlobalStmt } from '../hooks/global-stmt'
import { useOutput } from '../hooks/output'
import { usePersistence } from '../hooks/persistence'
import { BlockStmt } from '../lib/blocks/statements/classes'
import { deserialize } from '../lib/serializer'

export function Header() {
  const { run, isRunning } = useOutput()
  const { stmt, replaceStmt } = useGlobalStmt()
  const { exportToFile } = usePersistence(stmt)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const node = deserialize(JSON.parse(reader.result as string))
        if (node instanceof BlockStmt) {
          replaceStmt(node)
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
    replaceStmt(new BlockStmt())
    setConfirmOpen(false)
  }

  return (
    <header className='fixed z-20 top-0 inset-x-0 pr-4 h-16 flex justify-between items-center bg-linear-180 from-20% from-slate-100 to-slate-100/60 backdrop-blur-sm border-b-2 border-slate-200 shadow'>
      <div className='h-full select-none w-56 bg-linear-90 from-emerald-100/70 to-transparent pl-8 py-2'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='40'
          height='40'
          fill='none'
          viewBox='0 0 40 40'
          className='h-12'>
          <rect rx='12' width='40' height='40' fill='#00d492' />

          <rect x='2' y='0' rx='11' width='38' height='40' fill='#a4f4cf' />

          <text
            y='20'
            x='20'
            fontSize='16'
            fontWeight='700'
            fontFamily="Cascadia Code, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
            textAnchor='middle'
            alignmentBaseline='central'
            fill='#004f3b'>
            bs
          </text>
        </svg>
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
