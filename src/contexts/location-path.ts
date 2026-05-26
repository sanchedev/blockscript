import { use } from 'react'
import { LocationCtx } from './location'

export function useLocationPath() {
  return use(LocationCtx).locationPath
}
