import { useEffect, useRef, useState } from 'react'
import {
  TransformComponent,
  TransformWrapper,
  type ReactZoomPanPinchRef,
} from 'react-zoom-pan-pinch'
import { Button } from './ui/button'
import { IconFocusCentered, IconZoomIn, IconZoomOut } from '@tabler/icons-react'
import { Menu } from './menu/menu'
import { Board } from './board'

const minExpo = -2
const maxExpo = 2

const minScale = 2 ** minExpo
const maxScale = 2 ** maxExpo

export function Entry() {
  const [width, setWidth] = useState(window.innerWidth)
  const [height, setHeight] = useState(window.innerHeight)
  const [currentScale, setCurrentScale] = useState(1)

  useEffect(() => {
    const onResize = () => {
      setWidth(window.innerWidth)
      setHeight(window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])

  const transformRef = useRef<ReactZoomPanPinchRef | null>(null)

  const zoom = (num: number) => {
    if (!transformRef.current) return

    const { setTransform, state } = transformRef.current
    const { positionX, positionY, scale } = state

    if (num === 0) return

    const expo = Math.log2(scale) + num
    const newScale = Math.max(Math.min(2 ** expo, maxScale), minScale)

    const zoomFactor = newScale / scale

    const centerX = width / 2
    const centerY = height / 2

    const newX = centerX - (centerX - positionX) * zoomFactor
    const newY = centerY - (centerY - positionY) * zoomFactor

    setTransform(newX, newY, newScale, 200)
  }

  const handleWheel = (e: React.WheelEvent) => {
    if (!transformRef.current) return

    const { setTransform, state } = transformRef.current
    const { positionX, positionY, scale } = state

    const newX = positionX - e.deltaX / scale
    const newY = positionY - e.deltaY / scale

    setTransform(newX, newY, scale, 0)
  }

  const handleZoomIn = () => zoom(0.5)
  const handleZoomOut = () => zoom(-0.5)

  const handleReset = () => transformRef.current?.resetTransform()

  return (
    <div
      className='relative w-full h-full overflow-hidden'
      onWheel={handleWheel}>
      <TransformWrapper
        ref={transformRef}
        initialScale={1}
        initialPositionX={-width / 2 + 16}
        initialPositionY={-height / 2 + 16}
        minScale={minScale}
        maxScale={maxScale}
        centerOnInit={false}
        limitToBounds={false}
        onTransform={(ev) => setCurrentScale(ev.state.scale)}
        wheel={{
          disabled: false,
          activationKeys: (keys) => {
            return keys.includes('Control') || keys.includes('Meta')
          },
        }}
        panning={{
          disabled: false,
          excluded: ['input', 'select', 'locked', 'locked *'],
          velocityDisabled: true,
        }}
        pinch={{
          disabled: false,
          excluded: ['input', 'select', 'locked', 'locked *'],
        }}
        doubleClick={{
          disabled: false,
          excluded: ['input', 'select', 'locked', 'locked *'],
        }}>
        <Menu />
        <div className='absolute z-10 bottom-2 right-2 flex gap-2'>
          <Button
            size='sm'
            shape='square'
            aria-label='Ir al centro'
            onClick={handleReset}
            icon={IconFocusCentered}
          />
          <Button
            size='sm'
            shape='square'
            aria-label='Acercar'
            onClick={handleZoomIn}
            disabled={currentScale >= maxScale}
            icon={IconZoomIn}
          />
          <Button
            size='sm'
            shape='square'
            aria-label='Alejar'
            onClick={handleZoomOut}
            disabled={currentScale <= minScale}
            icon={IconZoomOut}
          />
        </div>
        <TransformComponent>
          <Board />
        </TransformComponent>
      </TransformWrapper>
    </div>
  )
}
