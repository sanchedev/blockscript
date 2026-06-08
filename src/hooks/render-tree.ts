import { use } from 'react'
import { RenderTreeCtx } from '../contexts/render-tree'

export function useRenderTree() {
  return use(RenderTreeCtx)
}
