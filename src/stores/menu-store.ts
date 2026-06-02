import { create } from 'zustand'

interface MenuStore {
  isOpen: boolean
  toggle(): void
}

export const useMenu = create<MenuStore>((set, get) => ({
  isOpen: false,
  toggle() {
    set({ isOpen: !get().isOpen })
  },
}))
