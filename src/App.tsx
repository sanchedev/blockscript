import { Console } from './components/console'
import { Entry } from './components/entry'
import { Header } from './components/header'
import { Sidebar } from './components/sidebar'
import { ErrorProvider } from './providers/error'
import { GlobalStmtProvider } from './providers/global-stmt'
import { OutputProvider } from './providers/output'

function App() {
  return (
    <GlobalStmtProvider>
      <ErrorProvider>
        <OutputProvider>
          <Header />
          <div className='flex w-full h-screen max-w-screen overflow-hidden bg-white text-slate-950'>
            <Entry />
          </div>
          <Sidebar />
          <Console />
        </OutputProvider>
      </ErrorProvider>
    </GlobalStmtProvider>
  )
}

export default App
