import { useEffect, useEffectEvent, useState } from 'react'
import { ErrorCtx } from '../contexts/error'
import { type EvalError, type Location } from '../lib/errors'
import { Validator } from '../lib/validator/validator'
import { editorChanged } from '../lib/event/events'
import type { ExportedDefineds } from '../lib/validator/defineds'
import { useRootStmt } from '../stores/root-stmt'

export function ErrorProvider(props: React.PropsWithChildren) {
  const stmt = useRootStmt((state) => state.stmt)
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
    setErrors(validator.validate(stmt.children))
    setDefineds(validator.defineds.export())
  }

  const onEditorChange = useEffectEvent(() => {
    validate()
  })

  useEffect(() => {
    editorChanged.on(onEditorChange)
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
