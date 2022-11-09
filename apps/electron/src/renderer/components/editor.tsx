import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { EditorSidebar } from './editor-sidebar'
import { EditorToolbar } from './editor-toolbar'
import { useTab } from '../contexts/tab'
import { Math, Sketch } from 'void'
import { SketchContext } from '../contexts/sketch'
import { EditorConsole } from './editor-console'
import { zoomOut } from '../../shared/zoom'
import { cloneDeep } from 'lodash'

export let Editor = (props: { construct: Sketch['construct'] }) => {
  let { construct } = props
  let [tab, changeTab] = useTab()
  let [sketch, setSketch] = useState<Sketch | null>(null)
  let [error, setError] = useState<Error | null>(null)
  let containerRef = useRef<HTMLDivElement>(null)
  let { zoom, seed, config, layers, traits } = tab

  useEffect(() => {
    let el = containerRef.current
    if (!el) return
    while (el.firstChild) el.removeChild(el.firstChild)

    let sketch = Sketch.of({
      construct,
      container: el,
      hash: `0x${Math.hash(seed).toString(16)}`,
      layers: cloneDeep(layers),
      traits: cloneDeep(traits),
      config: cloneDeep(config),
    })

    Error.stackTraceLimit = 50
    Sketch.on(sketch, 'error', setError)
    Sketch.play(sketch)
    setSketch(sketch)

    let { offsetWidth, offsetHeight } = el
    let [width, height] = Sketch.dimensions(sketch, 'pixel')
    if (
      el.style.transform == '' &&
      width > offsetWidth &&
      height > offsetHeight
    ) {
      changeTab((t) => {
        let ratio = Math.min(offsetWidth / width, offsetHeight / height)
        let zoom = zoomOut(ratio)
        t.zoom = zoom
        el!.style.transition = 'none'
        el!.style.transform = `scale(${zoom})`
        setTimeout(() => (el!.style.transition = `transform .1s ease-in`))
      })
    }

    return () => Sketch.detach(sketch)
  }, [construct, seed, config, layers, traits])

  useLayoutEffect(() => {
    let el = containerRef.current
    if (!el) return
    el.style.transform = `scale(${zoom})`
  }, [zoom])

  return (
    <SketchContext.Provider value={sketch}>
      <div className="flex flex-col items-stretch w-screen h-screen bg-gray-100">
        <div>
          <EditorToolbar />
        </div>
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            <div ref={containerRef} className="flex-1" />
            <div className="flex-0 relative">
              {error && (
                <div className="absolute bottom-0 w-full">
                  <EditorConsole error={error} />
                </div>
              )}
            </div>
          </div>
          <div className="flex-0 w-64 relative z-10  border-l border-gray-200 bg-white">
            {sketch && <EditorSidebar />}
          </div>
        </div>
      </div>
    </SketchContext.Provider>
  )
}
