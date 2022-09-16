import React, {
  useRef,
  useEffect,
  createContext,
  useContext,
  useMemo,
} from 'react'
import { Sketch, State } from '../engine/sketch'
import { mergeRefs } from 'react-merge-refs'
import {
  getOuterDimensions,
  getOutputDimensions,
  getScreenDimensions,
} from '../engine/export'

export let CanvasRefContext =
  createContext<React.RefObject<HTMLCanvasElement | null> | null>(null)

export let useCanvasRef = (): React.RefObject<HTMLCanvasElement | null> => {
  let canvasRef = useContext(CanvasRefContext)
  if (!canvasRef) throw new Error('You must render `<CanvasContext.Provider`>')
  return canvasRef
}

export let Canvas = React.forwardRef<
  HTMLCanvasElement,
  {
    maxHeight: number
    maxWidth: number
    sketch: Sketch
    zoom?: number
    state: State
  }
>((props, ref) => {
  let { maxHeight, maxWidth, sketch, state, zoom } = props
  let canvasRef = useRef<HTMLCanvasElement>()
  let [outerWidth, outerHeight] = useMemo(
    () => getOuterDimensions(state),
    [state]
  )

  let [outputWidth, outputHeight] = useMemo(
    () => getOutputDimensions(state),
    [state]
  )

  let [screenWidth, screenHeight] = useMemo(
    () => getScreenDimensions(state),
    [state]
  )

  let scale = useMemo(() => {
    return (
      zoom ??
      (outputWidth > maxWidth || outputHeight > maxHeight
        ? Math.min(maxWidth / outputWidth, maxHeight / outputHeight)
        : 1)
    )
  }, [zoom, outputHeight, outputWidth, maxWidth, maxHeight])

  useEffect(() => {
    setTimeout(() => {
      let canvas = canvasRef.current
      if (!canvas) return

      console.log('drawing…')
      let { margins } = state
      let context = canvas.getContext('2d')
      if (!context) return

      // Clear the canvas, zero-ing out any transforms first.
      context.save()
      context.setTransform(1, 0, 0, 1, 0, 0)
      context.clearRect(0, 0, screenWidth, screenHeight)
      context.restore()

      // Run the sketch, transforming `width` and `height`.
      context.save()
      context.scale(screenWidth / outerWidth, screenHeight / outerHeight)
      context.translate(margins[1], margins[0])
      sketch({ ...state, context })
      context.restore()
    }, 1)
  }, [sketch, state, screenWidth, screenHeight])

  return (
    <div
      className="bg-white border border-gray-200 transition-transform"
      style={{ transform: `scale(${scale})` }}
    >
      <canvas
        ref={mergeRefs([ref, canvasRef])}
        className="block"
        width={screenWidth}
        height={screenHeight}
        style={{
          width: outputWidth,
          height: outputHeight,
        }}
      />
    </div>
  )
})
