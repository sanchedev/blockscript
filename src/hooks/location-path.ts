import { use } from 'react'
import { LocationCtx } from '../contexts/location'

export function useLocationPath() {
  return use(LocationCtx).locationPath
}
