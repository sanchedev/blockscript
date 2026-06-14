import { useEffect, useState } from 'react'
import { ErrorCtx } from '../contexts/error'
import { type EvalError, type Location } from '../lib/errors'
import { Validator } from '../lib/validator/validator'
import type { ExportedDefineds } from '../lib/validator/defineds'
import { buildTree } from '../lib/ui/build-tree'
import { useTreeStore } from '../stores/tree-store'

export function ErrorProvider(props: React.PropsWithChildren) {
  const [errors, setErrors] = useState<EvalError[]>([])
  const [defineds, setDefineds] = useState<ExportedDefineds>({
    vars: new Map(),
    children: [],
  })

  const getErrorByLocation = (...locations: Location[]) => {
    let err: EvalError | undefined

    for (const error of errors) {
      if (error.location.length !== locations.length) continue

      if (
        error.location.every(
          (loc, i) =>
            locations[i].index === loc.index && locations[i].stmt === loc.stmt,
        )
      ) {
        err = error
        break
      }
    }

    return err
  }

  const validate = () => {
    const validator = new Validator()
    setErrors(validator.validate(buildTree()))
    setDefineds(validator.defineds.export())
  }

  useEffect(() => {
    const unsub = useTreeStore.subscribe(validate)
    return () => unsub()
  }, [])

  return (
    <ErrorCtx
      value={{
        defineds,
        errors,
        getErrorByLocation,
        validate,
      }}>
      {props.children}
    </ErrorCtx>
  )
}
