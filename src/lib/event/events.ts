import { Event } from './event'

export const sidebarInfoSended = new Event<[value?: string]>()
export const editorChanged = new Event<[]>()
