import { useId } from 'react'
import { useVariableIdentifiers } from '../../../../hooks/variables'
import { Input } from '../input'
import clsx from 'clsx'

interface VariableInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
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
      <Input
        {...props}
        list={id}
        autoFocus
        autoComplete='off'
        className={clsx(
          'px-0.5 outline-0 text-center w-full text-sm',
          'bg-gray-50 border-x-2 border-slate-300 rounded-lg min-w-12',
          props.className,
        )}
        value={identifier}
        onChange={(ev) => onIdentifierChange(ev.target.value)}
        style={{ width: identifier.length + 4 + 'ch' }}
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
