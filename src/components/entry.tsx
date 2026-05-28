import { useEffect, useRef, useState } from 'react'
import { useGlobalStmt } from '../hooks/global-stmt'
import { BlockStmtComp } from './blocks/statements/block'
import {
  TransformComponent,
  TransformWrapper,
  type ReactZoomPanPinchRef,
} from 'react-zoom-pan-pinch'
import { Button } from './ui/button'
import { IconFocusCentered, IconZoomIn, IconZoomOut } from '@tabler/icons-react'

const zooms = [0.25, 0.5, 1, 2, 4]
export function Entry() {
  const { stmt } = useGlobalStmt()
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

    const isInZoomList = zooms.includes(scale)

    let newScale = 1

    const goFrom = (index: number) =>
      zooms[Math.max(Math.min(index + num, zooms.length - 1), 0)]

    if (isInZoomList) {
      newScale = goFrom(zooms.indexOf(scale))
    } else {
      for (let i = 0; i < zooms.length; i++) {
        const zoom = zooms[i]
        const nextZoom = zooms[i + 1]

        if (nextZoom == null) {
          newScale = zoom
          break
        }

        if (zoom <= scale && scale < nextZoom) {
          const diff = (nextZoom - zoom) * 0.5

          if (
            (num < 0 && zoom + diff >= scale) ||
            (num > 0 && nextZoom - diff <= scale) ||
            num === 0
          ) {
            newScale = goFrom(i)
            break
          }

          newScale = goFrom(i + (num < 0 ? 1 : -1))
        }
      }
    }

    if (newScale === scale) return

    const zoomFactor = newScale / scale

    const centerX = width / 2
    const centerY = height / 2

    const newX = centerX - (centerX - positionX) * zoomFactor
    const newY = centerY - (centerY - positionY) * zoomFactor

    setTransform(newX, newY, newScale, 200)
  }

  const handleWheel = (e: React.WheelEvent) => {
    if (!transformRef.current) return

    const { zoomIn, zoomOut, setTransform, state } = transformRef.current
    const { positionX, positionY, scale } = state

    if (e.ctrlKey || e.metaKey) {
      if (e.deltaY < 0) {
        zoomIn(0.1, 0)
      } else {
        zoomOut(0.1, 0)
      }
    } else {
      const newX = positionX - e.deltaX / scale
      const newY = positionY - e.deltaY / scale

      setTransform(newX, newY, scale, 0)
    }
  }

  const handleZoomIn = () => {
    zoom(1)
  }

  const handleZoomOut = () => {
    zoom(-1)
  }
  const handleReset = () => transformRef.current?.resetTransform()

  return (
    <div
      className='relative w-full h-full overflow-hidden'
      onWheel={handleWheel}>
      <TransformWrapper
        ref={transformRef}
        initialScale={1}
        initialPositionX={-width / 2 + 16}
        initialPositionY={-height / 2 + 16 + 80}
        minScale={zooms[0]}
        maxScale={zooms.at(-1)}
        centerOnInit={false}
        limitToBounds={false}
        onTransform={(ev) => setCurrentScale(ev.state.scale)}
        wheel={{
          disabled: false,
          activationKeys: ['Control'],
        }}
        panning={{
          disabled: false,
          excluded: ['input', 'select', '.excluded'],
          velocityDisabled: true,
        }}
        pinch={{ disabled: false, excluded: ['input', 'select', '.excluded'] }}
        doubleClick={{
          disabled: false,
          excluded: ['input', 'select', '.excluded'],
        }}>
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
            disabled={currentScale >= (zooms.at(-1) ?? 10)}
            icon={IconZoomIn}
          />
          <Button
            size='sm'
            shape='square'
            aria-label='Alejar'
            onClick={handleZoomOut}
            disabled={currentScale <= zooms[0]}
            icon={IconZoomOut}
          />
        </div>
        <TransformComponent>
          <main className='px-[50vw] py-[50vh] min-w-[400vw] min-h-[400vh] w-25000 h-50000'>
            <BlockStmtComp stmt={stmt} main fit />
          </main>
        </TransformComponent>
      </TransformWrapper>
    </div>
  )
}
