import { useRef, useState } from 'react'
import { IconPlayerPlay, IconFilePlus, IconUpload, IconDownload } from '@tabler/icons-react'
import { Console } from './console'
import { useGlobalStmt } from '../hooks/global-stmt'
import { BlockStmtComp } from './blocks/statements/block'
import { useOutput } from '../hooks/output'
import { usePersistence } from '../hooks/persistence'
import { Button } from './ui/button'
import { Confirm } from './ui/confirm'
import { deserialize } from '../lib/serializer'
import { BlockStmt } from '../lib/blocks/statements/classes'

export function Entry() {
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
    <div className='w-full h-full overflow-auto flex flex-col p-4 gap-2'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold'>Tu Aplicación</h1>
        <div className='flex gap-2'>
          <Button
            title='Nuevo'
            shape='square'
            onClick={() => setConfirmOpen(true)}>
            <IconFilePlus className='size-5 text-current' />
          </Button>
          <Button
            title='Importar'
            shape='square'
            onClick={() => fileInputRef.current?.click()}>
            <IconUpload className='size-5 text-current' />
          </Button>
          <Button
            title='Exportar'
            shape='square'
            onClick={exportToFile}>
            <IconDownload className='size-5 text-current' />
          </Button>
          <Button
            title='Ejecutar'
            shape='square'
            disabled={isRunning}
            onClick={run}>
            <IconPlayerPlay className='size-5 text-current' />
          </Button>
        </div>
      </div>
      <main className='flex flex-col gap-2 items-start flex-1 overflow-auto p-1'>
        <BlockStmtComp stmt={stmt} main />
      </main>
      <Console />
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
    </div>
  )
}
