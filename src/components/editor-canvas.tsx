import React, { useRef, useEffect } from 'react'
import { mergeRefs } from 'react-merge-refs'
import { useModule } from '../contexts/module'

export let EditorCanvas = React.forwardRef<
  HTMLCanvasElement,
  {
    maxHeight: number
    maxWidth: number
  }
>((props, ref) => {
  let module = useModule()
  let { maxHeight, maxWidth } = props
  let canvasRef = useRef<HTMLCanvasElement>()

  useEffect(() => {
    setTimeout(() => {
      let canvas = canvasRef.current
      if (!canvas) return
      Void.canvas = canvas
      module.default()
    }, 1)
  }, [module, maxWidth, maxHeight])

  return (
    <div className="bg-white border border-gray-200">
      <canvas ref={mergeRefs([ref, canvasRef])} className="block" />
    </div>
  )
})
