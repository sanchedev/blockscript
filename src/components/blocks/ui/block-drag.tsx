import clsx from 'clsx'
import { useTransformContext } from 'react-zoom-pan-pinch'
import { useCurrentDrag, useDrag } from '../../../hooks/drag'
import { Stmt } from '../../../lib/blocks/statements'
import { Expr } from '../../../lib/blocks/expressions'
import { useEffect, useState, type RefAttributes } from 'react'
import { ContextMenu, type ContextMenuOption } from '../../ui/context-menu'
import { currentDragPosition } from '../../../lib/event/events'

export interface BlockDragElement
  extends React.HTMLAttributes<HTMLDivElement>, RefAttributes<HTMLDivElement> {}

interface BlockDragProps extends BlockDragElement {
  obj: Stmt | Expr
  disabled?: boolean
  onRemove: () => void
  contextMenuOptions: ContextMenuOption[]
}

export function BlockDrag({
  obj,
  disabled = false,
  onRemove,
  contextMenuOptions,
  className,
  children,
  ...rest
}: BlockDragProps) {
  const { start, end } = useDrag()
  const data = useCurrentDrag()

  const { state } = useTransformContext()

  const type = obj instanceof Expr ? 'expr' : 'stmt'
  const id = `${type}=${obj.id}`

  const move = ({ x, y }: { x: number; y: number }) => {
    currentDragPosition.emit(x, y)
  }

  const handleDragStart = (ev: React.DragEvent) => {
    ev.stopPropagation()
    ev.dataTransfer.setData('text/plain', id)
    ev.dataTransfer.setDragImage(new Image(), 0, 0)
    const { left, top } = ev.currentTarget.getBoundingClientRect()
    start({
      obj,
      pickPosition: { x: ev.clientX - left, y: ev.clientY - top },
      unlock: () => {
        onRemove()
      },
    })
    move(calcPos(left, top))
    ev.dataTransfer.dropEffect = 'move'
  }
  const handleDrag = (ev: React.DragEvent) => {
    ev.stopPropagation()
    move(
      calcPos(
        ev.clientX - (data?.pickPosition.x ?? 0),
        ev.clientY - (data?.pickPosition.y ?? 0),
      ),
    )
  }
  const handleDragEnd = (ev: React.DragEvent) => {
    ev.stopPropagation()
    end()
  }

  const calcPos = (cX: number, cY: number) => {
    const { positionX, positionY, scale } = state

    const x = -(positionX - cX + 0) / scale
    const y = -(positionY - cY + 64) / scale

    return { x, y }
  }

  function iS<T>(t: T, f?: T) {
    return !disabled ? t : f
  }

  const [menuOpen, setMenuOpen] = useState(false)

  const handleContextMenu = (ev: React.MouseEvent) => {
    if (ev.target == null) return
    if (ev.target instanceof HTMLElement) {
      if (ev.target instanceof HTMLInputElement) return
      if (!detectElement(ev.target, id)) return
      if (!detectIsForMe(ev.target, ev.currentTarget as HTMLElement)) return
    }

    ev.preventDefault()
    setMenuOpen(true)
  }

  useEffect(() => {
    const handleClick = (ev: PointerEvent) => {
      const el = ev.target
      if (el == null) return
      if (el instanceof HTMLElement && detectElement(el, id)) return
      setMenuOpen(false)
    }
    document.addEventListener('click', handleClick)
    document.addEventListener('contextmenu', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('contextmenu', handleClick)
    }
  }, [contextMenuOptions, id])

  return (
    <div
      id={id}
      draggable={iS(true)}
      className={clsx(
        'blockdrag locked',
        data?.obj.id === obj.id && 'opacity-0',
        className,
      )}
      onDragStart={iS(handleDragStart)}
      onDrag={iS(handleDrag)}
      onDragEnd={iS(handleDragEnd)}
      onContextMenu={handleContextMenu}
      {...rest}>
      {menuOpen && <ContextMenu id={id} options={contextMenuOptions} />}
      {children}
    </div>
  )
}

const detectElement = (el: HTMLElement, id: string): boolean => {
  if (el.id === id) return true
  if (el.classList.contains('blockdrag')) return false
  if (el.parentElement == null) return false
  return detectElement(el.parentElement, id)
}
const detectIsForMe = (target: HTMLElement, current: HTMLElement): boolean => {
  if (target.classList.contains('blockdrag')) return false
  if (target.parentElement == null) return false
  if (target.parentElement.id === current.id) return true
  return detectIsForMe(target.parentElement, current)
}
