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
    <header className='fixed z-20 top-0 inset-x-0 px-4 h-16 flex justify-between items-center bg-linear-180 from-25% from-slate-100 to-slate-100/70 backdrop-blur-sm border-b-2 border-slate-200 shadow'>
      <div className='h-12 select-none'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='176'
          height='40'
          fill='none'
          viewBox='0 0 176 40'
          className='h-full'>
          <rect radius='12' rx='12' width='167' height='40' fill='#00d492' />
          <rect
            x='2'
            rx='12'
            radius='12'
            width='165'
            height='40'
            fill='#a4f4cf'
          />
          <text
            y='20'
            x='14'
            width='128'
            height='40'
            fontSize='16'
            fontWeight='700'
            fontFamily='Cascadia Code'
            textAnchor='start'
            alignmentBaseline='central'
            fill='#004f3b'>
            Block
          </text>
          <rect
            x='75'
            y='4'
            rx='8'
            width='87'
            height='32'
            strokeWidth='2'
            stroke='#e2e8f0'
            fill='#fff'
          />
          <text
            y='20'
            x='119'
            fontSize='16'
            fontWeight='700'
            fontFamily='Cascadia Code'
            textAnchor='middle'
            alignmentBaseline='central'
            fill='#973c00'>
            Script
          </text>
        </svg>
      </div>
      {/* <h1 className='text-3xl font-bold ml-2'>Tu Aplicación</h1> */}
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
        <Button title='Exportar' shape='square' onClick={exportToFile}>
          <IconDownload className='size-5 text-current' />
        </Button>
        <Button
          title='Ejecutar'
          shape='square'
          variant='primary'
          disabled={isRunning}
          onClick={run}>
          <IconPlayerPlayFilled className='size-5 text-current' />
        </Button>
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
