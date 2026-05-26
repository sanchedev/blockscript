import { use } from 'react'
import { ErrorCtx } from '../contexts/error'

export function useError() {
  return use(ErrorCtx)
}
