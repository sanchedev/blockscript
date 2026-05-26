import { Entry } from './components/entry'
import { Sidebar } from './components/sidebar'
import { ErrorProvider } from './providers/error'
import { GlobalStmtProvider } from './providers/global-stmt'
import { OutputProvider } from './providers/output'

function App() {
  return (
    <GlobalStmtProvider>
      <ErrorProvider>
        <OutputProvider>
          <div className='flex w-full h-screen bg-white text-slate-950'>
            <Entry />
            <Sidebar />
          </div>
        </OutputProvider>
      </ErrorProvider>
    </GlobalStmtProvider>
  )
}

export default App
