import { useEffect, useMemo, useRef, useState } from 'react'
import { EditorSidebar } from './editor-sidebar'
import { useMeasure } from 'react-use'
import { EditorToolbar } from './editor-toolbar'
import { CanvasRefContext } from '../contexts/canvas'
import { useModule } from '../contexts/module'
import { useTab } from '../contexts/tab'
import { Scene, Schema, ResolvedSettings, Traits, run } from 'void'

export let Editor = () => {
  let module = useModule()
  let [tab] = useTab()
  let elRef = useRef<HTMLDivElement>(null)
  let canvasRef = useRef<HTMLCanvasElement>(null)
  let [parentRef, { width: parentWidth, height: parentHeight }] = useMeasure()
  let [scene, setScene] = useState<Scene | null>(null)
  let [settings, setSettings] = useState<ResolvedSettings | null>(null)
  let [schema, setSchema] = useState<Schema | null>(null)
  let [traits, setTraits] = useState<Traits | null>(null)
  let padding = 40 * 2

  useEffect(() => {
    setTimeout(() => {
      let el = elRef.current
      if (!el || !parentWidth || !parentHeight) return
      let { scene, schema, settings, traits } = run(module, {
        el,
        overrides: tab.settings,
      })

      setScene(scene ?? null)
      setSettings(settings ?? null)
      setSchema(schema ?? null)
      setTraits(traits ?? null)
    }, 1)
  }, [module, tab.settings, parentWidth, parentHeight])

  let scale = useMemo(() => {
    if (!scene) return tab.zoom ?? 1
    if (tab.zoom) return tab.zoom
    let maxWidth = parentWidth - padding
    let maxHeight = parentHeight - padding
    let [outputWidth, outputHeight] = Scene.outputDimensions(scene)
    return outputWidth > maxWidth || outputHeight > maxHeight
      ? Math.min(maxWidth / outputWidth, maxHeight / outputHeight)
      : 1
  }, [
    parentWidth,
    parentHeight,
    tab.zoom,
    scene?.width,
    scene?.height,
    scene?.margin,
    scene?.units,
  ])

  return (
    <CanvasRefContext.Provider value={canvasRef}>
      <div className="relative flex flex-col items-stretch w-screen h-screen bg-gray-100">
        <EditorToolbar schema={schema} />
        <div className="relative flex-1">
          <div
            // @ts-ignore
            ref={parentRef}
            className="absolute inset-0 right-64 flex justify-center items-center"
          >
            <div
              ref={elRef}
              className="bg-white border border-gray-200 transition-transform"
              style={{ transform: `scale(${scale})` }}
            />
          </div>
          <div className="absolute inset-y-0 right-0 w-64 border-l border-gray-200 bg-white">
            <EditorSidebar
              scene={scene}
              settings={settings}
              schema={schema}
              traits={traits}
            />
          </div>
        </div>
      </div>
    </CanvasRefContext.Provider>
  )
}
