import { SketchConfig } from '../../shared/config'
import { createContext, useContext } from 'react'

/** A context for the sketch's JavaScript Sketch. */
export let SketchContext = createContext<SketchConfig | null>(null)

/** Use the sketch's JavaScript Sketch. */
export let useSketch = (): SketchConfig => {
  let sketch = useContext(SketchContext)
  if (!sketch) throw new Error('You must render <SketchContext.Provider>')
  return sketch
}
