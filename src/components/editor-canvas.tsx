import React, {
  useRef,
  useEffect,
  createContext,
  useContext,
  useMemo,
} from 'react'
import { mergeRefs } from 'react-merge-refs'
import {
  getOuterDimensions,
  getOutputDimensions,
  getScreenDimensions,
} from '../export'
import { __VOID__ } from '../../void/internal'
import { useScene } from '../contexts/scene'
import { useModule } from '../contexts/module'

export let CanvasRefContext =
  createContext<React.RefObject<HTMLCanvasElement | null> | null>(null)

export let useCanvasRef = (): React.RefObject<HTMLCanvasElement | null> => {
  let canvasRef = useContext(CanvasRefContext)
  if (!canvasRef) throw new Error('You must render `<CanvasContext.Provider`>')
  return canvasRef
}

export let EditorCanvas = React.forwardRef<
  HTMLCanvasElement,
  {
    maxHeight: number
    maxWidth: number
  }
>((props, ref) => {
  let module = useModule()
  let scene = useScene()
  let { maxHeight, maxWidth } = props
  let canvasRef = useRef<HTMLCanvasElement>()
  let [outerWidth, outerHeight] = useMemo(
    () => getOuterDimensions(scene),
    [scene]
  )

  let [outputWidth, outputHeight] = useMemo(
    () => getOutputDimensions(scene),
    [scene]
  )

  let [screenWidth, screenHeight] = useMemo(
    () => getScreenDimensions(scene),
    [scene]
  )

  let scale = useMemo(() => {
    return outputWidth > maxWidth || outputHeight > maxHeight
      ? Math.min(maxWidth / outputWidth, maxHeight / outputHeight)
      : 1
  }, [outputHeight, outputWidth, maxWidth, maxHeight])

  useEffect(() => {
    setTimeout(() => {
      let canvas = canvasRef.current
      if (!canvas) return

      console.log('drawing…')
      let { margin } = scene
      let context = canvas.getContext('2d')
      if (!context) return

      context.save()
      context.setTransform(1, 0, 0, 1, 0, 0)
      context.clearRect(0, 0, screenWidth, screenHeight)
      context.scale(screenWidth / outerWidth, screenHeight / outerHeight)
      context.translate(margin[1], margin[0])
      let prevScene = __VOID__.scene
      __VOID__.scene = scene
      module.sketch({ ...scene, context })
      __VOID__.scene = prevScene
      context.restore()
    }, 1)
  }, [module, scene, screenWidth, screenHeight])

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
