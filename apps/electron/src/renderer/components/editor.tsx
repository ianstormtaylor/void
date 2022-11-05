import { useEffect, useRef, useState } from 'react'
import { EditorSidebar } from './editor-sidebar'
import { EditorToolbar } from './editor-toolbar'
import { useTab } from '../contexts/tab'
import { Sketch } from 'void'
import { SketchContext } from '../contexts/sketch'

export let Editor = (props: { construct: Sketch['construct'] }) => {
  let { construct } = props
  let [tab] = useTab()
  let [sketch, setSketch] = useState<Sketch | null>(null)
  let containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setTimeout(() => {
      if (!containerRef.current) return
      let cont = containerRef.current
      while (cont.firstChild) cont.removeChild(cont.firstChild)
      let sketch = Sketch.of({ construct, container: cont, overrides: tab })
      Sketch.play(sketch)
      setSketch(sketch)
      return () => Sketch.detach(sketch)
    }, 1)
  }, [construct, tab.config, tab.layers, tab.traits])

  // let scale = useMemo(() => {
  //   if (!sketch) return tab.zoom ?? 1
  //   if (tab.zoom) return tab.zoom
  //   let maxWidth = parentWidth - padding
  //   let maxHeight = parentHeight - padding
  //   let [width, height] = Sketch.dimensions(sketch, 'pixel')
  //   return width > maxWidth || height > maxHeight
  //     ? Math.min(maxWidth / width, maxHeight / height)
  //     : 1
  // }, [parentWidth, parentHeight, tab.zoom, sketch])

  return (
    <SketchContext.Provider value={sketch}>
      <div className="flex flex-col items-stretch w-screen h-screen bg-gray-100">
        <EditorToolbar />
        <div className="flex-1 flex">
          <div
            ref={containerRef}
            className="flex-1 flex justify-center items-center"
          />
          <div className="flex-0 w-64 relative z-10  border-l border-gray-200 bg-white">
            {sketch && <EditorSidebar />}
          </div>
        </div>
      </div>
    </SketchContext.Provider>
  )
}
