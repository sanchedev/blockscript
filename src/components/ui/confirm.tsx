import { createPortal } from 'react-dom'
import { Button } from './button'

interface ConfirmProps {
  title: string
  description: string
  onAccept?: () => void
  onCancel?: () => void
  open: boolean
}

export function Confirm({
  title,
  description,
  onAccept,
  onCancel,
  open,
}: ConfirmProps) {
  if (!open) return

  return createPortal(
    <div className='fixed inset-0 z-20'>
      <div
        className='w-full h-full backdrop-blur-xs bg-black/20'
        onClick={() => onCancel?.()}
      />
      <div className='absolute max-w-full max-h-full w-fit h-fit top-1/2 left-1/2 bg-white border-2 border-slate-200 -translate-x-1/2 -translate-y-1/2 p-4 rounded-2xl flex flex-col gap-4'>
        <div className='flex flex-col gap-2'>
          <h2 className='text-2xl'>{title}</h2>
          <p className='text-slate-600'>{description}</p>
        </div>
        <div className='flex justify-end gap-2'>
          <Button onClick={() => onAccept?.()} autoFocus>
            Aceptar
          </Button>
          <Button variant='destructive' onClick={() => onCancel?.()}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
