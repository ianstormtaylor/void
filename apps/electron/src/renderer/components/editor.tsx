import { useEffect, useMemo, useRef, useState } from 'react'
import { EditorSidebar } from './editor-sidebar'
import { useMeasure } from 'react-use'
import { EditorToolbar } from './editor-toolbar'
import { CanvasRefContext } from '../contexts/canvas'
import { useModule } from '../contexts/module'
import { useTab } from '../contexts/tab'
import { Settings, Sketch } from 'void'

export let Editor = () => {
  let module = useModule()
  let [tab] = useTab()
  let elRef = useRef<HTMLDivElement>(null)
  let canvasRef = useRef<HTMLCanvasElement>(null)
  let [parentRef, { width: parentWidth, height: parentHeight }] = useMeasure()
  let [sketch, setSketch] = useState<Sketch | null>(null)
  let padding = 40 * 2

  useEffect(() => {
    setTimeout(() => {
      if (!elRef.current || !parentWidth || !parentHeight) return
      let el = elRef.current
      while (el.firstChild) {
        el.removeChild(el.firstChild)
      }

      let sketch = Sketch.of(module.default, {
        el,
        overrides: {
          traits: tab.traits,
          config: tab.config,
        },
      })

      Sketch.play(sketch)
      setSketch(sketch)
      return () => Sketch.stop(sketch)
    }, 1)
  }, [module, tab.config, tab.traits, parentWidth, parentHeight])

  let scale = useMemo(() => {
    let settings = sketch?.settings
    if (!settings) return tab.zoom ?? 1
    if (tab.zoom) return tab.zoom
    let maxWidth = parentWidth - padding
    let maxHeight = parentHeight - padding
    let [outputWidth, outputHeight] = Settings.outputDimensions(settings)
    return outputWidth > maxWidth || outputHeight > maxHeight
      ? Math.min(maxWidth / outputWidth, maxHeight / outputHeight)
      : 1
  }, [parentWidth, parentHeight, tab.zoom, sketch?.settings])

  return (
    <CanvasRefContext.Provider value={canvasRef}>
      <div className="relative flex flex-col items-stretch w-screen h-screen bg-gray-100">
        <EditorToolbar />
        <div className="relative flex-1">
          <div
            // @ts-ignore
            ref={parentRef}
            className="absolute inset-0 right-64 flex justify-center items-center"
          >
            <div
              ref={elRef}
              className="canvas bg-white border border-gray-200 transition-transform"
              style={{ transform: `scale(${scale})` }}
            />
          </div>
          <div className="absolute inset-y-0 right-0 w-64 border-l border-gray-200 bg-white">
            <EditorSidebar sketch={sketch} />
          </div>
        </div>
      </div>
    </CanvasRefContext.Provider>
  )
}
