import { create } from 'zustand'
import { sidebarInfoSended } from '../lib/event/events'
import type { ComponentType } from 'react'

interface SectionStyle {
  bg: string
  text: string
  border: string
  ring: string
  header: string
}

export interface SidebarInfo {
  sections: {
    title: string
    style?: SectionStyle
    icon?: ComponentType<{ className?: string }>
    options: {
      label: string
      value: string
    }[]
  }[]
  optional: boolean
}

interface SidebarStore {
  pending: boolean
  send: (
    sections: SidebarInfo['sections'],
    cb: (value: string | undefined) => void,
    optional?: boolean,
  ) => void
  info?: SidebarInfo
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  pending: false,
  send(sections, cb, optional = true) {
    set({ pending: true })
    set({ info: { sections, optional } })

    sidebarInfoSended.once((val) => {
      set({ pending: false })
      set({ info: undefined })

      cb(val)
    })
  },
  info: undefined,
}))
