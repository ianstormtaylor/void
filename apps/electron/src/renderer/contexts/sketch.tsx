import { createContext, useContext } from 'react'
import { Sketch } from 'void'

/** A context for the current Void sketch. */
export let SketchContext = createContext<Sketch | null>(null)

/** Use the sketch's entrypoint. */
export let useSketch = (): Sketch => {
  let sketch = useContext(SketchContext)
  if (!sketch) throw new Error('You must render <SketchContext.Provider>')
  return sketch
}
