import { create } from 'zustand'

interface ConsoleStore {
  open: boolean
  openConsole: () => void
  closeConsole: () => void
}

export const useConsoleStore = create<ConsoleStore>((set) => ({
  open: false,
  openConsole: () => set({ open: true }),
  closeConsole: () => set({ open: false }),
}))
