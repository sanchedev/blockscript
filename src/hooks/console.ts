import { useConsoleStore } from '../stores/console-store'

export function useConsole() {
  const open = useConsoleStore((s) => s.open)
  const openConsole = useConsoleStore((s) => s.openConsole)
  const closeConsole = useConsoleStore((s) => s.closeConsole)
  return { open, openConsole, closeConsole }
}
