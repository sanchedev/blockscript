import { use } from 'react'
import { LocationCtx } from '../contexts/location'
import type { Location } from '../lib/errors'

export function LocationProvider(
  props: React.PropsWithChildren<{ location: Location }>,
) {
  const { locationPath } = use(LocationCtx)

  return (
    <LocationCtx value={{ locationPath: [...locationPath, props.location] }}>
      {props.children}
    </LocationCtx>
  )
}
