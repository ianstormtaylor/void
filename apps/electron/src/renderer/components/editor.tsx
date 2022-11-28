import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { EditorSidebar } from './editor-sidebar'
import { EditorToolbar } from './editor-toolbar'
import { useTab } from '../contexts/tab'
import { Sketch } from 'void'
import { SketchContext } from '../contexts/sketch'
import { EditorConsole } from './editor-console'
import { zoomOut } from '../../shared/zoom'
import { cloneDeep } from 'lodash'
import { useWindowSize } from 'react-use'
import { hashInt } from '../utils'
import { useEntrypoint } from '../contexts/entrypoint'

export let Editor = () => {
  let win = useWindowSize()
  let ref = useRef<HTMLDivElement>(null)
  let [entrypoint] = useEntrypoint()
  let [tab, changeTab] = useTab()
  let [construct, setConstruct] = useState<Sketch['construct'] | null>(null)
  let [sketch, setSketch] = useState<Sketch | null>(null)
  let [error, setError] = useState<Error | string | null>(null)

  // When the entrypoint url loads, try to fetch it and catch build errors.
  useEffect(() => {
    if (entrypoint.url != null) {
      import(/* @vite-ignore */ `${entrypoint.url}?t=${entrypoint.timestamp}`)
        .then((pkg) => setConstruct(() => pkg.default))
        .catch(() => setError(entrypoint.url))
    }
  }, [entrypoint.url, entrypoint.timestamp])

  // Attach event listeners for uncaught errors.
  useEffect(() => {
    let onError = (e: ErrorEvent) => {
      e.preventDefault()
      setError(e.error)
    }

    let onRejection = (e: PromiseRejectionEvent) => {
      e.preventDefault()
      setError(e.reason.error)
    }

    window.addEventListener('error', onError)
    window.addEventListener('unhandledrejection', onRejection)
    return () => {
      window.removeEventListener('error', onError)
      window.removeEventListener('unhandledrejection', onRejection)
    }
  })

  // When the tab changes, if the sketch is stopped, restart it.
  useEffect(() => {
    if (!ref.current || !construct) return

    // Clean up any existing sketch artifacts.
    let el = ref.current
    while (el.firstChild) el.removeChild(el.firstChild)
    if (sketch) Sketch.detach(sketch)

    // Create a new sketch object.
    let { seed, layers, traits, config } = tab
    let s = Sketch.of({
      construct,
      container: el,
      layers: cloneDeep(layers),
      traits: cloneDeep(traits),
      config: cloneDeep(config),
      hash: `0x${[
        hashInt(seed),
        hashInt(seed + 1),
        hashInt(seed + 2),
        hashInt(seed + 3),
      ].map((n) => n.toString(16).slice(2))}`,
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
    el.style.transform = `scale(${tab.zoom})`
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
              {error == null ? null : (
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
