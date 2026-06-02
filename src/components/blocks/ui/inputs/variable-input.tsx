import { useId } from 'react'
import { ResizeInput, type ResizeInputProps } from '../resize-input'
import { useVariableIdentifiers } from '../../../../hooks/variables'

interface VariableInputProps extends ResizeInputProps {
  identifier: string
  onIdentifierChange: (value: string) => void
}

export function VariableInput({
  identifier,
  onIdentifierChange,
  ...props
}: VariableInputProps) {
  const id = useId()
  const identifiers = useVariableIdentifiers()

  return (
    <>
      <ResizeInput
        value={identifier}
        onChange={(ev) => onIdentifierChange(ev.target.value)}
        list={id}
        placeholder='variable'
        {...props}
      />
      <datalist id={id}>
        {identifiers.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </datalist>
    </>
  )
}
