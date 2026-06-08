import { createContext } from 'react'

interface RenderTreeContext {
  (): void
}

export const RenderTreeCtx = createContext<RenderTreeContext>(() => {})
