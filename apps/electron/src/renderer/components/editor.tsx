import { useEffect, useRef, useState } from 'react'
import { EditorSidebar } from './editor-sidebar'
import { EditorToolbar } from './editor-toolbar'
import { useTab } from '../contexts/tab'
import { Sketch } from 'void'
import { SketchContext } from '../contexts/sketch'
import { EditorConsole } from './editor-console'

export let Editor = (props: { construct: Sketch['construct'] }) => {
  let { construct } = props
  let [tab] = useTab()
  let [sketch, setSketch] = useState<Sketch | null>(null)
  let [error, setError] = useState<Error | null>(null)
  let containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setTimeout(() => {
      if (!containerRef.current) return
      let cont = containerRef.current
      while (cont.firstChild) cont.removeChild(cont.firstChild)
      let sketch = Sketch.of({
        construct,
        container: cont,
        overrides: tab,
      })

      Error.stackTraceLimit = 50
      Sketch.on(sketch, 'error', setError)
      Sketch.play(sketch)
      setSketch(sketch)
      return () => Sketch.detach(sketch)
    }, 1)
  }, [construct, tab.config, tab.layers, tab.traits])

  return (
    <SketchContext.Provider value={sketch}>
      <div className="flex flex-col items-stretch w-screen h-screen bg-gray-100">
        <div>
          <EditorToolbar />
        </div>
        <div className="flex-1 flex">
          <div className="flex-1 flex flex-col">
            <div
              ref={containerRef}
              className="flex-1 flex justify-center items-center"
            />
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
