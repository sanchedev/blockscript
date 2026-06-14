import { useEffect, useRef } from 'react'
import { Console } from './components/console'
import { Entry } from './components/entry'
import { Header } from './components/header'
import { ErrorProvider } from './providers/error'
import { OutputProvider } from './providers/output'
import { useBlockDragStore } from './stores/block-drag-store'
import { useTreeStore } from './stores/tree-store'
import { exportStoreFile, importStoreFile } from './lib/serializer/store-file'

const SAVE_KEY = 'blockscript-save'

function Persist() {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    try {
      const raw = localStorage.getItem(SAVE_KEY)
      if (!raw) return
      const data = JSON.parse(raw)
      if (data.version === 1) {
        importStoreFile(data)
      } else {
        throw new Error('Legacy format')
      }
    } catch {
      localStorage.removeItem(SAVE_KEY)
    }
  }, [])

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    const save = () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        const data = exportStoreFile()
        localStorage.setItem(SAVE_KEY, JSON.stringify(data))
      }, 5000)
    }
    const unsubTree = useTreeStore.subscribe(save)
    const unsubDrag = useBlockDragStore.subscribe(save)
    return () => {
      unsubTree()
      unsubDrag()
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
