import { createContext } from 'react'
import type { Location } from '../lib/errors'

export interface LocationContext {
  locationPath: Location[]
}

export const LocationCtx = createContext<LocationContext>({ locationPath: [] })
