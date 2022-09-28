import { useMemo, useRef } from 'react'
import { EditorSidebar } from './editor-sidebar'
import { useMeasure } from 'react-use'
import { EditorCanvas, CanvasRefContext } from './editor-canvas'
import { createScene } from '../../void'
import { EditorToolbar } from './editor-toolbar'
import { useSettings } from '../contexts/settings'
import { SceneContext } from '../contexts/scene'

export let Editor = () => {
  let settings = useSettings()
  let canvasRef = useRef<HTMLCanvasElement>(null)
  let [parentRef, { width: parentWidth, height: parentHeight }] = useMeasure()
  let padding = 40 * 2
  let scene = useMemo(() => {
    return parentHeight > 0 && parentWidth > 0 ? createScene(settings) : null
  }, [settings, parentWidth, parentHeight])

  return (
    <SceneContext.Provider value={scene}>
      <CanvasRefContext.Provider value={canvasRef}>
        <div className="relative flex flex-col items-stretch w-screen h-screen bg-gray-100">
          <EditorToolbar />
          <div className="relative flex-1">
            <div
              // @ts-ignore
              ref={parentRef}
              className="absolute inset-0 right-64 flex justify-center items-center"
            >
              {scene && (
                <EditorCanvas
                  ref={canvasRef}
                  maxWidth={parentWidth - padding}
                  maxHeight={parentHeight - padding}
                />
              )}
            </div>
            <div className="absolute inset-y-0 right-0 w-64 border-l border-gray-200 bg-white">
              {scene && <EditorSidebar />}
            </div>
          </div>
        </div>
      </CanvasRefContext.Provider>
    </SceneContext.Provider>
  )
}
