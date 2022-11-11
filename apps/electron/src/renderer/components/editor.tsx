import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { EditorSidebar } from './editor-sidebar'
import { EditorToolbar } from './editor-toolbar'
import { useTab } from '../contexts/tab'
import { Math, Sketch } from 'void'
import { SketchContext } from '../contexts/sketch'
import { EditorConsole } from './editor-console'
import { zoomOut } from '../../shared/zoom'
import { cloneDeep } from 'lodash'
import { useWindowSize } from 'react-use'

export let Editor = (props: { construct: Sketch['construct'] }) => {
  let { construct } = props
  let win = useWindowSize()
  let [tab, changeTab] = useTab()
  let [sketch, setSketch] = useState<Sketch | null>(null)
  let [error, setError] = useState<Error | null>(null)
  let ref = useRef<HTMLDivElement>(null)

  // When the tab changes, if the sketch is stopped, restart it.
  useEffect(() => {
    if (!ref.current) return

    // Clean up any existing sketch artifacts.
    let el = ref.current
    while (el.firstChild) el.removeChild(el.firstChild)
    if (sketch) Sketch.detach(sketch)

    // Create a new sketch object.
    let s = Sketch.of({
      construct,
      container: el,
      hash: `0x${Math.hash(tab.seed).toString(16)}`,
      layers: cloneDeep(tab.layers),
      traits: cloneDeep(tab.traits),
      config: cloneDeep(tab.config),
    })

    // Listen for errors to show the error console.
    Error.stackTraceLimit = 50
    Sketch.on(s, 'error', setError)
    Sketch.play(s)
    setSketch(s)
    return () => Sketch.detach(s)
  }, [
    construct,
    win.width,
    win.height,
    tab.seed,
    tab.layers,
    tab.traits,
    tab.config,
  ])

  // When a sketch is created zoom it to fit the available space.
  useEffect(() => {
    if (sketch && ref.current) {
      let { offsetWidth, offsetHeight } = ref.current
      let [width, height] = Sketch.dimensions(sketch, 'pixel')
      changeTab((t) => {
        let ratio = Math.min(1, offsetWidth / width, offsetHeight / height)
        let zoom = ratio === 1 ? 1 : zoomOut(ratio)
        t.zoom = zoom
      })
    }
  }, [sketch])

  // When the tab's zoom level changes, reflect it in CSS tranforms.
  useLayoutEffect(() => {
    if (!ref.current) return
    let el = ref.current
    el!.style.transition = 'none'
    el!.style.transform = `scale(${tab.zoom})`
    setTimeout(() => (el!.style.transition = `transform .1s ease-in`))
  }, [tab.zoom])

  return (
    <SketchContext.Provider value={sketch}>
      <div className="flex flex-col items-stretch w-screen h-screen bg-gray-100">
        <div>
          <EditorToolbar />
        </div>
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            <div ref={ref} className="flex-1" />
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
