import { useEffect, useEffectEvent, useState } from 'react'
import { ErrorCtx } from '../contexts/error'
import { type EvalError, type Location } from '../lib/errors'
import { useGlobalStmt } from '../hooks/global-stmt'
import { validate as validateErrors } from '../lib/validator/validator'
import { editorChanged } from '../lib/event/events'

export function ErrorProvider(props: React.PropsWithChildren) {
  const { stmt } = useGlobalStmt()
  const [errors, setErrors] = useState<EvalError[]>([])

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
    setErrors(validateErrors(stmt.children))
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
        errors,
        getErrorByLocation,
        validate,
      }}>
      {props.children}
    </ErrorCtx>
  )
}
